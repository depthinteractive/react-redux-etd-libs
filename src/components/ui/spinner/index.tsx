import React, { Component } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import _ from 'lodash';
import './Spinner.css'

export default class Spinner extends Component<Props, IState> {
  render(){
    const { fontSize } = this.props;
    const antIcon = <LoadingOutlined style={{ fontSize: _.isNil(fontSize) ? 24 : fontSize }} spin />;
    return (
      <Spin indicator={antIcon} />
    );
  }
}

interface IProps {
  fontSize?: number
}
interface IState {}

type Props = IProps;