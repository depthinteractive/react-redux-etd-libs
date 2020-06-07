import { ISettings, Actions, Types } from './types';

const settingsReducer = (state: ISettings = {
  sourceId: '', 
  size: 'small', 
  freezeColumns: false, 
  hideBlankLines: false, 
  flatMode: true,
  pageSize: 10,
}, action: Actions): ISettings => {
  switch(action.type){
    case Types.FETCH_SETTINGS:
      return { ...action.payload }
    default:
      return state;
  }
}
export default settingsReducer;