import { isPlainObject } from './util';

/**
 * 转化为 xhr.send() 可以接收的参数
 * @param data
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

/**
 * 将 string 类型的 response data 转化为 json 类型
 * @param data
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (err) {
      // do nothing
    }
  }
  return data;
}
