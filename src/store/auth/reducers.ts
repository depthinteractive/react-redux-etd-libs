import { IAuth, Actions, Types } from './types';

export const initialState: IAuth = {
  email: null,
  token: null,
  userId: null,
  tokenExpiration: null
}

const authReducer = (state: IAuth = initialState, action: Actions): IAuth => {
  switch(action.type){
    case Types.LOGIN:
      return { ...state, ...action.payload }
    case Types.LOGOUT:
      const upState: IAuth = state;
      Object.keys(upState).map((k) => upState[k as keyof IAuth] = null);
      return { ...state, ...upState }
    default:
      return state;
  }
}
export default authReducer;