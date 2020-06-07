export enum Types {
  FETCH_REPORT_TYPES = 'FETCH_REPORT_TYPES'
}

export interface IReportTypes {
  key: string, 
  title: string;
}
export interface IFetchReportTypes { type: typeof Types.FETCH_REPORT_TYPES; payload: IReportTypes[]; }

export type Actions = IFetchReportTypes;