返回了一个 promise 实例，指定了错误原因。



```js
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    });
}
```

