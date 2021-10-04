1. alias：配置别名，可以加快webpack查找模块的速度

   ```js
   const bootstrap = path.resolve(__dirname,'node_modules/bootstrap/dist/css/bootstrap.css')
   resolve: {
   +    alias:{
   +        bootstrap
   +    }
   }
   // 这样做的好处是 不用每次 引入bootstrap，都从node_modules引入
   ```

2. 缩小匹配后缀名的范围，extensions，不用在使用require或者import的时候加入文件扩展名，会依次尝试添加扩展名进行匹配

   ```js
   resolve: {
     extensions: [".js",".jsx",".json",".css"]
   }
   ```

3. 配置noParse属性，配置哪些模块的文件内容不需要解析

   ```js
   import jq from 'jquery'
   // 当解析jq的时候，会去解析jq这个库是否有依赖其它的包，但是我们知道，jquery这个库没有依赖其它包，所以可以不用去解析，节省时间，提高解析效率
   ```

4. 压缩css，使用 purgecss 删除没有使用的css代码

5. IgnorePlugin，webpack内置插件，忽略第三方包指定目录，让这些目录不要被打包进去

6. thread-loader，采用多进程处理，把这个loader放在其它loader之前，放在这个loader之后的其它loader就会单独在一个worker 池中运行

7. CDN，为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上

8. 配置webpack，开启 tree-shaking，那些没有导入，或者没有使用到的方法函数变量等都会被删除，不会被打包

   - mode改为production
   - devtool设置为false
   - 在.babelrc文件设置module为 false





# 费时分析：每个阶段花费多少时间

这样可以针对性的优化

采用插件，`speed-measure-webpack-plugin`

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```



# 生成代码分析报告

采用插件 `webpack-bundle-analyzer`