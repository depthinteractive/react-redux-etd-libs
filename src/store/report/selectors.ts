import { createSelector } from 'reselect';
// store
import { IReport } from './types';

const deleteReportData = (state: IReport) => state;
const deleteReportDetail = (state: IReport) => state;

export const onDeleteReportData = createSelector(
  deleteReportData,
  async (state: IReport) => {
    const updatedState = state;
    updatedState.rows = [];
    return { ...state, ...updatedState }
  }
);
export const onDeleteReportDetail = createSelector(
  deleteReportDetail,
  async (state: IReport) => {
    const updatedState = state;
    delete updatedState.detail;
    return { ...state, ...updatedState }
  }
);