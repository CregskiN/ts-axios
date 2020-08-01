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
