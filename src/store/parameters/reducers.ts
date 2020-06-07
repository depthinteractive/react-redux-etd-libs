import { IParameter, Actions, Types } from './types';
import _ from 'lodash';

const parametersReducer = (state: IParameter[] | null = null, action: Actions): IParameter[] | null => {
  switch(action.type){
    case Types.FETCH_PARAMETERS:{
      return { ...action.payload }
    }
    case Types.FETCH_DATASOURCE: {
      const updatedState = state as IParameter[];
      _<IParameter>(updatedState)
        .filter((item: IParameter) => (item.key === action.payload.key))
        .map(async (item: IParameter) => {
          item.options!.values = action.payload.items;
        }).valueOf();
      return { ...state, ...updatedState }
    }
    default:
      return state;
  }
}
export default parametersReducer;