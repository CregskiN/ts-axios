import { AxiosRequestConfig } from './types';
import { request } from 'http';

export default function xhr(config: AxiosRequestConfig): void {
  const { data = null, url, method = 'get' } = config;

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.send(data);
}
