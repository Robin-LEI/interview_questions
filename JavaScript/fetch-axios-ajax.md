**fctch**

是浏览器提供的一个比ajax更底层的api。

优点：

1. 语法简洁
2. 默认支持promise，支持async / await
3. 更底层，效率也更高，支持丰富的api

缺点：

1. 不能终止请求，axios、ajax可以
2. 无法检测进度条，比如上传文件的时候，不友好，ajax、axios可以
3. 默认不携带cookie，ajax、axios会
4. 只对网络请求报错，不会对400、500状态码报错，不走reject，但是ajax、axios会报错



**axios**

axios是社区封装的一个组件。

优点：

1. 基于promise
2. 基于XHR的封装
3. 支持取消请求
4. 支持服务端发送请求，nodejs
5. axios.all 支持并发请求接口
6. 可以拦截请求和响应



**ajax**

ajax基于 XMLHttpRequest



**取消请求的方式**

1. fetch不支持
2. ajax的XMLHttpRequest实例对象上存在一个abort方法
3. $.ajax 返回的实例对象上存在一个abort方法
4. axios有一个cancelToken 方法