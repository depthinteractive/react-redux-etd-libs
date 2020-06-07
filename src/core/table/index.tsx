import React, {Component} from 'react';
import { Table, Typography, Input, Space, Button } from 'antd';
import { SearchOutlined, ClearOutlined, AudioOutlined } from '@ant-design/icons';
import _ from 'lodash';
import './Table.css';
// components
import DefaultMode from './mode/default';
import FlatMode from './mode/flat';
import CellInfo from './cellInfo';
// core
import { IReport, IColumns, IRows } from '../../store/report/types';
import { ISettings } from '../../store/settings/types';
// pipe
import CellFormatterPipe from '../../components/pipe/cellFormatter';

class TableComponent extends Component<Props, IState> {
  private tableRef: React.RefObject<HTMLDivElement>;
  private symbols: { [key: string]: string } = {
    процент: '%',
    тильда: '~',
    пробел: ' '
  };

  constructor(props: Props, 
    private recognition: SpeechRecognition,
    private searchInput: Input,
    private searchInputs: { [key: string]: Input },
    private setKeys: { [key: string]: (selectedKeys: React.ReactText[]) => void }){
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      recording: false,
      cellInfo: { visible: false, data: {} },
    };
    this.tableRef = React.createRef();
  }

  onFetchDetailReport = (e: React.MouseEvent<HTMLElement, MouseEvent>, column: IColumns): void => {
    this.props.onFetchDetailReport!({ value: (e.target as HTMLInputElement).textContent, column })
  }
  
  onSpeech = (key: string): void => {
    const grammar = '#JSGF V1.0; grammar symbols; public <symbols> = ' +  _.keys(this.symbols).join(' | ') + ' ;';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    this.recognition = new SpeechRecognition();
    this.recognition.grammars = speechRecognitionList;
    this.recognition.continuous = true;
    this.recognition.lang = 'ru-RU';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const value: string = this.searchInputs[key] && this.searchInputs[key].state.value ? this.searchInputs[key].state.value : '';
      let transcript: string = event.results[last][0].transcript.toString().toLowerCase().replace(/\s/, '');
      _.map<string, void>(_.keys(this.symbols), (key: string) => {
        if(transcript.includes(key))
          transcript = transcript.replace(/\s/g, '').replace(new RegExp(key, 'g'), this.symbols[key]);
      }).valueOf();
      this.searchInputs[key].setValue(value + transcript)
      this.setKeys[key]([value + transcript]);
    };

    if(!this.state.recording){
      this.setState({ recording: true });
      this.recognition.start(); 
    }
  };
  
  onSpeeched = (): void => {
    if(this.state.recording){
      this.recognition.stop(); 
      this.setState({ recording: false });
    }
  };
  
  onReset = (clearFilters: (() => void) | undefined): void => {
    if(clearFilters) clearFilters();
    this.setState({ searchText: '' });
  };

  onApply = (selectedKeys: React.ReactText[], confirm: () => void, dataIndex: string): void => {
    confirm();
    this.setState({ searchText: selectedKeys[0], searchedColumn: dataIndex });
  };

  onCellInfo = (record: IRows, data: { [key: string]: string }): void => {
    const udpdatedCellInfo = this.state;
    _.map<string, void>(_.keys(data), (key: string) => {
      udpdatedCellInfo.cellInfo.data[key] = record[data[key]]!.toString().replace(/\|/g, '\n\n');
    });
    this.setState({ ...this.state,  ...udpdatedCellInfo });
    this.onToggle();
  };

  onToggle = (): void => { 
    const udpdatedCellInfo = this.state;
    udpdatedCellInfo.cellInfo.visible = !this.state.cellInfo.visible;
    this.setState({ ...this.state,  ...udpdatedCellInfo });
  };

  summary = (rows: IRows[], columns: IColumns[]): IColumns[] | any => {
    return _<IColumns>(columns).map((item: IColumns, key: number) => (item.children.length > 0 
      ? this.summary(rows, item.children)
      : (<Table.Summary.Cell key={`summary_${item.key}`} index={key}>
          <Typography.Text>
            <CellFormatterPipe 
              column={item} 
              skipGroup={true} 
              value={_.map<IRows, string>(rows, item.key).reduce((sum, n) => _.some([sum, n], e => !_.isNil(e) && typeof e === 'number') ?  +sum! + +n! : n, 0)} />
          </Typography.Text>
        </Table.Summary.Cell>)
      )).valueOf();
  }

  columns = (items: IColumns[]): IColumns[] => {
    return _.map<IColumns, IColumns>(items, (item: IColumns, key) => {
      if(item.children.length > 0) item.children = this.columns(item.children)
      else {
        item.filterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          return (
            <div style={{ padding: 8 }}>
              <Input
                ref={node => { 
                    this.searchInput = node!; 
                    this.searchInputs = { ...this.searchInputs, [item.dataIndex]: node! }; 
                    this.setKeys = { ...this.setKeys, [item.dataIndex]: setSelectedKeys };
                  }
                }
                placeholder={item.title}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.onApply(selectedKeys, confirm, item.dataIndex)}
                style={{ width: 196, marginBottom: 8, display: 'block' }}
              />
              <Space className="dropdown-filter">
                <Button onClick={() => this.onApply(selectedKeys, confirm, item.dataIndex)} icon={<SearchOutlined />} size="small" type="primary" />
                <Button className={ this.state.recording ? 'record' : '' } onMouseDown={() => this.onSpeech(item.dataIndex)} onMouseUp={() => this.onSpeeched()} icon={<AudioOutlined />} size="small" />
                <Button onClick={() => this.onReset(clearFilters)} icon={<ClearOutlined />} size="small" />
              </Space>
            </div>
          )
        };
        item.filterIcon = (filtered: boolean) => (<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />);
        item.onFilter = (value: string | number | boolean, record: IRows) => {
          return new RegExp(`^${value.toString().toLowerCase().replace(/%/g, '.*')}$`).test(record[item.dataIndex]!.toString().toLowerCase());
        };
        item.onFilterDropdownVisibleChange = (visible: boolean) => {
          if(visible) setTimeout(() => { this.searchInputs[item.dataIndex].select(); });
        }

        if(item.type === 'number')
          item.sorter = (a: IRows, b: IRows) => parseFloat(a[item.key]!.toString()) - parseFloat(b[item.key]!.toString());
      }
      item.ellipsis = false;
      item.showSorterTooltip = false;
      item.render = (value: string | number, record: IRows) => (<CellFormatterPipe value={value} column={item} record={record} onCellInfo={this.onCellInfo} />);
      if(this.props.onFetchDetailReport)
        item.onCell = () => ({ onDoubleClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => this.onFetchDetailReport(e, item) });
      return item;
    });
  }

  render(){
    const { visible, data }: { visible: boolean, data: { [key: string]: string } } = this.state.cellInfo;
    const { settings, report }: { settings: ISettings, report: IReport } = this.props;
    const filteredColumns: IColumns[] = this.columns(report.columns);
    const summary = !this.props.skipSummary ? this.summary(report.rows, filteredColumns) : null;
    return (
      <>
        <div ref={this.tableRef} id="bl-table">
          { this.props.default || settings.flatMode 
            ? (<DefaultMode columns={filteredColumns} rows={report.rows} summary={summary} settings={settings} />)
            : (<FlatMode columns={filteredColumns} rows={report.rows} summary={summary} settings={settings} />) }
        </div>
        <CellInfo onClose={this.onToggle} visible={visible} data={data} />
      </>
    )
  }
}

interface IProps {
  report: IReport;
  settings: ISettings;
  default?: boolean;
  skipSummary?: boolean;
  onFetchDetailReport?: (req: { value: string | null, column: IColumns }) => void;
}
interface IState {
  recording: boolean;
  searchText: React.ReactText;
  searchedColumn: string;
  cellInfo: {
    visible: boolean,
    data: { [key: string]: string }
  };
}

type Props = IProps;
export default TableComponent;