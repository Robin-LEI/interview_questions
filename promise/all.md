1. 等待所有的 promise 全部执行完成，才会执行。

2. 返回一个新的 promise 实例。
3. 核心思想：借助 Promise.resolve() 把普通对象包装成 promise 对象。



```js
// 拿到所有的 promises
Promise.all = function(promises) {
    let len = promises.length, results = new Array(len), count = 0;
    return new Promise((resolve, reject) => {
        for (let i = 0; i < len; i++) {
        	// 把每一项包装成 promise
            Promise.resolve(promises[i]).then(res => {
               count++;
               results[i] = res;
               if (count === len) {
                   return resolve(results);
               }
            }, err => {
               return reject(err); 
            });
        }
    });
}
```