import React, { Component } from 'react';
import { List, Typography, Input } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import _ from 'lodash';
// store
import { IReport, IColumns, IRows } from '../../../../../../store/report/types';

export default class ListMode extends Component<Props, IState> {
  constructor(props: Props){
    super(props);
    this.state = {
      searchInput: '',
    }
  }

  dataSource(columns: IColumns[]): { key: string, title: string, descriptionList: IRows[] }[] {
    const dataSource: { key: string, title: string, descriptionList: IRows[] }[] = [];
    const { rows } = this.props.report;
    _.map<IColumns, void>(columns, (column: IColumns) => {
      const descriptionList = _.filter<IRows[]>(rows, (item: IRows) => {
        const res = _.get<IRows, string>(item, column.key);
        return res && _.includes<string>(res!.toString(), this.state.searchInput)
      });
      if(_.isArray(descriptionList) && descriptionList.length > 0){
        dataSource.push({
          key: column.key,
          title: column.title,
          descriptionList: descriptionList as IRows[]
        })
      }
    });
    return dataSource;
  }

  description(key: string, items: IRows[]): JSX.Element {
    return (
      <List<IRows>
        key={key}
        size="small"
        bordered
        dataSource={items}
        renderItem={(item, index: number) => <List.Item key={index}>{_.get<IRows, string>(item, key)}</List.Item>}
      />
    )
  };

  onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const value: string = (e.target as HTMLInputElement).value;
    this.setState({ searchInput: value });
  }

  render(){
    const  { report } = this.props;
    return (
      <>
        <Input placeholder="Поиск" onKeyUp={this.onKeyUp} />
        <Scrollbars autoHeight autoHeightMin={100} autoHeightMax="calc(100vh - 136px)">
          <List<{ key: string; title: string; descriptionList: IRows[] }>
            pagination={{pageSize: 5}}
            itemLayout="horizontal"
            dataSource={this.dataSource(report.columns)}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={(<Typography.Text>{item.title}</Typography.Text>)}
                  description={this.description(item.key, item.descriptionList)}
                />
              </List.Item>
            )}
          />
        </Scrollbars>
      </>
    );
  }
}

interface IProps {
  report: IReport;
}
interface IState {
  searchInput: string;
}

type Props = IProps;