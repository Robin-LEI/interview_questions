1. 哪个结果获取的快，就先返回哪个结果
2. 接收一个数组



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

Promise.race = promises => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }, err => {
                reject(err);
            })
        }
    })
}
```

