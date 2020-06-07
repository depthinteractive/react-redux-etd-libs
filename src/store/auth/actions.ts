import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';
// store
import { IAuth, Types } from './types';
import { AppActions } from '../actions';
import { AppState } from '..';
// core
import Axios from '../../core/axios';
import { IGraphql, IResponse } from '../../core/Response';

let timeout: NodeJS.Timeout;

export const logout = (): AppActions => {
  console.log('LOGOUT');
  localStorage.removeItem('token');
  localStorage.removeItem('expiryDate');
  localStorage.removeItem('userId');
  return { type: Types.LOGOUT }
};

const login = (auth: IAuth, dispatch: Dispatch<AppActions>): AppActions => {
  if(timeout) 
    clearTimeout(timeout); 
  const remainingMilliseconds: number = 60 * 60 * 1000;
  const expiryDate: Date = new Date(new Date().getTime() + remainingMilliseconds);

  localStorage.setItem('token', auth.token as string);
  localStorage.setItem('userId', auth.userId as string);
  localStorage.setItem('expiryDate', expiryDate.toISOString());
  timeout = setTimeout(() => { dispatch(logout()) }, remainingMilliseconds);
  return { type: Types.LOGIN, payload: auth }
};

export const onLogout = () => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState): Promise<void> => {
    dispatch(logout());
  }
}

export const onLogged = () => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState): Promise<void> => {
    const token: string | null = localStorage.getItem('token');
    const expiryDate: string | null = localStorage.getItem('expiryDate');
    
    if(token && expiryDate && (new Date(expiryDate) <= new Date())){
      const userId: string = localStorage.getItem('userId') as string; //'5dfb64b703cab32a0424d55d'
      const requestBody = {
        query: `
          query ReadUser($id: ID!){
            readUser(input: {_id: $id}){
              email
            }
          }
        `,
        variables: { id: userId }
      };
      
      try{
        const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
        const user: IAuth = res.data.data.readUser;
        dispatch(login({ token, userId, tokenExpiration: 1, email: user.email }, dispatch));
      }catch(err){
        throw err;
      }
    }
  }
}

export const onLogin = (values: any) => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState): Promise<void> => {
    const requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            email
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: { email: values.email, password: values.password }
    };

    try{
      const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
      dispatch(login(res.data.data.login, dispatch));
    }catch(err){
      throw err;
    }
  }
}

export const onSignup = (values: any) => {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState): Promise<void> => {
    const requestBody = {
      query: `
        query Signup($email: String!, $password: String!) {
          signup(email: $email, password: $password) {
            email
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: { email: values.email, password: values.password }
    };

    try{
      const res: AxiosResponse<IResponse<IGraphql<IAuth>>> = await Axios({ data: requestBody });
      dispatch(login(res.data.data.signup, dispatch));
    }catch(err){
      throw err;
    }
  }
}