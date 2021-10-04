1. 不管成功还是失败都会执行
2. finally接受一个回调函数
3. 实现原理是：内部调用 then 方法，在成功和失败的回调中都调用 cb



```js
Promise.prototype.finally = function(cb) {
    return this.then(value => {
        return Promise.resolve(cb()).then(() => resolve(value));
    }, reason => {
        return Promise.resolve(cb()).then(() => { throw reason });
    })
}
```

