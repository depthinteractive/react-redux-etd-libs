import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, combineReducers } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import _ from 'lodash';
import { Form, Select } from 'antd';
// store
import { AppState } from '../../../../store';
import { AppActions } from '../../../../store/actions';
import { onFetchReportTypes } from '../../../../store/reportTypes/actions';
import { onFetchReportData } from '../../../../store/report/actions';
import { onFetchParameters, onFetchDatasource } from '../../../../store/parameters/actions';
import reportTypesReducer from '../../../../store/reportTypes/reducers';
import parametersReducer from '../../../../store/parameters/reducers';
import { Actions as ReportTypesActions, IReportTypes } from '../../../../store/reportTypes/types';
import { Actions as ParametersActions } from '../../../../store/parameters/types';
// core
import withReducer from '../../../../core/withReducer';
// components
import Parameters from './parameters';

class ReportType extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      hasReportType: false
    }
  }

  componentDidMount(): void {
    this.props.onFetchReportTypes();
  }
  
  componentDidUpdate(prevProps: Props, prevState: IState): void {
    if(!_.isEqual(prevProps.parameters, this.props.parameters) && prevProps.parameters !== undefined && !this.state.hasReportType){
      this.setState({ hasReportType: true });
    }
  }
  
  onChange = (value: any, option: any): void => {
    this.setState({ hasReportType: false });
    this.props.onVisibleReport(false);
    this.props.onFetchParameters(value);
  };

  render(){
    const { reportTypes, parameters, report, onFetchReportData, onFetchDatasource, onVisibleReport } = this.props;
    return (
      <>
        <Form
          hideRequiredMark
          layout="vertical"
          name="reportTypeForm" 
        >
          <Form.Item 
            hasFeedback
            name="rportType"
            label="Вид отчета" 
            rules={[{ required: true, message: '"Вид отчета" не может быть пустым' }]} 
          > 
            <Select 
              menuItemSelectedIcon={false}
              placeholder="Выберите отчет" 
              dropdownMatchSelectWidth={false} 
              disabled={_.isNil(reportTypes) ? true : false}
              loading={!_.isNil(reportTypes) ? false : true} 
              onChange={this.onChange}
            >
              { !_.isNil(reportTypes) && reportTypes.length > 0
                ? _.map<IReportTypes>(reportTypes, (item: IReportTypes, key: string) => (<Select.Option key={key} value={item.key}>{item.title}</Select.Option>))
                : null
              }
            </Select>
          </Form.Item> 
        </Form>
        { parameters && this.state.hasReportType 
          ? <Parameters 
              onFetchReportData={onFetchReportData}
              onFetchDatasource={onFetchDatasource} 
              onVisibleReport={onVisibleReport}
              report={report}
              parameters={parameters} /> 
          : null }
      </>
    )
  }
}

interface IProps {
  onVisibleReport(v: boolean): void
}
interface IState {
  hasReportType: boolean;
}

const reducers = { 
  reportTypes: reportTypesReducer,
  parameters: parametersReducer
}; 
const injectReducers = combineReducers(reducers);
const mapStateToProps = (state: AppState & ReturnType<typeof injectReducers>, ownProps: IProps) => (
  { 
    report: state.report,
    reportTypes: state.reportTypes,
    parameters: state.parameters
  }
);
const mapDispatchToProps = (dispatch: ThunkDispatch<AppState & ReturnType<typeof injectReducers> & IProps, any, AppActions & ReportTypesActions & ParametersActions>, ownProps: IProps) => (
  bindActionCreators({ onFetchReportTypes, onFetchParameters, onFetchDatasource, onFetchReportData }, dispatch)
);
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & IProps;
export default withReducer(reducers)(connector(ReportType));
