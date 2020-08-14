import { parseHeaders } from './helpers/headers';
import { createError } from './helpers/error';
import cookie from './helpers/cookie';

import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types';
import { isSameOriginURL } from './helpers/url';
import { isFromData } from './helpers/util';

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
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName,
            onDownloadProgress,
            onUploadProgress,
            auth,
            validateStatus,
        } = config;

        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);

        _configXHR();

        _addEvents();

        _processHeaders();

        _processCancel();

        xhr.send(data);

        function _configXHR() {
            if (responseType) {
                console.log(responseType);
                xhr.responseType = responseType;
            }

            if (timeout) {
                xhr.timeout = timeout;
            }

            if (withCredentials) {
                xhr.withCredentials = withCredentials;
            }
        }

        function _addEvents() {
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
                reject(
                    createError(`Timeout of ${timeout} is exceeded`, config, 'ECONNABORTED', xhr)
                );
            };

            if (onDownloadProgress) {
                xhr.onprogress = onDownloadProgress;
            }

            if (onUploadProgress) {
                xhr.upload.onprogress = onUploadProgress;
            }
        }

        function _processHeaders() {
            if (isFromData(data)) {
                delete headers['Content-Type'];
            }

            if (auth) {
                headers['Authorization'] =
                    'Basic ' + window.btoa(auth.username + ':' + auth.password);
            }

            /**
             * 对于同源或添加了withCredentials属性的request
             * 1. 读出cookie值
             * 2. 将cookie的值添加到header中xsrfHeaderName字段
             */
            if ((withCredentials || isSameOriginURL(url)) && xsrfCookieName) {
                const xsrfValue = cookie.read(xsrfCookieName);
                if (xsrfValue && xsrfHeaderName) {
                    headers[xsrfHeaderName] = xsrfValue;
                }
            }

            Object.keys(headers).forEach((name) => {
                if (data === null && name.toLowerCase() === 'content-type') {
                    delete headers[name];
                } else {
                    xhr.setRequestHeader(name, headers[name]);
                }
            });
        }

        function _processCancel() {
            if (cancelToken) {
                cancelToken.promise.then((reason) => {
                    xhr.abort();
                    reject(reason);
                });
            }
        }

        /**
         * 辅助函数，以对异常情况和正常情况分别处理
         * @param response
         */
        function handleResponse(response: AxiosResponse): void {
            if (!validateStatus || validateStatus(response.status)) {
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
