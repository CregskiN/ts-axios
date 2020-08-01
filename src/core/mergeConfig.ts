import { AxiosRequestConfig } from '../types';
import { isPlainObject, deepMerge } from '../helpers/util';

const strats = Object.create(null);

/**
 * 默认策略：当 val1 val2 同时存在，取 val2
 * @param val1
 * @param val2
 */
function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1;
}

/**
 * 策略2：只取 val2
 * @param val1
 * @param val2
 */
function fromVal2Strat(val1: any, val2: any): any {
    if (typeof val2 !== 'undefined') {
        return val2;
    }
}

/**
 * 策略3：深度合并
 * @param val1
 * @param val2
 */
function deepMergeStrat(val1: any, val2: any): any {
    if (isPlainObject(val2)) {
        // val2 为普通对象
        return deepMerge(val1, val2);
    } else if (typeof val2 !== 'undefined') {
        // val2 为基本数据类型
        return val2;
    } else if (isPlainObject(val1)) {
        // val1 为普通对象
        return deepMerge(val1);
    } else if (typeof val1 !== 'undefined') {
        // val1 为基本数据类型
        return val1;
    }
}

const stratKeysFromVal2 = ['url', 'params', 'data'];
stratKeysFromVal2.forEach((key) => {
    strats[key] = fromVal2Strat;
});

const stratKeysDeepMerge = ['headers'];
stratKeysDeepMerge.forEach((key) => {
    strats[key] = deepMergeStrat;
});

export default function mergeConfig(
    config1: AxiosRequestConfig,
    config2?: AxiosRequestConfig
): AxiosRequestConfig {
    if (!config2) {
        config2 = {} as any;
    }

    const config = Object.create(null);

    for (const key in config2) {
        mergeField(key);
    }

    for (const key in config1) {
        if (!config2![key]) {
            mergeField(key);
        }
    }

    function mergeField(key: string): void {
        const strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2![key]);
    }

    return config;
}
