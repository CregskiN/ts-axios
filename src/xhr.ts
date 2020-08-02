import { parseHeaders } from './helpers/headers';
import { createError } from './helpers/error';

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types';
import { request } from 'http';

/**
 * axios web端 http 核心
 * @param config
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const {
            data = null,
            url,
            method = 'get',
            headers = {},
            responseType,
            timeout,
            cancelToken,
        } = config;

        const xhr = new XMLHttpRequest();

        if (responseType) {
            console.log(responseType);
            xhr.responseType = responseType;
        }

        if (timeout) {
            xhr.timeout = timeout;
        }

        xhr.open(method, url, true);

        xhr.onreadystatechange = function handleLoad() {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 0) {
                return;
            }
            const responseHeaders = xhr.getAllResponseHeaders();
            const responseData = responseType !== 'text' ? xhr.response : xhr.responseText;
            const response: AxiosResponse = {
                data: responseData,
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(responseHeaders),
                config: config,
                request: xhr,
            };
            handleResponse(response);
        };

        xhr.onerror = function handleError() {
            reject(createError('Netwrok Error', config, null, xhr)); // error 时拿不到 response
        };

        xhr.ontimeout = function handleTimeout() {
            reject(createError(`Timeout of ${timeout} is exceeded`, config, 'ECONNABORTED', xhr));
        };
        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                // 当未传 data，且
                delete headers[name];
            } else {
                xhr.setRequestHeader(name, headers[name]);
            }
        });

        if (cancelToken) {
            cancelToken.promise.then((reason) => {
                xhr.abort();
                reject(reason);
            });
        }

        xhr.send(data);

        /**
         * 辅助函数，以对异常情况和正常情况分别处理
         * @param response
         */
        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(
                    createError(
                        `Request failed with status code ${response.status}`,
                        config,
                        null,
                        xhr,
                        response
                    )
                );
            }
        }
    });
}
