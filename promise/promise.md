1. promise a+
2. ie10 以下不支持 promise，需要 polyfill，es6-promise

# promise 为什么会产生？
1. 解决异步问题
2. 链式异步请求的问题 上一个的输出是下一个的输入
3. 基于回调的

# promise 有三个状态：
1. 成功态（resolve）
2. 失败态（reject）
3. 等待态（不成功也不失败）（pending）

# promise特点
1. promise 是一个类
2. promise 默认执行器函数是立即执行
3. promise 的实例都拥有一个 then 方法，一个参数是成功的回调，另外一个是失败的回调
4. 如果执行函数时，发生了异常也会执行失败逻辑，throw new Error
5. 如果 promise 一旦成功就不能失败，反之亦然
6. promise 调用 then 方法时可能当前的 promise 并没有成功，处在 pending，如果调用 then 的时候，当前的状态是 pending 时，我们需要将成功的回调和失败的回调存放起来，稍后调用 resolve 和 reject 的时候重新执行
7. promise 成功和失败的回调的返回值，可以传递到外层的 then
8. 返回的可能是普通值、promise、错误
  - 如果是普通值，传递到下一次的成功中
  - 如果是出错的情况，一定会走下一次的失败中
  - 如果返回值是 promise，会根据 promise 的状态来
9. 错误处理：如果离自己最近的 then 没有错误处理，就继续向下处理
10. 每次执行完 promise.then 后，都会返回一个新的 promise
11. 为什么调用then，不是返回 this，因为之前说过一旦 promise 状态是成功或者失败之后就不能改了

**Promise.all可以实现等待所有的异步全部完成，拿到统一结果**

# 相关面试题

1. 输出结果

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});
promise.then(() => {
  console.log(3);
});
console.log(4);

// 1 2 4 3
```

2. 请问这三种有何不同

```js
var promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 3000);
});

// 1
promise
  .then(() => {
    return Promise.resolve(2);
  })
  .then((n) => {
    console.log(n); // 2
  });

// 2
promise
  .then(() => {
    return 2;
  })
  .then((n) => {
    console.log(n); // 2
  });

// 3
promise.then(2).then((n) => {
  console.log(n); // 1
});
```

3. 输出结果

```js
let a;
const b = new Promise((resolve, reject) => {
  console.log("promise1");
  resolve();
})
  .then(() => {
    console.log("promise2");
  })
  .then(() => {
    console.log("promise3");
  })
  .then(() => {
    console.log("promise4");
  });

a = new Promise(async (resolve, reject) => {
  console.log(a);
  await b;
  console.log(a);
  console.log("after1");
  await a;
  resolve(true);
  console.log("after2");
});

console.log("end");
```

4. 输出结果

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
  reject("error");
});
promise
  .then(() => {
    console.log(3);
  })
  .catch((e) => console.log(e));
console.log(4);

// 1 2 4 3
```

5. 输出结果

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("once");
    resolve("success");
  }, 1000);
});
promise.then((res) => {
  console.log(res);
});
promise.then((res) => {
  console.log(res);
});
```

6. 输出结果

```js
const p1 = () =>
  new Promise((resolve, reject) => {
    console.log(1);
    let p2 = new Promise((resolve, reject) => {
      console.log(2);
      const timeOut1 = setTimeout(() => {
        console.log(3);
        resolve(4);
      }, 0);
      resolve(5);
    });
    resolve(6);
    p2.then((arg) => {
      console.log(arg);
    });
  });
const timeOut2 = setTimeout(() => {
  console.log(8);
  const p3 = new Promise((reject) => {
    reject(9);
  }).then((res) => {
    console.log(res);
  });
}, 0);

p1().then((arg) => {
  console.log(arg);
});
console.log(10);
```

7. 输出结果

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
```

8. 输出结果

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
  }, 1000);
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});

console.log("promise1", promise1);
console.log("promise2", promise2);

setTimeout(() => {
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
```

9. 输出结果

```js
const promise = new Promise((resolve, reject) => {
  resolve("success1");
  reject("error");
  resolve("success2");
});

promise
  .then((res) => {
    console.log("then: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
  });
```

10. 输出结果

```js
Promise.resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });
```

11. 输出结果

```js
process.nextTick(() => {
  console.log("nextTick");
});
Promise.resolve().then(() => {
  console.log("then");
});
setImmediate(() => {
  console.log("setImmediate");
});
console.log("end");
```

12. 输出结果

```js
var p = new Promise(function (resolve, reject) {
  resolve(1);
});
p.then(function (value) {
  //第一个then
  console.log(value);
  return value * 2;
})
  .then(function (value) {
    //第二个then
    console.log(value);
  })
  .then(function (value) {
    //第三个then
    console.log(value);
    return Promise.resolve("resolve");
  })
  .then(function (value) {
    //第四个then
    console.log(value);
    return Promise.reject("reject");
  })
  .then(
    function (value) {
      //第五个then
      console.log("resolve: " + value);
    },
    function (err) {
      console.log("reject: " + err);
    }
  );
```

13. 如何判断一个值是不是promise
```js
const isPromise = value => {
  if ((typeof value === 'object' && value != null) || typeof value === 'function') {
    if (typeof value.then === 'function') {
      return true
    }
  } else {
    return false
  }
}
```



14. Promise.allSettled了解吗？手写Promise.allSettled

    ```js
    const resolved = Promise.resolve(42);
    const rejected = Promise.reject(-1);
    
    // 参数是一组Promise实例
    // 返回一个新的Promise实例
    // 只有等到这些参数实例全部都返回结果，不管结果是成功还是失败，才会结束
    // 一旦结束，状态总是成功
    const allSettledPromise = Promise.allSettled([resolved, rejected]);
    
    // 新的实例给监听函数传递一个数组，数组的每个成员是一个对象，每一个对象有一个status属性，
    // 记录成功还是失败，如果是成功，还有一个额外的value属性，如果是失败，还有一个额外的属性reason
    allSettledPromise.then(function (results) {
        console.log(results);
    });
    
    // 应用场景：有时候我们不关心异步操作的结果，只关心异步操作有没有结束，这个方法比较适用
    // [
    //    { status: 'fulfilled', value: 42 },
    //    { status: 'rejected', reason: -1 }
    // ]
    
    const formatSettledResult = (success, value) =>
    success
    ? { status: "fulfilled", value }
    : { status: "rejected", reason: value };
    
    Promise.all_settled = function (iterators) {
        const promises = Array.from(iterators);
        const num = promises.length;
        const resultList = new Array(num);
        let resultNum = 0;
    
        return new Promise((resolve) => {
            promises.forEach((promise, index) => {
                Promise.resolve(promise)
                    .then((value) => {
                    resultList[index] = formatSettledResult(true, value);
                    if (++resultNum === num) {
                        resolve(resultList);
                    }
                })
                    .catch((error) => {
                    resultList[index] = formatSettledResult(false, error);
                    if (++resultNum === num) {
                        resolve(resultList);
                    }
                });
            });
        });
    };
    
    const resolved = Promise.resolve(42);
    const rejected = Promise.reject(-1);
    Promise.all_settled([resolved, rejected]).then((results) => {
        console.log(results);
    });
    ```

    

# 更多面试题：[点击访问](https://juejin.cn/post/6844904077537574919#heading-50)

# promise 源码
```js
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

```