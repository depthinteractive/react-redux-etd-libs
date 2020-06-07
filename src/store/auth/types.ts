export enum Types {
  LOGOUT = 'LOGOUT',
  LOGIN = 'LOGIN'
}

export interface IAuth {
  email: string | null, 
  token: string | null; 
  userId: string | null; 
  tokenExpiration: number | null;
}
export interface ILogout { type: typeof Types.LOGOUT; }
export interface ILogin { type: typeof Types.LOGIN; payload: IAuth; }

export type Actions = ILogout | ILogin;