import { createSelector } from 'reselect';
import { Store } from 'antd/lib/form/interface';
import _ from 'lodash';
// store
import { IParameter } from './types';

const parametersState = (state: IParameter[]) => state;
const updatedState = (state: IParameter[], req: Store) => req;

export const onUpdateParameters = createSelector(
  parametersState, 
  updatedState,
  async (state: IParameter[], req: Store) => _.map<IParameter, void>(state, (item: IParameter) => {
      item.options!.value = req[item.key] ? req[item.key] : null;
    }).valueOf()
);