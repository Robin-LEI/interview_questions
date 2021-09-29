
// 三个状态
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
const PENDING = 'PENDING';

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined; // 成功的原因
    this.reason = undefined; // 失败的原因
    // 定义成功的函数
    const resolve = data=> {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.value = data;
      }
    }
    // 定义失败的函数
    const reject = error => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = error;
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
    if (this.status === RESOLVED) {
      onFufilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
