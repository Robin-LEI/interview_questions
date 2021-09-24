入口 entry

默认值是 ./src/index.js，可以修改。



配置文件：webpack.config.js



输出 output，打包后放在哪里

{

​	path,

​	filename

}



webpack只能理解js和json文件，其它格式的文件不识别，需要借助各种loader解析。

example：

module: {

​	rules: [

​		{test: /\.\css$/, use: ['style-loader']}

​	]

}



插件：范围更广，功能更加强大，比如资源优化等。

html-webpack-plugin



npm run build怎么执行的，例如：

```js
scripts: {
    build: "webpack"
}
```

1. 执行shell脚本 webpack
2. 先去node_modules\\.bin\\webpack.cmd
3. 如果找不到，找全局的命令【npm root -g】
4. 如果还找不到，找系统环境变量中的path