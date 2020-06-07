import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Layout, Tabs } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import './Sidebar.css';
// store
import { AppState } from '../../../store';
// blocks
import ReportType from './reportType';

class Sidebar extends Component<Props, IState> {
  render(){
    return (
      <Layout.Sider className="bl-sidebar" theme="light" width="400" collapsedWidth="0" trigger={null} collapsible collapsed={this.props.collapsed}>
        <Scrollbars autoHeight autoHeightMin={100} autoHeightMax="100vh">
          <div className="container">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Параметры" key="parameters">
                <ReportType onVisibleReport={this.props.onVisibleReport} /> 
              </Tabs.TabPane>
              <Tabs.TabPane tab="Фильтры" key="filters" disabled={this.props.report.rows.length > 0 ? false : true}></Tabs.TabPane>
            </Tabs>
          </div>
        </Scrollbars>
      </Layout.Sider>
    )
  }
}

interface IProps {
  collapsed: boolean;
  onVisibleReport(v: boolean): void;
}
interface IState {}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({ report: state.report });
const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector> & IProps;
export default connector(Sidebar);