import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
import moment from 'moment';
import _ from 'lodash';
// store
import { AppState } from '..';
import { IParameter, Types, Actions, Value } from './types';
import { Actions as ReportActions, Types as ReportTypes } from '../report/types';
import { prepareReport } from '../report/actions';
// core
import Axios from '../../core/axios';
import AppConfig from '../../core/config';

const fetchParameters = async (payload: IParameter[]): Promise<Actions> => ({ type: Types.FETCH_PARAMETERS, payload });
const fetchDatasource = async (payload: { key: string, items: Value[] }): Promise<Actions> => ({ type: Types.FETCH_DATASOURCE, payload });

export const onFetchParameters = (id: string) => {
  return async (dispatch: Dispatch<Actions | ReportActions>, getState: () => AppState): Promise<void> => {
    try{
      const res: AxiosResponse<any> = await Axios({ url: `${Axios.getUri()}/reports/${id}/view` });
      const { key, title, columns, useAsLink, groupEvents, anyCellEvents } = res.data;
      dispatch(await prepareReport({ key, title, columns, rows: [], useAsLink, groupEvents, anyCellEvents }, ReportTypes.PREPARE_REPORT));
      
      await Promise.all(_(res.data.parameters).map(async (item: IParameter) => {
        if(item.required && item.options && 'datasource' in item.options){
          try{
            const res: AxiosResponse<any> = await Axios({ url: item.options!.datasource!.url.replace('?query=:query', '') });
            item.options!.values = res.data;
          }catch(err){
            throw err;
          }
        }
        if(item.type === 'date'){
          item.options = {};
          item.options.value = item.defaultValue ? moment(item.defaultValue, AppConfig._DATE_FORMAT_) : moment(moment(new Date()).format(AppConfig._DATE_FORMAT_), AppConfig._DATE_FORMAT_);
        }
        }).valueOf()
      );
      dispatch(await fetchParameters(res.data.parameters));
    }catch(err){
      throw err;
    }
  }
}

export const onFetchDatasource = (req: {key: string, value: string, uri: string}) => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState): Promise<void> => {
    try{
      const res: AxiosResponse<Value[]> = await Axios({ url: `${req.uri.replace(':query', req.value)}` });
      if(res.data.length > 0){
        dispatch(await fetchDatasource({ key: req.key, items: res.data }));
      }
    }catch(err){
      throw err;
    }
  }
}
