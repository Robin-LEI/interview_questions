
const PENDING = 'PENDING';
const RESOLVED = 'RESOLVED';
const REJECTED = 'REJECTED';

const resolvePromise = (promise2, x, resolve, reject) => {
    // x是上一个 then 的返回值
    if (promise2 === x) {
        return new TypeError(reject('[TypeError: Chaining cycle detected for promise #<Promise>]'));
    }
    // 防止成功了在走失败 防止失败走成功 针对的是 别人的库
    let called;
    // 如果x是对象或者是函数，那么就可能是一个promise
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
            let then = x.then;
            // 用 try catch 包裹 是 因为取 then的时候可以会报错
            if (typeof then === 'function') { // 认为 x 是promise，则是成功还是失败取决于promise的状态
                then.call(x, y => {
                    // resolve(y);
                    // 递归解析 resolve(new Promise(...))
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);                    
                }, e => {
                    if (called) return;
                    called = true;
                    reject(e);
                });
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 否则就认为是普通值 走 成功
        resolve(x);
    }
}

class Promise {
    constructor(executor) {
        // 成功的原因
        this.value = undefined;
        // 失败的原因
        this.reason = undefined;
        // 默认状态是 PENDING 状态
        this.status = PENDING;
        // 保存成功的回调函数
        this.onFulfilledCallbacks = [];
        // 保存失败的回调函数
        this.onRejectedCallbacks = [];
        // 自定义成功和失败的函数
        const resolve = value => {
            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        }
        const reject = reason => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    // 每一个 promise 实例都有一个 then 方法
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e };
        // 每一个 then 都会返回一个 新的 promise 实例 ，供链式调用
        let promise2 = new Promise((resolve, reject) => {
            // 因为 promise的执行器函数是立即执行的 所以可以把它放在内部
            // 有可能调用then的时候，状态还是 PENDING
            // 这个时候需要先把他们存储起来，等到 调用 成功或者失败的时候 在依次执行
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            if (this.status === RESOLVED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                    
                });

                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        return promise2;
    }
}

// 测试入口 promises-aplus-tests 全局安装
// promise的延迟对象
Promise.defer = Promise.deferred = function() {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}

module.exports = Promise;