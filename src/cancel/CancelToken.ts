import Cancel from './Cancel';
import { CancelExecutor, CancelTokenSource, Canceler } from '../types';

interface ResolvePromise {
    (reason?: Cancel): void;
}

export default class CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;

    constructor(executor: CancelExecutor) {
        let resolvePromise: ResolvePromise;

        this.promise = new Promise<Cancel>((resolve) => {
            resolvePromise = resolve;
        });

        /* 
        const CancelToken = axios.CancelToken;
        let cancel;
        axios.get('/user/12345', {
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
        // 取消请求
        cancel();     
        */
        /**
         * 使用 Promise 实现异步分离
         * // TODO: 多看
         */
        executor((message) => {
            if (this.reason) {
                return;
            }
            this.reason = new Cancel(message);
            resolvePromise(this.reason); // cancel(this.reason) -> Promise Resolved -> xhr.abort() -> reject(reason)
        });
    }

    static source(): CancelTokenSource {
        let cancel!: Canceler;
        const token = new CancelToken((c) => {
            cancel = c;
        });
        return {
            token,
            cancel,
        };
    }

    throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
}
