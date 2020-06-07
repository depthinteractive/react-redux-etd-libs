import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  spinner: boolean;
  requestId?: string;
  msg?: string;
}
const config: ExtendedAxiosRequestConfig = {
  // baseURL: 'http://eb-exp-demo-bpm:8080',
  baseURL: 'http://localhost:3000',
  url: '/report/api/v1/report-data',
  method: 'GET',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  spinner: true,
}
const Axios: AxiosInstance = axios.create(config);
export default Axios;