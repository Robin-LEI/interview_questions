1. 返回一个promise实例
2. 指定了成功的原因
3. 把一个对象包装成 promise 对象，可以是普通对象，也可以是 promise 对象



```js
Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(resolve, reject)
        } else {
            resolve(value);
        }
    })
}
```

