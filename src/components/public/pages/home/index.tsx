import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { Layout } from 'antd';
import './Home.css';
// blocks
import Sidebar from '../../../blocks/sidebar';
import Header from '../../../blocks/header';
import Report from '../../../blocks/content/report';

class Home extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      collapsed: false,
      isVisibleReport: false,
    };
  }

  onToggle = (): void => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  onVisibleReport = (v: boolean): void => {
    this.setState({ isVisibleReport: v });
  }

  render(){
    return(
      <Layout>
        <Sidebar collapsed={ this.state.collapsed } onVisibleReport={this.onVisibleReport} />
        <Layout className="bl-layout">
          <Header route={this.props.route} collapsed={ this.state.collapsed } onToggle={this.onToggle} />
          <Layout.Content className="bl-content">
            <Report onVisibleReport={this.onVisibleReport} isVisibleReport={this.state.isVisibleReport} />
          </Layout.Content>
        </Layout>
      </Layout> 
    );
  }
}

interface IProps {
  route: RouteComponentProps<any, StaticContext, any>;
}
interface IState {
  collapsed: boolean;
  isVisibleReport: boolean;
}

type Props = IProps;
export default Home;