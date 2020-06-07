import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import _ from 'lodash';
// store
import { AppState } from '..';
import { IReport, Types, Actions, IRows, EventsType, IColumns, CellEventType } from './types';
import { IParameter } from '../parameters/types';
// core
import Axios from '../../core/axios';
import AppConfig from '../../core/config';

const fetchReportData = async (payload: IRows[], type: Types.FETCH_REPORT_DATA | Types.FETCH_REPORT_DETAIL_DATA): Promise<Actions> => {
  _.map(payload, (item: IRows, key: number) => {item.key = key});
  return { type, payload };
};
export const prepareReport = async (payload: IReport, type: Types.PREPARE_REPORT | Types.PREPARE_DETAIL_REPORT): Promise<Actions> => {
  if(payload.useAsLink){
    _.map(payload.useAsLink, (item: EventsType) => {
      _.filter(payload.columns, (i: IColumns) => i.key === item.columns).map((i: IColumns) => {
        item.onClick.type = 'useAsLink';
        i.eDoubleClick = item.onClick;
        return void 0;
      })
    });
  }
  if(payload.anyCellEvents){
    payload.columns = onPrepareColumns(payload.columns, payload.anyCellEvents);
  }
  return { type, payload }
};

export const onFetchReportData = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState & { parameters: IParameter[] }): Promise<void> => {
    try{
      const q = _<IParameter>(getState().parameters)
        .filter((item: IParameter) => item.options!.value !== (undefined || null))
        .map((item: IParameter) => {
          const v = item.options!.value;
          let res: string = `${item.key}=`;
          return res += item.type === 'date' 
            ? (v as moment.Moment).format('DD.MM.YYYY') 
            : _.isArray(v) 
              ? _.join(v, ',') 
              : v as string;
        })
        .join('&')
        .valueOf();
        
      const res: AxiosResponse<any> = await Axios({ url: `${Axios.getUri()}/reports/${getState().report.key}/data?${q}` });
      dispatch(await fetchReportData(res.data.data[0].commonData, Types.FETCH_REPORT_DATA));
    }catch(err){
      throw err;
    }
  }
}

export const onFetchDetailReport = (req: { value: string | null, column: IColumns }) => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState & { parameters: IParameter[] }): Promise<void> => {
    try{
      if(_.has<IColumns>(req.column, 'eDoubleClick')){
        const { eDoubleClick, key } = req.column;
        const urlData: string = _.get<CellEventType, keyof CellEventType>(eDoubleClick!, 'urlData');
        const urlView: string = _.get<CellEventType, keyof CellEventType>(eDoubleClick!, 'urlView');
        let urlDataQ: string = '';
        urlDataQ = urlData.replace(`:${key}`, `${key}=${req.value}`);
        _<IParameter>(getState().parameters)
          .filter((item: IParameter) => item.options!.value !== (undefined || null))
          .map((item: IParameter) => {
            if(urlData){
              const v: string | moment.Moment | undefined = item.options!.value;
              urlDataQ = _.replace(urlDataQ, `:${item.key}`, `${item.key}=${item.type === 'date' 
                ? (v as moment.Moment).format('DD.MM.YYYY') 
                : _.isArray(v) 
                  ? _.join(v, ',') 
                  : v as string}`);
            }
            return void 0;
          }).valueOf();
        
        const res: AxiosResponse<any> = await Axios({ url: urlView });

        if(res){
          let mode: string = 'vtable';
          let columns: IColumns[];
  
          if(_.has(res.data, 'htable')){
            mode = 'htable';
            columns = _.get(res.data, 'htable.columns', []);
          }else if(_.has(res.data, 'vtable')){
            columns = _.get(res.data, 'vtable.columns', []);
          }else{
            columns = res.data.columns;
          }
  
          const { key, title, useAsLink, groupEvents, anyCellEvents } = res.data;
          dispatch(await prepareReport({ key, title, columns, rows: [], useAsLink, groupEvents, anyCellEvents, mode }, Types.PREPARE_DETAIL_REPORT));
          const resData: AxiosResponse<any> = await Axios({ url: urlDataQ });
          dispatch(await fetchReportData(resData.data.data[0].commonData, Types.FETCH_REPORT_DETAIL_DATA));
        }
      }
    }catch(err){
      throw err;
    }
  }
}

const onPrepareColumns = (payload: IColumns[], events: EventsType): IColumns[] => _.map(payload, (item: IColumns) => {
  item.dataIndex = item.key;
  item.width = AppConfig._COLUMNS_WIDTH_;
  if(item.children && item.children.length > 0) onPrepareColumns(item.children, events);
  if(!item.eDoubleClick && events.onClick){
    events.onClick.type = 'anyCellEvents';
    item.eDoubleClick = events.onClick;
  }
  return item;
});