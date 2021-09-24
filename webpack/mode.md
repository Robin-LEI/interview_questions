none|development|production

webpack4.x 引入mode概念



development：

1. 不会压缩代码
2. 用于开发
3. 会打印详细的日志信息



production：

1. 会压缩代码
2. 用于线上
3. 不会打印详细的日志信息
4. 默认是production



区分环境

--mode，设置的是 process.env.NODE_ENV，命令里面的--mode优先级高于webpack配置文件中的mode选项。mode在node环境中（webpack配置脚本中）不可用，在模块内可用。

--env，设置的webpack配置文件的函数参数，process.env.NODE_ENV 取不到，模块内也读不到，只能在配置文件的参数中取到

cross-env，设置node环境的 process.env.NODE_ENV，cross-env NODE_ENV=xx webpack，兼容linux、window系统，设置的是真正的操作系统的环境变量，只有node环境的process.env.NODE_ENV可以取到。

new webpack.DefinePlugin({xx: JSON.stringify('yyy')})，设置模块内的全局变量