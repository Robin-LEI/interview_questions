
// 三个状态
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
const PENDING = 'PENDING';

// 拿到返回结果 决定 promise2 是成功还是失败
const resolvePromise = (promise2, x, resolve, reject) => {

}

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined; // 成功的原因
    this.reason = undefined; // 失败的原因
    this.onResolvedCallbacks = []; // 保存成功的回调
    this.onRejectedCallbacks = []; // 保存失败的回调
    // 定义成功的函数
    const resolve = data => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = data;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    }
    // 定义失败的函数
    const reject = error => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = error;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    }

    try {
      // 执行器函数立即执行
      executor(resolve, reject);
    } catch (e) {
      // 抛错走的是 reject
      reject(e);
    }
  }

  then(onFufilled, onRejected) {

    let promise2 = new Promise((resolve, reject) => {

      if (this.status === RESOLVED) {
        // promise2 在new的时候是拿不到的 所以加个 定时器
        // try catch 无法捕获异步异常 所以在加个 try catch
        setTimeout(() => {
          try {
            let x = onFufilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

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

      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFufilled(this.value);
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


module.exports = Promise;