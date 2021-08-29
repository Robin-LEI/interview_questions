# 非promise版本

```js
const ajax = {
    get: function(url, cb) {
        let xhr = null;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            xhr = new ActiveXObject()
        }
        // bool: true|false，true表示异步，false表示同步
        xhr.open('get', url, bool)
        xhr.onreadystatechange = function() { // 请求完成会触发
            if (xhr.status === 200 || xhr.status === 304) {
				cb(xhr.responseText)
            }
        }
        xhr.send()
    },
    post: function(url, cb) {
        let xhr = null;
        if (XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else {
            // 兼容iE5、6
            xhr = new ActiveXObject()
        }
        xhr.onreadystatechange = function() {
            if (xhr.status === 200 || xhr.status === 304) {
                cb(xhr.responseText)
            }
        }
        // true表示异步，false表示同步
        xhr.open('post', url, true)
        xhr.send()
    }
}

```



# promise版本

```js
const ajax = {
    get: function(url) {
        const promise = new Promise((resolve, reject) => {
            let xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest()
            } else {
                xhr = new ActiveXObject()
            }
            // true表示异步，false表示同步
            xhr.open('get', url, true)
            xhr.onreadystatechange = function() {
                if (xhr.status === 200 || xhr.status === 304) {
                    resolve(xhr.responseText)
                } else {
                   reject('error') 
                }
            }
            xhr.send()
        });
        return promise;
    },
    post: function(url) {
        const promise = new Promise((resolve, reject) => {
            let xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest()
            } else {
                xhr = new ActiveXObject()
            }
            xhr.onreadystatechange = function() {
                if (xhr.status === 200 || xhr.status === 304) {
                    resolve(xhr.responseText)
                } else {
                    reject('error')
                }
            }
            // true表示同步，false表示异步
            xhr.open('post', url, false)
            xhr.send()
        });
        return promise;
    }
}
```

