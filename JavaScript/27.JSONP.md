jsonp是一种跨域解决方案，利用script的src标签可以跨域加载资源的原理。

实现步骤：

1. 前端准备一个函数，用来接受服务器响应的数据
2. 客户端动态创建script脚本，设置src为请求的服务端接口地址
3. 插入script标签到head中
4. 移除head中的script标签



缺点是只能用于get请求，动态插入的script标签可能被注入恶意代码。



借助promise封装一个JSONP

```js
function myJsonP(param = {}) {
    return new Promise((resolve, reject) => {
        let {data, url, cbname} = param;
        window.getData = function(res) {
            resolve(res);
        }
        
        function parseData() {
            let str = '';
            for (let key in data) {
                str += key + '=' + encodeURIComponent(data[key]) + '&'
            }
            return str.substr(0, str.length - 1);
        }
        
        url = `${url}?callback=getData&${parseData()}`
        
        let script = document.createElement('script')
        script.src = url
        document.head.appendChild(script)
		document.head.removeChild(script)
    })
}

myJsonP({
    url: 'https://www.baidu.com/product',
    data: {
        name: 'xiaoming',
        age: 18
    }
}).then(res => {
    console.log(res)
})
```

