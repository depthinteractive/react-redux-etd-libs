import React, { Component } from 'react';
import { Drawer, Tabs } from 'antd';
import './CellInfo.css';

export default class CellInfo extends Component<Props, IState> {
  render(){
    const { data } = this.props;
    return (
      <Drawer
        className="bl-cell-info"
        width={420}
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Tabs defaultActiveKey="1">
          {data.popupLinkField 
            ? <Tabs.TabPane tab="Информация" key="info"><div className="pre-line">{data.popupLinkField}</div></Tabs.TabPane>
            : null}
        </Tabs>
      </Drawer>
    )
  }
}

interface IProps {
  visible: boolean;
  data: { [key: string]: string };
  onClose: () => void;
}
interface IState {}

type Props = IProps;