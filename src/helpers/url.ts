import { isDate, isPlainObject, isURLSearchParams } from './util';

interface URLOrigin {
    protocol: string;
    host: string;
}

function encode(val: string): string {
    return encodeURIComponent(val)
        .replace(/%40/g, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/g, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}

/**
 * 拼接params到URL
 */
export function bindURL(
    url: string,
    params?: any,
    paramSerializer?: (params: any) => string
): string {
    if (!params) {
        return url;
    } else {
        const parts: string[] = [];
        let serializedParams;

        if (paramSerializer) {
            serializedParams = paramSerializer(params);
        } else if (isURLSearchParams(params)) {
            serializedParams = params.toString();
        } else {
            Object.keys(params).forEach((key) => {
                const val = params[key];
                if (val === null || typeof val === 'undefined') {
                    // 如果值为空
                    return; // 开始下一次遍历
                } else {
                    // 值不为空
                    let values: any[] = [];
                    if (Array.isArray(val)) {
                        // 如果值为数组 /base/get?foo[]=bar&foo[]=baz
                        values = val;
                        key = key + '[]';
                    } else {
                        // 如果是非数组，转化为数组。以使用 values.forEach
                        values = [val];
                    }
                    // 对 values 遍历
                    values.forEach((val) => {
                        if (isDate(val)) {
                            // 如果是 Date 类型
                            val = val.toISOString();
                        } else if (isPlainObject(val)) {
                            // 如果是 Object 类型
                            val = JSON.stringify(val); // 自动忽略 undefined
                        }
                        parts.push(`${encode(key)}=${encode(val)}`);
                    });
                }
            });

            serializedParams = parts.join('&');
        }

        if (serializedParams) {
            // 对于hash 丢弃
            const markIndex = url.indexOf('#');
            if (markIndex !== -1) {
                url = url.slice(0, markIndex);
            }

            // url 已经携带参数 和 没有携带参数
            url = url + (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }
    }
    return url;
}

/**
 *
 * @param requestURL
 */
export function isSameOriginURL(requestURL: string): boolean {
    const parsedOrigin = resolveURL(requestURL);
    return (
        parsedOrigin.host === currentOrigin.host && parsedOrigin.protocol === currentOrigin.protocol
    );
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url: string): URLOrigin {
    urlParsingNode.setAttribute('href', url);
    const { protocol, host } = urlParsingNode;
    return {
        protocol,
        host,
    };
}
