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
 * 实现混合类型。将 U 中的方法、属性复制到 T 中
 */
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    (to as T & U)[key] = from[key] as any;
  }
  return to as T & U;
}
