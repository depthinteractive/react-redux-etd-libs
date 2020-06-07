import React, { Component } from 'react';
import { Button } from 'antd';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ButtonHTMLType } from 'antd/lib/button/button';
import './Btn.css';

export default class Btn extends Component<Props, IState> {
  render(){
    const { htmlType, size, form, loading, disabled, icon, textContent } = this.props;
    return (<Button 
      type="primary" 
      htmlType={htmlType} 
      size={size} 
      form={form} 
      loading={loading}
      disabled={disabled}
      icon={icon}>{textContent}</Button>);
  }
}

interface IProps {
  textContent?: string;
  htmlType?: ButtonHTMLType;
  form?: string;
  icon?: any;
  loading?: boolean;
  disabled?: boolean;
  size?: SizeType
}
interface IState {}

type Props = IProps;