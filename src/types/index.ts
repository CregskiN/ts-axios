export type Method =
  | 'GET'
  | 'POST'
  | 'DELETE'
  | 'PUT'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'get'
  | 'post'
  | 'delete'
  | 'put'
  | 'head'
  | 'options'
  | 'patch';

export interface AxiosRequestConfig {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
}
