import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
// store
import { AppState } from '..';
import { Types, Actions, ISettings } from './types';
// core
import Axios, { ExtendedAxiosRequestConfig } from '../../core/axios';
import { Store } from 'antd/lib/form/interface';

const fetchSettings = async (payload: ISettings): Promise<Actions> => {
  return { type: Types.FETCH_SETTINGS, payload };
};

export const onFetchSettings = (id: string | null) => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState): Promise<void> => {
    try{
      if(id){
        const res: AxiosResponse<any> = await Axios({ url: `${Axios.getUri().replace('report-data', 'report-meta')}/userSettings/${id}/data` });
        dispatch(await fetchSettings(res.data));
      }
    }catch(err){
      throw err;
    }
  }
}

export const onPostSettings = (req: Store) => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState): Promise<void> => {
    try{
      await Axios({ 
        method: 'POST', 
        data: req, 
        spinner: false, 
        msg: 'Настройки были изменены', 
        url: `${Axios.getUri().replace('report-data', 'report-meta')}/userSettings`, 
      } as ExtendedAxiosRequestConfig);
      dispatch(await fetchSettings(req as ISettings));
    }catch(err){
      throw err;
    }
  }
}