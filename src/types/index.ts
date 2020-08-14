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
    transformRequest?: AxiosTransformer | AxiosTransformer[];
    transformResponse?: AxiosTransformer | AxiosTransformer[];
    cancelToken?: CancelToken;
    withCredentials?: boolean;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;

    onUploadProgress?: (e: ProgressEvent) => void;
    onDownloadProgress?: (e: ProgressEvent) => void;

    auth?: AxiosBasicCredentials;
    validateStatus?: (status: number) => boolean;
    [propName: string]: any;
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

// TODO:增加泛型支持
export interface AxiosTransformer {
    (data: any, headers?: any): any;
}

/**
 * axios. Axios 类类型
 */
export interface AxiosStatic extends AxiosInstance {
    create(config?: Partial<AxiosRequestConfig>): AxiosInstance;
    CancelToken: CancelTokenStatic;
    Cancel: CancelStatic;
    isCancel: (val: any) => boolean;
}

/**
 * CancelToken 的实例类型
 */
export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    /* 若canceltoken已被使用，则不用发出request抛出错误 */
    throwIfRequested(): void;
}

export interface Canceler {
    (message?: string): void;
}

export interface CancelExecutor {
    (cancel: Canceler): void;
}

export interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}

/**
 * CancelToken 的类类型，包含静态方法和构造函数
 */
export interface CancelTokenStatic {
    new (executor: CancelExecutor): CancelToken;
    source(): CancelTokenSource;
}

export interface Cancel {
    message?: string;
}

export interface CancelStatic {
    new (message?: string): Cancel;
}

export interface AxiosBasicCredentials {
    username: string;
    password: string;
}
