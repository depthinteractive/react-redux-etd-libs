import { createStore, applyMiddleware, compose, combineReducers, Store, Action, AnyAction, Reducer } from 'redux';
import thunk, { ThunkMiddleware } from "redux-thunk";
import { AppActions } from './actions';
// reducers
import authReducer from './auth/reducers';
import reportReducer from './report/reducers';
import settingsReducer from './settings/reducers';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    webkitSpeechRecognition: SpeechRecognition;
    webkitSpeechGrammarList: SpeechGrammarList;
    webkitSpeechRecognitionEvent: SpeechRecognitionEvent;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const staticReducers = {
  auth: authReducer,
  report: reportReducer,
  settings: settingsReducer,
}
const rootReducer = combineReducers({
  ...staticReducers
});

export type AppState = ReturnType<typeof rootReducer>;
export interface IStore<S = any, A extends Action = AnyAction> extends Store<S, A> {
  injectReducers?: (reducers: { [key: string]: Reducer<S, A> }) => void;
}
const store: IStore<AppState, AppActions> = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<AppState, AppActions>)));
store.injectReducers = (reducers: { [key: string]: Reducer<any, any> }): void => {
  store.replaceReducer(combineReducers({ ...staticReducers, ...reducers }));
}
export default store;