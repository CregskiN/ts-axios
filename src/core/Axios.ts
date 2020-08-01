import dispatchRequest from './dispatchRequest';
import InterceptorManager from './InterceptorManager';

import {
  AxiosRequestConfig,
  AxiosPromise,
  Axios,
  Method,
  AxiosResponse,
  ResolvedFn,
  RejectedFn,
} from '../types';

interface Interceptor {
  request: InterceptorManager<AxiosRequestConfig>;
  response: InterceptorManager<AxiosResponse>;
}

interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise);
  rejected?: RejectedFn;
}

// 策略模式
export default class implements Axios {
  public interceptors: Interceptor;

  constructor() {
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    };
  }

  // request(config: AxiosRequestConfig): AxiosPromise {
  //     return dispatchRequest(config);
  // }

  request(url: any, config?: any): AxiosPromise {
    // 为实现函数重载，做以下修改
    if (typeof url === 'string') {
      // 如果第一个参数是 string，则为 axios(url,{config})调用
      if (!config) {
        // 如果第二个参数未传 或为 null
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest, // xhr
        rejected: undefined,
      },
    ];

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor); // 放到 xhr 之前，先加 use 后执行
    });

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor); // 放到 xhr 之后，先 use 先执行
    });

    let promise = Promise.resolve(config);
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    // return dispatchRequest(config);
    return promise;
  }

  get(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): AxiosPromise {
    return this._requestMethodWithoutData(url, 'get', config);
  }

  delete(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): AxiosPromise {
    return this._requestMethodWithoutData(url, 'delete', config);
  }

  head(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): AxiosPromise {
    return this._requestMethodWithoutData(url, 'head', config);
  }

  options(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): AxiosPromise {
    return this._requestMethodWithoutData(url, 'options', config);
  }

  post(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
  ): AxiosPromise {
    return this._requestMethodWithData(url, 'post', data, config);
  }

  put(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
  ): AxiosPromise {
    return this._requestMethodWithData(url, 'put', data, config);
  }

  patch(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
  ): AxiosPromise {
    return this._requestMethodWithData(url, 'patch', data, config);
  }

  private _requestMethodWithoutData(
    url: string,
    method: Method,
    config?: Omit<AxiosRequestConfig, 'url' | 'method'>
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      }) as Omit<AxiosRequestConfig, 'url' | 'method'> & AxiosRequestConfig
    );
  }

  private _requestMethodWithData(
    url: string,
    method: Method,
    data: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data,
      })
    );
  }
}
