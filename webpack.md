
# 基础配置
1. webpack5现在已经支持0配置了

2. loader可以把任何类型的文件转为js文件

3. 写一个vscode插件，移除console.log

4. 内存也是有目录的，内存文件系统

5. style-loader把css转为js的

6. less-loader把less转为css，npm install less less-loader -D

7. sass-loader把scss转为css，npm install node-sass sass-loader -D

8. webpack引入图片的几种方式

   - import、require，但是这里需要注意，引入之后使用的时候如果没有配置 esModule：false，使用的时候，需要加上.default
   - 放在静态文件目录下面，在html文件中直接使用，需要在webpack.config.js中配置 contentBase('static')
   - 在css中，通过url引入，需要安装url-loader解析

9. 正确解析图片，需要安装 file-loader、url-loader、html-loader

   - file-loader把static下面的图片资源移动到dist目录下面
   - url-loader内部存在file-loader的功能，但是是file-loader的增强版，可以配置当图片大小没有超过指定大小时，输出base64
   - html-loader会把html中写的相对路径做解析

10. mode

    - development

      > 开发时使用，不进行代码压缩，包含sourcemap信息，便于调式
      >
      > 会将 `process.env.NODE_ENV` 的值设置为development
      >
      > | 选项        | 描述                                                         |
      > | ----------- | ------------------------------------------------------------ |
      > | development | 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin |
      >
      > 

    - production

      > 压缩代码图片，不含有sourcemap
      >
      > 会将 `process.env.NODE_ENV` 的值设置为production
      >
      > | 选项       | 描述                                                         |
      > | ---------- | ------------------------------------------------------------ |
      > | production | 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin |
      >
      > 

11. entry

    > 默认入口是 `./src/index.js`

12. output

    > 输出，默认是 `./dist/main.js`
    >
    > ```js
    > output: {
    > 	path: path.resolve(__dirname, 'dist'),
    > 	filename: 'main.js',
    >     // 当你把打包的文件写入到index.html中时，src如何写的？
    >     // publicPath + filename 为 /assets/main.js
    >     publicPath: '/assets'
    > }
    > ```

13. loader

    > webpack为什么需要各种loader
    >
    > 因为webpack只能理解json和js文件
    >
    > 通过loader的解析，可以让一些其它类型的文件解析为js文件，供webpack识别
    >
    > ```js
    > // demo
    > module: {
    >     rules: [
    >         {
    >             test: /\.txt/, use: 'raw-loader'
    >         }
    >     ]
    > }
    > ```
    >
    > 

14. raw-loader

    > 可以帮助我们将文件作为字符串导入

15. plugin

    > 为什么需要插件？
    >
    > loader可以帮助我们转换其它类型的模块
    >
    > 插件可以使得我们的执行范围变得更广，包括：打包优化、资源管理、注入环境变量
    >
    > ```js
    > // demo
    > import HtmlWebpackPlugin from 'html-webpack-plugin'
    > plugins: [
    >     new HtmlWebpackPlugin({
    >         template: './public/index.html'
    >     })
    > ]
    > ```
    >
    > 

16. devServer

    > 在本地开启一个服务，利于开发
    >
    > ```js
    > devServer: {
    >     contentBase: '', // 把某一个目录变为静态文件根目录，默认情况下，devServer会优先读取输出目录dist，找不到会找contentBase设置的静态目录
    >     port: 3000,
    >     open: true,
    >     publicPath: '/', // 默认为 /
    >     compress: true, // 是否开启压缩 gzip
    >     writeToDisk: true // 如果指定次选项，在打包的时候，会打包一份进入硬盘中，默认打包的时候只会进内存（为了提升性能），写入硬盘可以利于我们调式错误
    > }
    > ```
    >
    > 

17. resolve和join的区别

    > 都属于path模块
    >
    > resolve('a', 'b') 会拼接出一个绝对路径
    >
    > join('a', 'b') 只是做一个简单的连接 a/b

18. babel-loader、babel-core、babel-preset-env

    > babel-loader本身不知道怎么把高级语法转为es5
    >
    > 但是babel-core知道，babel-loader是一个函数，他的作用就是调用babel-core
    >
    > babel-core可以把高级语法转为ast语法树，比如把es6语法转为es6语法树
    >
    > 然后交由preset-env把es6语法树转为es5的语法树
    >
    > 然后把这颗es5语法树交给babel-core解析生成es5代码

19. 预设和插件的区别

    > 预设是插件的集合

20. JS的兼容性处理

    > 利用babel
    >
    > - babel-loader使用babel和webpack一起编译JavaScript文件
    > - @babel/core babel编译的核心包
    > - babel-preset-env
    > - @babel/preset-react 转换react代码
    > - @babel/plugin-proposal-decorators 把类和对象装饰器编译为es5
    > - @babel/plugin-proposal-class-properties 转换类的静态属性
    >
    > ```js
    > npm i babel-loader @babel/core @babel/preset-env @babel/preset-react  -D
    > npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D
    > ```
    >
    > 

21. 





# 安装

`npm install webpack webpack-cli --save-dev`



# 基础配置1

```js
// webpack.config.js
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: '',
        filename: 'main.js'
    },
    devServer: {
      port: 3000,
      contentBase: '',
      publicPath: '/',
      open: true,
      compress: true,
      writeToDisk: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets:[
                                '@babel/preset-env', // 转换js语法
                                '@babel/preset-react' // 转换react语法
                            ],
                            // 既然预设是插件的集合，为什么这两个插件不包括在预设中，因为不常用
                            plugins: [
                                '@babel/plugin-proposal-decorators',
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    }
                ]
            }，
            {
                test: /\.txt/,
                use: 'raw-loader'
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less/,
                use: ['style-loader', 'css-loader', 'less-loader'] // 从左到右执行
            },
            {
                test: /\.scss/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|jpeg|bmp|gif)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[hash:10].[ext]',
                            esModule: false,
                            limit: 8 * 1024 // 小于8k的图片，解析为base64
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
}
```



# webpack5和webpack4的区别

1. 开启本地服务的命令不一样了，webpack4执行的是 webpack-dev-server，webpack5执行的是 webpack serve