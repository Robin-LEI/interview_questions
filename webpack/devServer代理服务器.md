```js
module.exports = {
    // 监视，实时编译，默认值是false
    watch: true,
    watchOptions: {
        ignored: /node_modules/,
        aggregateTimeout: 300, // 防抖 300ms内没修改 执行
        poll: 1000 // 轮训次数 原理是轮训
    }
}
```



```js
devServer: {
    port,
    open,
    compress,
    static,
    proxy: {
        // 如果 请求的api带 /api 则会转发到 http://lcoalhost:3000
        '/api': 'http://lcoalhost:3000'，
        pathRewrite: {
            '^/api': ''
        }
    },
    onBeforeSetupMiddleware(devServer) { // express
        devServer.app.get('/api/user', (req, res) => {
            res.json([{}])
        })
	}
}
```



**webpack-dev-server和webpack-dev-middleware区别？**

webpack-dev-server：是一个http服务器，用express实现，如果你什么都没有，建议用这个

webpack-dev-middleware：如果已经有一个现成的express项目，需要继承webpack进去，建议使用这个