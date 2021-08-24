| loader         | 解决的问题                                                   |
| -------------- | ------------------------------------------------------------ |
| babel-loader   | 把ES6或者react转换成es5                                      |
| css-loader     | 加载css文件，支持模块化、压缩、文件导入，主要用来处理background: (url)和@import语法 |
| eslint-loader  | 检查JavaScript代码是否规范                                   |
| file-loader    | 把文件输出到一个文件夹中，在代码中通过相对URL去引用输出的文件 |
| url-loader     | 和file-loader类似，但是能在文件很小的情况下以base64的方式把文件内容注入到代码中去 |
| sass-loader    | 把scss文件编译成css                                          |
| postcss-loader | 给css样式添加兼容性前缀                                      |
| style-loader   | 把css注入到JavaScript中                                      |



| 插件                                | 解决问题                                                     |
| ----------------------------------- | ------------------------------------------------------------ |
| terser-webpack-plugin               | 使用terser压缩js                                             |
| case-sensitive-paths-webpack-plugin | 如果路径有误，直接报错                                       |
| html-webpack-plugin                 | 自动生成带有入口文件的index.html                             |
| optimize-css-assets-webpack-plugin  | 用于优化压缩css资源                                          |
| mini-css-extract-plugin             | 将css提取为独立的文件，对于一个包含css的js文件，可以把css抽离出来，支持按需加载 |
| interpolate-html-plugin             | 和html-webpack-plugin一起使用，支持在index.html中使用变量    |
| define-plugin                       | 创建一个在编译时可配置的全局常量                             |

