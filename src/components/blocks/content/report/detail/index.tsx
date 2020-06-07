import React, { Component } from 'react';
import { Modal } from 'antd';
import _ from 'lodash';
import './ReportDetail.css';
// store
import { IReport } from '../../../../../store/report/types';
import { onDeleteReportDetail } from '../../../../../store/report/selectors';
import TableComponent from '../../../../../core/table';
import { ISettings } from '../../../../../store/settings/types';
// components
import ListMode from './views/listMode';

export default class ReportDetail extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      visible: false
    }
  }
  
  componentDidUpdate(prevProps: Props, prevState: IState): void {
    if(_.has<IProps>(prevProps, 'report.detail') && _.isMatch(prevState, { visible: false })){
      this.setState({ visible: true })
    }
  }

  onCancel = (): void => {
    this.setState({ visible: false });
    onDeleteReportDetail(this.props.report);
  };

  render(){
    const { settings, report } = this.props;
    return (
      <>
        {_.has<IReport>(report, 'detail')
          ? <Modal
              className="bl-report-detail"
              title={_.get(report, 'detail.title', 'Список документов')}
              footer={null}
              width="100%"
              visible={this.state.visible}
              onCancel={this.onCancel}
            >
              {_.isMatch(report.detail!, { mode: 'htable' }) 
                ? <ListMode report={report} />
                : <TableComponent settings={settings} report={report.detail!} default={true} skipSummary={true} />}
            </Modal>
          : null}
      </>
    )
  }
}

interface IProps {
  report: IReport;
  settings: ISettings;
}
interface IState {
  visible: boolean;
}
type Props = IProps;