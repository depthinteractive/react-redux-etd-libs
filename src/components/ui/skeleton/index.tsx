import React, { Component } from 'react';
import { Skeleton as Scl } from 'antd';

export default class Skeleton extends Component<Props, IState> {
  render = () => (<Scl active />);
}

interface IProps {}
interface IState {}

type Props = IProps;