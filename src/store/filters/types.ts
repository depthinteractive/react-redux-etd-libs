import { IGroupment } from './groupment/types';
import { IDisplay } from './display/types';
import { ISort } from './sort/types';

export enum Types {
  REPORT_TYPES = 'REPORT_TYPES'
}

export interface IFilters {
  groupment: IGroupment, 
  display: IDisplay;
  sort: ISort
}