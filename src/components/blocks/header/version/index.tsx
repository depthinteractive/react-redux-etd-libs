import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './Version.css'

export default class Version extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      version: {
        header: 'Версия интерфейса',
        content: process.env.REACT_APP_VERSION || '1.0.0'
      }
    }
  }

  dropdown = (): JSX.Element => {
    return (
      <Menu selectable={false}>
        <Menu.Item>
          <div className="header">{this.state.version.header}</div>
          <div className="content">{this.state.version.content}</div>
        </Menu.Item>
      </Menu>
    )
  }

  render(){
    return (
      <Dropdown overlay={this.dropdown}>
        <button className="btn btn-version" onClick={e => e.preventDefault()}><ExclamationCircleOutlined /></button>
      </Dropdown>
    )
  }
}

interface IProps {}
interface IState {
  version: { header: string, content: string }
}

type Props = IProps;