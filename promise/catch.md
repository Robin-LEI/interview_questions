1. Promise.catch 是 then 的语法糖



```js
Promise.prototype.catch = cb => {
    this.then(null, cb);
}
```

