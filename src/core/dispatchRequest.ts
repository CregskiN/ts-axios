import xhr from '../xhr';
import { bindURL } from '../helpers/url';
import { flattenHeaders } from '../helpers/headers';
import transform from '../core/transform';

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types';

// 类似建造者模式

/**
 *
 * @param config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    throwIfCancellationRequested(config);
    processConfig(config);
    return xhr(config).then((res) => {
        return transformResponseData(res);
    });
}

/**
 * 对 config 预处理
 * @param config
 */
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config);
    config.data = transform(config.data, config.headers, config.transformRequest);
    config.headers = flattenHeaders(config.headers, config.method!);
}

/**
 * 转化 config 中 URL 和 params
 */
function transformURL(config: AxiosRequestConfig): string {
    const { url, params, paramsSerializer } = config;
    return bindURL(url, params, paramsSerializer);
}

/**
 * 对响应数据做处理
 * @param res
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
    // res.data = transformResponse(res.data);
    res.data = transform(res.data, res.headers, res.config.transformResponse);
    return res;
}

/** */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
}
