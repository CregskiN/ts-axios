const toString = Object.prototype.toString;

/**
 * 判断是否是 Date 类型
 * @param val
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]';
}

/**
 * 判断是否是 Object 类型
 * @param val
 */
export function isObject(val: any): val is Record<string, any> {
  return typeof val === 'object' && val !== null;
}
