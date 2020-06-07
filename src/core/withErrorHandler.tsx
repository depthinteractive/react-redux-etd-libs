import React, { Component } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler, CancelTokenSource, CancelToken } from 'axios';
import { ThunkDispatch } from 'redux-thunk';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notification, message } from 'antd';
import { IconType } from 'antd/lib/notification';
import _ from 'lodash';
// store
import { AppState } from '../store';
import { AppActions } from '../store/actions';
import { onLogout } from '../store/auth/actions';
import { IAuth } from '../store/auth/types';
// core
import { IResponse, IError, IResponseError } from './Response';
import { ExtendedAxiosRequestConfig } from './axios';
// ui
import Spinner from '../components/ui/spinner';

export interface IWithErrorHandler { errors: IResponseError[] | null; }
export const WithErrorHandlerContext = React.createContext<IWithErrorHandler | undefined>( undefined );

const withErrorHandler = (WrappedComponent: any, Axios: AxiosInstance) => {
  interface IProps {}
  interface IState extends IWithErrorHandler {
    spinner: boolean;
    onSpinner(v: boolean): void;
    onOpenNotification(config: { type: IconType, message: string, description: string } ): void;
  }
  
  let reqInterceptor: number;
  let resInterceptor: number;
  const mapStateToProps = (state: AppState, ownProps: IProps) => ({ auth: state.auth });
  const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>, ownProps: IProps) => (bindActionCreators({ onLogout }, dispatch));
  const connector = connect(mapStateToProps, mapDispatchToProps);

  type Props = ConnectedProps<typeof connector>;
  
  return connector(class extends Component<Props, IState> {
    protected pendingRequests: Map<any, any>;

    constructor(props: Props, protected timeout: NodeJS.Timeout) {
      super(props);
      this.pendingRequests = new Map();
      this.state = {
        errors: null, 
        spinner: false,
        onSpinner: this.onSpinner,
        onOpenNotification: this.onOpenNotification
      }
      this.init();
    }

    init = async (): Promise<void> => {
      reqInterceptor = Axios.interceptors.request.use(
        async (req: AxiosRequestConfig | ExtendedAxiosRequestConfig): Promise<AxiosRequestConfig | ExtendedAxiosRequestConfig> => {
          const auth: IAuth = this.props.auth;
          const spinner: boolean = (req as ExtendedAxiosRequestConfig).spinner;
          const source: CancelTokenSource = axios.CancelToken.source();
          const requestId: string = `${req.method}_${req.url}`;
          const cancelToken: CancelToken = source.token;
          
          if(auth.token) req.headers = { ...req.headers, Authorization: 'Bearer ' + auth.token };

          this.setState({ spinner: spinner === false ? spinner : true });
          this.addRequest(requestId, source.cancel);
          return { ...req, cancelToken, requestId };
        });
      resInterceptor = Axios.interceptors.response.use(
        async (res: AxiosResponse<IResponse<any>>): Promise<AxiosResponse<IResponse<any>>> => {
          const { requestId, msg } = res.config as ExtendedAxiosRequestConfig;
          this.timeout = setTimeout(() => {
            this.setState({ 
              spinner: this.pendingRequests.size <= 1 ? false : this.state.spinner
            });
          }, 2000);
          if(requestId) this.removeRequest(requestId);
          if(msg) message.success(msg);
          return res;
        },
        async (err: IError<IResponseError>): Promise<never> => {
          if(err.response){
            let errors: IResponseError[] = [];

            if(err.response.data.errors === undefined){
              errors.push(err.response.data);
            }else if(err.response.data.errors instanceof Array){
              errors = [...err.response.data.errors];
            }
            
            _.map(errors, (err: IResponseError): void => {
              if(err.code === 422) this.props.onLogout();
            });
            this.onOpenNotification({
              type: 'error',
              message: err.response.data.code?.toString() || '500',
              description: err.response.data.messages
            });
            console.log(err.response);
            this.setState({ errors, spinner: false });
          }
          return Promise.reject(err);
        });
    };

    addRequest(requestId: string, fn: Canceler): void {
      this.cancelRequest(requestId);
      this.pendingRequests.set(requestId, fn);
    }
  
    removeRequest(requestId: string): void {
      this.pendingRequests.delete(requestId);
    }
  
    cancelRequest(requestId: string): void {
      if(this.pendingRequests.has(requestId)) {
        const fn = this.pendingRequests.get(requestId);
        fn();
        this.removeRequest(requestId);
      }
    }

    componentWillUnmount(): void {
      Axios.interceptors.request.eject(reqInterceptor);
      Axios.interceptors.response.eject(resInterceptor);
      clearTimeout(this.timeout);
    }

    onSpinner = async (v: boolean): Promise<void> => {
      this.setState({ spinner: v });
    }

    onOpenNotification = async (config: { type: IconType, message: string, description: string } ): Promise<void> => {
      notification.open(config);
    };

    render () {
      const context: IWithErrorHandler = { ...this.state };
      return (
        <>
          {this.state.spinner ? <Spinner /> : null}
          <WithErrorHandlerContext.Provider value={ context }>
            <WrappedComponent { ...this.props } />
          </WithErrorHandlerContext.Provider>
        </>
      );
    }
  })
}
export default withErrorHandler;
