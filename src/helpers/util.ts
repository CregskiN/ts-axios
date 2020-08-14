const toString = Object.prototype.toString;

/**
 * 判断是否是 Date 类型
 * @param val
 */
export function isDate(val: any): val is Date {
    return toString.call(val) === '[object Date]';
}

// /**
//  * 判断是否是 Object 类型。Array、Object、Date 等
//  * @param val
//  */
// export function isObject(val: any): val is Record<string, any> {
//   return typeof val === 'object' && val !== null;
// }

/**
 * 判断是否为普通对象 {key: value}
 * @param val
 */
export function isPlainObject(val: any): val is Record<string, any> {
    return toString.call(val) === '[object Object]';
}

/**
 * 判断是否是 FormDta，用于上传/下载逻辑
 * @param val
 */
export function isFromData(val: any): val is FormData {
    return typeof val !== 'undefined' && val instanceof FormData;
}

/**
 * 实现混合类型。将 U 中的方法、属性复制到 T 中
 */
export function extend<T, U>(to: T, from: U): T & U {
    for (const key in from) {
        (to as T & U)[key] = from[key] as any;
    }
    return to as T & U;
}

/**
 * 深合并，只考虑同为普通对象
 * @param objs
 */
export function deepMerge(...objs: Array<any>): Record<string, any> {
    const result = Object.create(null);
    objs.forEach((obj) => {
        // objs: [{},{},{}]
        if (obj) {
            // obj: {}
            Object.keys(obj).forEach((key) => {
                const val = obj[key];
                if (isPlainObject(val)) {
                    // obj[key] 普通对象类型
                    if (isPlainObject(result[key])) {
                        // obj[key] 和 result[key] 同为 普通对象类型
                        result[key] = deepMerge(result[key], val);
                    } else {
                        // obj[key] 和 result[key] 不同为普通对象类型 or result[key] 不存在
                        result[key] = deepMerge(val);
                    }
                } else {
                    // obj[key] 普通数据类型
                    result[key] = val;
                }
            });
        }
    });
    return result;
}
