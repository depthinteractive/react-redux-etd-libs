// store
import { IReport, Actions, Types } from './types';

const reportReducer = (state: IReport = { key: '', title: '', columns: [], rows: [] }, action: Actions): IReport => {
  switch(action.type){
    case Types.PREPARE_REPORT:
      return { ...action.payload }
    case Types.FETCH_REPORT_DATA:
      return { ...state, rows: action.payload }
    case Types.PREPARE_DETAIL_REPORT:
      return { ...state, detail: action.payload }
    case Types.FETCH_REPORT_DETAIL_DATA:
      const updatedState = state;
      updatedState.detail!.rows = action.payload;
      return { ...state, ...updatedState }
    default:
      return state;
  }
}
export default reportReducer;