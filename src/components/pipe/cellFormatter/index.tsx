import React, { Component } from 'react';
import _ from 'lodash';
// store
import { IColumns, IRows } from '../../../store/report/types';
// pipe
import NumberPipe from '../number';
import DatePipe from '../date';
import { InfoCircleOutlined } from '@ant-design/icons';

export default class CellFormatterPipe extends Component<Props, IState> {
  render(){
    let formattedValue;
    const { value, column, skipGroup, record, onCellInfo } = this.props;

    switch(column.type){
      case 'number':
        formattedValue = <NumberPipe value={+value!} />;
        break;
      case 'date':
      case 'daterange':
        formattedValue = <DatePipe value={value!.toString()} />;
        break;
      default:
        formattedValue = (<div className="text-default">{!_.isNil(column.group) && !!_.isNil(skipGroup) ? value : '-'}</div>);
        break;
    }

    if(!_.isNil(column.eDoubleClick) && _.isMatch(column.eDoubleClick!, { type: 'useAsLink' }) && !!_.isNil(skipGroup)){
      formattedValue = (<div className="text-link">{formattedValue}</div>);
    }

    return (<div className="cell-container d-flex justify-content-between">
      {formattedValue}
      {record && (column.popupLinkField)
        ? <button className="btn btn-info" onClick={() => onCellInfo!(record, { popupLinkField: column.popupLinkField! })}><InfoCircleOutlined /></button> 
        : null}
    </div>);
  }
}

interface IProps {
  value: string | number | null;
  column: IColumns;
  record?: IRows;
  skipGroup?: boolean;
  onCellInfo?: (record: IRows, info: { [key: string]: string }) => void;
}
interface IState {}

type Props = IProps;