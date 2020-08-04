import Cancel from './Cancel';
import { CancelExecutor, CancelTokenSource, Canceler } from '../types';

interface ResolvePromise {
    (reason?: Cancel): void;
}

/**
 * 使用Promise实现异步分离
 * 1. new 阶段，Promise 处于pendding
 * 2. source() 获取cancel
 * 3. cancel() 使pendding变为rejecting
 */
export default class CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;

    constructor(executor: CancelExecutor) {
        let resolvePromise: ResolvePromise;

        this.promise = new Promise<Cancel>((resolve) => {
            resolvePromise = resolve;
        });

        executor((message) => {
            if (this.reason) {
                return;
            }
            this.reason = new Cancel(message);
            resolvePromise(this.reason); // cancel(this.reason) -> Promise Resolved -> xhr.abort() -> reject(reason)
        });
    }

    /**
     * 获取 token 和 cancel
     * token: 记录cancel使用情况
     * calcen: 改变token状态的函数
     */
    static source(): CancelTokenSource {
        let cancel!: Canceler;
        const token = new CancelToken(function executor(c) {
            cancel = c; // if(this.reason){return} this.rea....
        });
        return {
            token,
            cancel, // 对于未使用的cancel()，则调用xhr.abort()
        };
    }

    /**
     * 如果token已被使用，停止发送request，并抛出异常
     */
    throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
}
