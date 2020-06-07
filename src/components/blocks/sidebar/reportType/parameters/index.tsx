import React, { Component } from 'react';
import _ from 'lodash';
import { Form, Select, DatePicker } from 'antd';
import { Store } from 'antd/lib/form/interface';
import locale from 'antd/es/date-picker/locale/ru_RU';
import { BarChartOutlined } from '@ant-design/icons';
import './Parameters.css';
// core
import AppConfig from '../../../../../core/config';
import { IParameter, Value as ParameterValue } from '../../../../../store/parameters/types';
import { FormItemProps } from 'antd/lib/form';
// store
import { onUpdateParameters } from '../../../../../store/parameters/selectors';
import { onDeleteReportData } from '../../../../../store/report/selectors';
import { IReport } from '../../../../../store/report/types';
// ui
import Btn from '../../../../ui/btn';

class Parameters extends Component<Props, IState> {

  config(item: IParameter): FormItemProps {
    const config: FormItemProps = {
      hasFeedback: true,
      name: item.key,
      label: item.title,
      children: null,
    }

    if(item.options && 'value' in item.options){
      config.initialValue = item.options.value;
    }
    if(item.required){
      config.rules = [{ required: true, message: `"${item.title}" не может быть пустым` }]
    }
    return config;
  }

  field(item: IParameter): JSX.Element {
    switch(item.type){
      case 'date':
        return ( 
          <DatePicker 
            locale={locale} 
            format={AppConfig._DATE_FORMAT_} /> 
        );
      case 'daterange':
        return (<></>);
      default:
        return (
          <Select 
            showSearch
            allowClear
            placeholder={item.title}
            mode={item.multiple ? 'multiple' : undefined}
            onKeyUp={(e) => this.onKeyUp(e, item.key)}
          >
            { item.options && item.options.values 
              ? _.map<ParameterValue>(item.options.values, (item: ParameterValue, key: string) => <Select.Option key={key} value={item.key}>{item.title}</Select.Option>)
              : null
            }
          </Select>
        );
    }
  }

  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>, key: string): void {
    const value: string = (e.target as HTMLInputElement).value;
    _<IParameter>(this.props.parameters)
      .filter((item: IParameter) => (_.isEqual(item.key, key) && !_.isNil(item.options) && _.has<IParameter>(item, 'options.datasource')))
      .map((item: IParameter): void => {
        if(!_.find<ParameterValue>(item.options!.values, (item: ParameterValue) => _.includes<string>(item.key, value)))
          this.props.onFetchDatasource({ key: item.key, value, uri: item.options!.datasource!.url });
        return void 0;
      }).valueOf();
  }

  onValuesChange = (): void => {
    this.props.onVisibleReport(false);
  }
  
  onFinish = async (values: Store): Promise<void> => {
    await onDeleteReportData(this.props.report);
    await onUpdateParameters(this.props.parameters, values);
    this.props.onFetchReportData();
  }

  render(){
    const { parameters } = this.props;
    return (
      <Form 
        hideRequiredMark
        className="bl-parameters"
        layout="vertical"
        name="parameters"
        onValuesChange={this.onValuesChange}
        onFinish={this.onFinish}
      >
        { _<IParameter>(parameters)
          .filter((item: IParameter) => (item.visible === true))
          .map((item: IParameter) => {
            const config: FormItemProps = this.config(item);
            return (
              <React.Fragment key={item.key}>
                <Form.Item {...config}>
                  { this.field(item) }
                </Form.Item>
              </React.Fragment>
          )}).valueOf()
        }
        <Btn htmlType="submit" textContent="Сформировать отчет" icon={<BarChartOutlined />} />
      </Form>
    )
  }
}

interface IProps {
  parameters: IParameter[];
  report: IReport;
  onFetchDatasource(req: {key: string, value: string, uri: string}): void;
  onFetchReportData(): void;
  onVisibleReport(v: boolean): void;
}
interface IState {}

type Props = IProps;
export default Parameters;
