import { ResolvedFn, RejectedFn, AxiosInterceptorManager } from '../types';

interface Interceptor<T> {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
}

/**
 * 拦截器管理类
 */
export default class InterceptorManager<T> implements AxiosInterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  /**
   * 添加拦截器
   * @param resolved
   * @param rejected
   */
  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected,
    });
    return this.interceptors.length - 1;
  }

  /**
   * 注销拦截器
   * @param id
   */
  eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  /**
   * 不暴露出去的方法。内部使用
   * @param fn
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach((interceptor) => {
      if (interceptor) {
        fn(interceptor);
      }
    });
  }
}
