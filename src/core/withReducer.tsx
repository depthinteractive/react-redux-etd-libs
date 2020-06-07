import React, { Component } from "react";
import { Reducer, AnyAction } from 'redux';
import { ReactReduxContext, ReactReduxContextValue } from 'react-redux';

const withReducer = (reducers: { [key: string]: Reducer<any, any> }) => (WrappedComponent: any) => {
  interface IProps {
    onVisibleReport?(v: boolean): void
  }
  interface IState {}

  type Props = IProps;
  
  return class extends Component<Props, IState> {
    static contextType = ReactReduxContext;
    
    componentDidMount(){
      this.context.store.injectReducers!(reducers);
    }
    
    render () {
      return (
        <ReactReduxContext.Consumer>
          {(context: ReactReduxContextValue<any, AnyAction>) => (<WrappedComponent { ...this.props } />)}
        </ReactReduxContext.Consumer>
      );
    }
  }
}
export default withReducer;