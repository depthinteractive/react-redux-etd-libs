import React, { Component } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Layout, Drawer, Form, Button, Col, Row, Radio, Switch, Slider } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined } from '@ant-design/icons';
import URLSearchParams from 'url-search-params';
import _ from 'lodash';
import './Header.css';
// store
import { AppState } from '../../../store';
import { AppActions } from '../../../store/actions';
import { onFetchSettings, onPostSettings } from '../../../store/settings/actions';
// blocks
import Version from './version';
import { Store } from 'antd/lib/form/interface';
// ui
import Btn from '../../ui/btn';
import { ISettings } from '../../../store/settings/types';
import { SliderValue } from 'antd/lib/slider';

class Header extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      settings: this.props.settings,
      loading: false,
      visible: false,
      disabled: true,
      pageSize: 10,
    }
  }

  componentDidMount(): void {
    const q: URLSearchParams = new URLSearchParams(this.props.route.history.location.search);
    const sourceId: string = q.get('sourceId') ? q.get('sourceId')! : 'defaultSourceId';
    this.setState({ sourceId });
    this.props.onFetchSettings(sourceId);
  }

  componentDidUpdate(prevProps: Props, prevState: IState): void {
    if(!_.isEqual(prevProps.settings, this.props.settings)){
      this.setState({ loading: false, settings: this.props.settings });
    }
  }

  onChange = (value: SliderValue): void => { this.setState({ pageSize: +value }) };
  onToggle = (): void => { this.setState({ visible: !this.state.visible }) };

  onFieldsChange = (changedFields: any): void => {
    if(changedFields.length > 0){
      const settings = this.state.settings;
      const { name, value }: { name: string[], value: string | boolean } = changedFields.shift();
      const updatedItem: { [key: string]: string | boolean  } = {
        [name.shift() as string]: value
      };
      this.setState({ settings: { ...settings, ...updatedItem }});
    }
  }

  onFinish = (values: Store): void => {
    this.setState({ loading: true });
    this.props.onPostSettings({ ...values, sourceId: this.state.sourceId });
  }

  render(){
    const { settings } = this.props;
    return (
      <Layout.Header className="bl-header">
        {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.props.onToggle,
        })}
        <button className="btn btn-drawer" onClick={this.onToggle} disabled={this.props.settings.sourceId ? false : true}><SettingOutlined /></button>
        <Version />
        <Drawer
          title="Настройки"
          width={420}
          onClose={this.onToggle}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Button onClick={this.onToggle} style={{ marginRight: 8 }}>Отмена</Button>
                </Col>
                <Col span={12}>
                  <Btn form="formSettings" textContent="Сохранить" htmlType="submit" loading={this.state.loading} disabled={_.isEqual(this.state.settings, settings)} />
                </Col>
              </Row>
            </div>
          }
        >
          <Form 
            id="formSettings"
            hideRequiredMark
            layout="vertical" 
            initialValues={{
              flatMode: settings.flatMode,
              hideBlankLines: settings.hideBlankLines,
              freezeColumns: settings.freezeColumns,
              size: settings.size,
              pageSize: settings.pageSize,
            }}
            onFieldsChange={this.onFieldsChange}
            onFinish={this.onFinish}
            onFinishFailed={({ values, errorFields, outOfDate }) => {
              console.log(values)
              console.log(errorFields)
              console.log(outOfDate)
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="flatMode"
                  label="Плоский режим"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="hideBlankLines"
                  label="Скрыть пустые строки"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="freezeColumns"
                  label="Закрепить шапку и груп/колонки"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="size"
                  label="Масштаб"
                >
                  <Radio.Group>
                    <Radio.Button value="default">Крупный</Radio.Button>
                    <Radio.Button value="middle">Средний</Radio.Button>
                    <Radio.Button value="small">Мелкий</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="pageSize"
                  label="Кол-во строк"
                >
                  <Slider className="pt-40" tooltipVisible />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </Layout.Header>
    )
  }
}

interface IProps {
  route: RouteComponentProps<any, StaticContext, any>;
  collapsed: boolean;
  onToggle(): void;
}
interface IState {
  settings: ISettings;
  loading: boolean;
  visible: boolean;
  disabled: boolean;
  pageSize: number;
  sourceId?: string;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({ settings: state.settings });
const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, AppActions>, ownProps: IProps) => (bindActionCreators({ onFetchSettings, onPostSettings }, dispatch));
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & IProps;
export default connector(Header);