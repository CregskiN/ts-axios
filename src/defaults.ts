import { processHeaders } from './helpers/headers';
import { transformRequest, transformResponse } from './helpers/data';

import { AxiosRequestConfig } from './types';

const defaults: AxiosRequestConfig = {
    url: '',

    method: 'get',

    timeout: 0,

    headers: {
        common: {
            Accept: 'application/json, text/plain;*/*',
        },
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    transformRequest: [
        function (data: any, headers: any): any {
            processHeaders(headers, data);
            return transformRequest(data);
        },
    ],
    transformResponse: [
        function (data: any): any {
            return transformResponse(data);
        },
    ],

    validateStatus(status: number): boolean {
        return status >= 200 && status < 300;
    },
};

const methodsNoData = ['get', 'options', 'head', 'delete'];

methodsNoData.forEach((method) => {
    defaults.headers[method] = {};
});

const methodsWithData = ['post', 'patch', 'put'];

methodsWithData.forEach((method) => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-unlencoded',
    };
});

export default defaults;
