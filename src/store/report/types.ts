import { ColumnGroupType } from "antd/lib/table";

export enum Types {
  PREPARE_REPORT = 'PREPARE_REPORT',
  PREPARE_DETAIL_REPORT = 'PREPARE_DETAIL_REPORT',
  FETCH_REPORT_DATA = 'FETCH_REPORT_DATA',
  FETCH_REPORT_DETAIL_DATA = 'FETCH_REPORT_DETAIL_DATA'
}
export type CellEventType = {
  widgetId: string,
  type: string,
  urlView: string,
  urlData: string
}
export type EventsType = {
  columns?: string,
  onClick: CellEventType
}
export type GroupType = {
  active: boolean,
  position: number,
}
export interface IRows {
  [key: string]: string | number | null;
}
export interface IColumns extends ColumnGroupType<IRows> {
  key: string;
  title: string;
  type: string;
  children: IColumns[];
  documents: any;
  dataIndex: string;
  group?: GroupType;
  hidden?: boolean;
  popupLinkField?: string;
  eDoubleClick?: CellEventType
}
export interface IReport {
  key: string;
  title: string;
  columns: IColumns[];
  rows: IRows[];
  mode?: string;
  detail?: IReport;
  useAsLink?: EventsType[];
  groupEvents?: EventsType;
  anyCellEvents?: EventsType;
}
export interface IPrepareReport { type: typeof Types.PREPARE_REPORT; payload: IReport; }
export interface IPrepareDetailReport { type: typeof Types.PREPARE_DETAIL_REPORT; payload: IReport; }
export interface IFetchReportData { type: typeof Types.FETCH_REPORT_DATA; payload: IRows[]; }
export interface IFetchReportDetailData { type: typeof Types.FETCH_REPORT_DETAIL_DATA; payload: IRows[]; }

export type Actions = IPrepareReport | IPrepareDetailReport | IFetchReportData | IFetchReportDetailData;