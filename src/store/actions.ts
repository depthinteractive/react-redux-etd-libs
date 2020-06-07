import { Actions as Auth } from './auth/types';
import { Actions as Report } from './report/types';
import { Actions as Settings } from './settings/types';

export type AppActions = Auth | Report | Settings;