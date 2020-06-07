import moment from 'moment';

export enum Types {
  FETCH_PARAMETERS = 'FETCH_PARAMETERS',
  FETCH_DATASOURCE = 'FETCH_DATASOURCE',
}

export type Value = {
  title: string,
  key: string
}
export type Datasource = {
  url: string
}
export type Option = {
  datasource?: Datasource
  values?: Value[],
  value?: string | moment.Moment
}
export interface IParameter {
  key: string;
  title: string;
  type: string;
  visible: boolean;
  defaultValue?: string;
  useForDetails?: boolean;
  required?: boolean;
  options?: Option;
  multiple?: boolean;
}
export interface IFetchParameters { type: typeof Types.FETCH_PARAMETERS; payload: IParameter[]; }
export interface IFetchDatasource { type: typeof Types.FETCH_DATASOURCE; payload: { key: string, items: Value[] }; }

export type Actions = IFetchParameters | IFetchDatasource;