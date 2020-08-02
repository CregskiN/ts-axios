import { AxiosTransformer } from '../types';

/**
 * 使用 fns 对 data headers 做处理
 * @param data
 * @param headers
 * @param fns
 */
export default function transform(
    data: any,
    headers: any,
    fns?: AxiosTransformer | AxiosTransformer[]
): any {
    if (!fns) {
        return data;
    }

    if (!Array.isArray(fns)) {
        fns = [fns];
    }

    fns.forEach((fn) => {
        data = fn(data, headers);
    });

    return data;
}
