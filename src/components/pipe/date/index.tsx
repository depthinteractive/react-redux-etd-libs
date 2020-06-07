import React, { Component } from 'react';

export default class DatePipe extends Component<Props, IState> {
  render(){
    const { value } = this.props;
    return (<div className="text-right">{value}</div>);
  }
}

interface IProps {
  value: string;
}
interface IState {}

type Props = IProps;