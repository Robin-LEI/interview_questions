1. Promise.allSettled 总是返回 成功
2. 并且返回每一项的状态和值



```js
Promise.allSettled = function (promises) {
    // const resolveHandler = value => ({ status: 'fulfilled', value: value });
    // const rejectHandler = reason => ({ status: 'rejected', reason: reason });

    // return Promise.all(promises.map(promise => {
    //     Promise.resolve(promise).then(resolveHandler, rejectHandler);
    // }));

    if (promises.length === 0) return Promise.resolve([])
    return new Promise((resolve, reject) => {

        let result = []
        let num = 0
        const check = () => {
            if (num === promises.length) resolve(result)
        }
        promises.forEach((item, index) => {
            Promise.resolve(item).then(
                res => {
                    result[index] = { status: 'fulfilled', value: res }
                    num++
                    check()
                },
                err => {
                    result[index] = { status: 'rejected', reason: err }
                    num++
                    check()
                }
            )
        })
        
    })
}
```

