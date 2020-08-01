import { isPlainObject, deepMerge } from './util';

import { Method } from '../types';

/**
 * 规范化小写 http request 字段为大写
 * @param headers
 * @param normalizedName
 */
function normalizeHeaderName(headers: Record<string, any>, normalizedName: string): void {
    if (!headers) {
        return;
    }
    Object.keys(headers).forEach((name) => {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
            // 判断 诸如 'Content-Type' 和 'content-type' 'Content-type' 等情况，并规范化为 normalizedName
            headers[normalizedName] = headers[name];
            delete headers[name];
        }
    });
}

/**
 * 处理 headers 字段
 * @param headers
 * @param data
 */
export function processHeaders(headers: Record<string, any> = {}, data: any): any {
    // 规范化 http request 字段大小写问题
    normalizeHeaderName(headers, 'Content-Type');
    if (isPlainObject(data)) {
        // 当 data 为普通对象
        if (headers && !headers['Content-Type']) {
            // 存在 headers 且 headers 中没有 'Content-Type' 字段
            headers['Content-Type'] = 'application/json;charset=utf-8';
        }
    }
    return headers;
}

/**
 * 将 xhr 中 getAllResponseText 获取的 plain text 解析为对象
 * @param headers
 */
export function parseHeaders(headers: string): any {
    const parsed = Object.create(null);
    if (!headers) {
        return parsed;
    }
    headers.split('\r\n').forEach((line) => {
        let [key, val] = line.split(':');
        key = key.trim().toLowerCase();
        if (!key) {
            return;
        }
        if (val) {
            val = val.trim();
        }
        parsed[key] = val;
    });
    return parsed;
}

/**
 * 删除 headers 多余内容
 * @param headers
 * @param method
 */
export function flattenHeaders(headers: any, method: Method): any {
    if (!headers) {
        return headers;
    }

    // axios.defaults.headers.common['test2'] = 123
    headers = deepMerge(headers.common, headers[method], headers);

    const methodsDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
    methodsDelete.forEach((method) => {
        delete headers[method];
    });

    return headers;
}
