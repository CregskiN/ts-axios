import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';
import CancelToken from './cancel/CancelToken';
import Cancel, { isCancel } from './cancel/Cancel';

/**
 * 工厂函数 产出混合对象类型
 */
function createInstance(config: AxiosRequestConfig): AxiosStatic /* AxiosInstance */ {
    const context = new Axios(config);
    const instance = Axios.prototype.request.bind(context);

    extend(instance, context);
    return instance as AxiosStatic;
}

/**
 * axios 本身是一个函数
 * 拥有来自 context 的 get post 等静态属性
 */
const axios = createInstance(defaults);

axios.create = function create(config: AxiosRequestConfig) {
    return createInstance(mergeConfig(defaults, config));
};
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

export default axios;
