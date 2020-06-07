import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import './Report.css';
// store
import { AppState } from '../../../../store';
import { AppActions } from '../../../../store/actions';
import { onFetchDetailReport } from '../../../../store/report/actions';
// core
import TableComponent from '../../../../core/table/index';
// components
import ReportDetail from './detail';

class Report extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      isVisibleReportDetail: false
    }
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return nextProps.report.rows.length > 0 && _.isEqual(nextProps.report.columns, this.props.report.columns);
  }
  
  componentDidUpdate(prevProps: Props): void {
    if(!_.isNil(prevProps.report) && _.isMatch(this.props, { isVisibleReport: false }) && !_.isEqual(prevProps.report.rows, this.props.report.rows)){
      this.props.onVisibleReport(true);
    }
  }

  render(){
    const { settings, isVisibleReport, report, onFetchDetailReport } = this.props;
    return (
      <>
        {isVisibleReport ? <TableComponent settings={settings} report={report} onFetchDetailReport={onFetchDetailReport} /> : null}
        {report.detail ? <ReportDetail settings={settings} report={report} /> : null}
      </>
    )
  }
}

interface IProps {
  isVisibleReport: boolean;
  onVisibleReport(v: boolean): void;
}
interface IState {
  isVisibleReportDetail: boolean;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({ report: state.report, settings: state.settings });
const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, any, AppActions>, ownProps: IProps) => (bindActionCreators({ onFetchDetailReport }, dispatch));
const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector> & IProps;
export default connector(Report);