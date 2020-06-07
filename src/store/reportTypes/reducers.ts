import { IReportTypes, Actions, Types } from './types';

const reportTypesReducer = (state: IReportTypes[] = [], action: Actions): IReportTypes[] => {
  switch(action.type){
    case Types.FETCH_REPORT_TYPES:
      return [ ...action.payload ]
    default:
      return state;
  }
}
export default reportTypesReducer;