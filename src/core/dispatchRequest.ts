import xhr from '../xhr';
import { bindURL } from '../helpers/url';
import { transformRequest, transformResponse } from '../helpers/data';
import { processHeaders } from '../helpers/headers';

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';

// 类似建造者模式

/**
 *
 * @param config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  return xhr(config).then((res) => transformResponseData(res));
}

/**
 * 对 config 预处理
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config); // 先处理 headers 再处理 data
  config.data = transformData(config);
}

/**
 * 转化 config 中 URL 和 params
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return bindURL(url, params);
}

/**
 * 转化 config 中 body
 * @param config
 */
function transformData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data);
}

/**
 * 转化 config 中 headers
 * @param config
 */
function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data);
  return res;
}
