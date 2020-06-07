import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
// store
import { AppState } from '..';
import { IReportTypes, Types, Actions } from './types';
// core
import Axios from '../../core/axios';

const fetchFeportTypes = (payload: IReportTypes[]): Actions => {
  return { type: Types.FETCH_REPORT_TYPES, payload }
};

export const onFetchReportTypes = () => {
  return async (dispatch: Dispatch<Actions>, getState: () => AppState): Promise<void> => {
    try{
      const res: AxiosResponse<IReportTypes[]> = await Axios({ url: `${Axios.getUri()}/report_types/data` });
      dispatch(fetchFeportTypes(res.data));
    }catch(err){
      throw err;
    }
  }
}
