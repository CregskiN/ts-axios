import { AxiosInstance, AxiosRequestConfig } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';
import defaults from './defaults';

/**
 * 工厂函数 产出混合对象类型
 */
function createInstance(config: AxiosRequestConfig): AxiosInstance {
    const context = new Axios(config);
    const instance = Axios.prototype.request.bind(context);

    extend(instance, context);
    return instance as AxiosInstance;
}

/**
 * axios 本身是一个函数
 * 拥有来自 context 的 get post 等静态属性
 */
const axios = createInstance(defaults);

export default axios;
