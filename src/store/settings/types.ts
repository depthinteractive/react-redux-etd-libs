import { SizeType } from "antd/lib/config-provider/SizeContext";

export enum Types {
  FETCH_SETTINGS = 'FETCH_SETTINGS'
}

export interface ISettings {
  sourceId: string;
  size: SizeType;
  freezeColumns: boolean;
  hideBlankLines: boolean;
  flatMode: boolean;
  pageSize: number;
}
export interface IFetchSettings { type: typeof Types.FETCH_SETTINGS; payload: ISettings; }

export type Actions = IFetchSettings;