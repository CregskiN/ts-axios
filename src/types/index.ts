export type Method =
    | 'GET'
    | 'POST'
    | 'DELETE'
    | 'PUT'
    | 'HEAD'
    | 'OPTIONS'
    | 'PATCH'
    | 'get'
    | 'post'
    | 'delete'
    | 'put'
    | 'head'
    | 'options'
    | 'patch';

export interface AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
    responseType?: XMLHttpRequestResponseType;
    timeout?: number;
}

export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request: any;
}

export type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

export interface AxiosError extends Error {
    config: AxiosRequestConfig;
    isAxiosError: boolean;
    code?: string | null;
    request?: any;
    response?: AxiosResponse;
}

export interface Axios {
    defaults: AxiosRequestConfig;
    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse>;
    };

    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
    get<T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url' | 'method'>): AxiosPromise<T>;
    delete<T = any>(
        url: string,
        config?: Omit<AxiosRequestConfig, 'url' | 'method'>
    ): AxiosPromise<T>;
    head<T = any>(
        url: string,
        config?: Omit<AxiosRequestConfig, 'url' | 'method'>
    ): AxiosPromise<T>;
    options<T = any>(
        url: string,
        config?: Omit<AxiosRequestConfig, 'url' | 'method'>
    ): AxiosPromise<T>;

    post<T = any>(
        url: string,
        data?: any,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
    ): AxiosPromise<T>;
    put<T = any>(
        url: string,
        data?: any,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
    ): AxiosPromise<T>;
    patch<T = any>(
        url: string,
        data?: any,
        config?: Omit<AxiosRequestConfig, 'url' | 'method' | 'data'>
    ): AxiosPromise<T>;
}

/**
 * 混合对象，既可以axios({...}) 也可以 axios.get/post/put等
 */
export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
    <T = any>(url: string, config?: Omit<AxiosRequestConfig, 'url'>): AxiosPromise<T>;
}

export interface ResolvedFn<T> {
    (val: T): T | Promise<T>;
}

export interface RejectedFn {
    (error: any): any;
}

export interface AxiosInterceptorManager<T> {
    use(resovled: ResolvedFn<T>, rejected?: RejectedFn): number;
    eject(id: number): void;
}
