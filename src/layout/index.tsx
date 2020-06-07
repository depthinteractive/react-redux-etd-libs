import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { StaticContext } from 'react-router';
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import _ from 'lodash';
// layouts
import PrivateLayout from './private';
import PublicLayout from './public';
// routes
import privateRoutes, { PrivateRouteTypes } from './routes/privateRoutes';
import publicRoutes,  { PublicRouteTypes }  from './routes/publicRoutes';
import sessionRoutes from './routes/sessionRoutes';
// components
// import Auth from '../components/public/pages/auth';
import NotFound from './public/NotFound';
// store
import { AppState } from '../store';
import { AppActions } from '../store/actions';
import { onLogged } from '../store/auth/actions';
// core
import withErrorHandler from '../core/withErrorHandler';
import Axios from '../core/axios';

class Layout extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.props.onLogged();
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>

          { _.map<typeof publicRoutes>(publicRoutes, (route: PublicRouteTypes, key: string) => {
            const { component, path } = route;
            return (
              <Route
                exact
                path={ path }
                key={ key }
                render={ (route: RouteComponentProps<any, StaticContext, any>) => 
                  <PublicLayout component={ component } route={ route } auth={ this.props.auth }/>}
              />
            )
          }) }

          { _.map<typeof privateRoutes | typeof publicRoutes>(privateRoutes, (route: PrivateRouteTypes, key: string) => {
            const { component, path } = route;
            return (
              <Route
                exact
                path={ path }
                key={ key }
                render={ (route: RouteComponentProps<any, StaticContext, any>) =>
                  this.props.auth.token ? (
                    <PrivateLayout component={ component } route={ route } auth={ this.props.auth }/>
                  ) : null
                  // (
                  //   <PublicLayout component={ Auth } route={ route } auth={ this.props.auth }/>
                  // )
                }
              />
            )
          }) }

          { _.map<typeof publicRoutes>(sessionRoutes, (route: PublicRouteTypes, key: string) => {
              const { component, path } = route;
              return (
                <Route
                  exact
                  path={ path }
                  key={ key }
                  render={ (route: RouteComponentProps<any, StaticContext, any>) =>
                    this.props.auth.token ? (
                      <Redirect to="/profile"/>
                    ) : (
                      <PublicLayout component={ component } route={ route } auth={ this.props.auth }/>
                    )
                  }
                />
              )
          }) }

          <Route component={ NotFound } />
        </Switch>
      </BrowserRouter>
    );
  }
}

interface IProps {}
interface IState {}

/**
 * If you would like you can to use "withReducer" function to inject reducer on a fly
 * 
 * To determine: 
 *    @first const reducers = { auth: authReducer }; const injectReducers = combineReducers(reducers);
 * Extend state "AppState": 
 *    @second state: AppState & ReturnType<typeof injectReducers>
 * Extend dispatch "AppState" and "AppActions": 
 *    @third dispatch: ThunkDispatch<AppState & ReturnType<typeof injectReducers>, any, AppActions & Auth>
 * Wrap exported component to:
 *    @fourth withReducer(reducers)(withRouter(connector(withErrorHandler(Layout, Axios))))
 * */ 
const mapStateToProps = (state: AppState, ownProps: IProps) => ({ auth: state.auth });
const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, AppActions>, ownProps: IProps) => (bindActionCreators({ onLogged }, dispatch));
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & IProps;
export default withRouter(connector(withErrorHandler(Layout, Axios)));