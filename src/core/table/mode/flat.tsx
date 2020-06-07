import React, { Component } from 'react';
import { Table } from 'antd';
// store
import { IColumns, IRows } from '../../../store/report/types';
import { ISettings } from '../../../store/settings/types';
// store

class FlatMode extends Component<Props, IState> {
  render(){
    const { columns, rows, summary, settings } = this.props;
    return (<Table<IRows>
      bordered={false}
      id="main-table"
      columns={columns} 
      dataSource={rows} 
      size={settings.size} 
      pagination={{ pageSize: settings.pageSize }}
      scroll={{ x: 'calc(700px + 50%)', y: 'calc(100vh - 72px)' }}
      summary={() => (<Table.Summary.Row>{summary}</Table.Summary.Row>)}
      />);
  }
}

interface IProps {
  columns: IColumns[];
  rows: IRows[];
  summary: any;
  settings: ISettings;
}
interface IState {}

type Props = IProps;
export default FlatMode;