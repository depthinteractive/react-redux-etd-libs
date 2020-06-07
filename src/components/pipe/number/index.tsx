import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

export default class NumberPipe extends Component<Props, IState> {
  render(){
    const { value }: { value: number } = this.props;
    const formatedValue: RegExpMatchArray | null = value.toString().match(/^-?\d+(?:\.\d{0,2})?/);
    return (
      <NumberFormat 
        value={_.isArray(formatedValue) && formatedValue.length > 0 && value % 1 !== 0 ? formatedValue[0] : value.toFixed(2)} 
        displayType={'text'} 
        thousandSeparator=" " 
        renderText={v => (<div className="text-right w-100">{v}</div>)} />
    );
  }
}

interface IProps {
  value: number;
}
interface IState {}

type Props = IProps;