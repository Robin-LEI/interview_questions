const PENDING = 'PENDING'; // 等待态
const REJECTED = 'REJECTED'; // 失败态
const RESOLVED = 'RESOLVED'; // 成功态

const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {
    // 解决循环引用的问题
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  let called; // 成功失败只能调用一次
  if ((typeof x === 'object' && x != null) || typeof x === 'function') {
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject)
        }, e => {
          if (called) return;
          called = true;
          reject(e);
        });
      } else { // 普通对象 {name: 'test'}
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING
    // 成功的值
    this.value = undefined
    // 失败的原因
    this.reason = undefined
    this.onFulfilledCallbacks = [] // 保存成功的回调函数
    this.onRejectCallbacks = [] // 保存失败的回调函数
    // 成功态函数
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value;
        this.status = RESOLVED;
        this.onFulfilledCallbacks.forEach(fn => fn());
      }
    }
    // 失败态函数
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectCallbacks.forEach(fn => fn());
      }
    }
    // 执行器函数立即执行
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // 穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0); // 为了可以获取到promise2实例

      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      // 异步情况下，有可能调用then的时候状态为pending
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    })
    return promise2; // 为了实现链式调用
  }
}

// 测试入口
// 延迟对象：帮助快速创建promise，解决一层嵌套问题
Promise.defer = Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

// 返回结果是有序的
// 全部成功才算成功，有一个失败就算失败
// 返回Promise实例

// 判断一个数值是不是Promise
const isPromise = value => {
  if ((typeof value === 'object' && value != null) || typeof value === 'function') {
    if (typeof value.then === 'function') {
      return true
    }
  } else {
    return false
  }
}
Promise.all = (values) => {
  return new Promise((resolve, reject) => {
    let arr = []
    let index = 0 // 计数器 判断是否全部执行成功
    const processData = (k, v) => {
      arr[k] = v;
      if (++index === values.length) {
        resolve(arr)
      }
    }
    for (let i = 0; i < values.length; i++) {
      let current = values[i];
      if (isPromise(current)) {
        current.then(data => {
          processData(i, data);
        })
      } else {
        processData(i, current);
      }
    }
  })
}

// Promise.finally
// 返回的也是一个promise实例
// 无论成功还是失败都会执行
Promise.prototype.finally = (cb) => {
  return this.then((data) => {
    // Promise.resolve 这个函数会等待参数promise执行完成在执行（如果接受的参数是promise类型）
    // 如果存放的是普通值，会将这个值包装成promise，如果存放
    // 的是promise，会等待这个promise执行完后在继续执行
    return Promise.resolve(cb()).then(() => data)
  }, (err) => {
    return Promise.resolve(cb()).then(() => {
      throw err;
    })
  })
}

// 实现 Promise.resolve
// Promise.resolve(1) 等价于 new Promise(resolve => resolve(1))
Promise.resolve = function(value) {
  return new Promise((resolve, reject) => resolve(value))
}

// 实现 Promise.reject
// Promise.reject('err') 等价于 new Promise((resolve, reject) => reject('err'))
Promise.reject = function(reason) {
  return new Promise((resolve, reject) => reject(reason))
}

// 实现 Promise.race
// Promise.race[p1,p2,p3] 哪个结果获取的快就返回哪个结果，不管这个结果本身是成功还是失败
Promise.race = (promises) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      let promise = promises[i];
      Promise.resolve(promise).then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
    }
  })
}

// 实现 Promise.catch
// 相当于then的语法糖 但是只能捕获到onRejected状态
Promise.prototype.catch = function(callback) {
  return this.then(null, callback);
}

// Promise.try
// 可以实现同步函数同步执行，异步函数异步执行
const f = () => console.log('now');
Promise.try(f)

// npm i promises-aplus-tests -g
// promises-aplus-test promise.js

module.exports = Promise

