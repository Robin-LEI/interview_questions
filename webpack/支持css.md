css-loader：用来翻译 @import和url() 语法

style-loader：用于把css插入到dom中



loader的使用是有顺序的，从下到上，从右到左。

loader有一个单一原则，每一个loader只做一件事情。



less-loader：解析less语法，变成css



sass-loader：解析scss语法，把scss转成css



use loader的顺序：

最右边的接受源文件，最左边的输出一个js脚本。



CSS兼容性

默认给css添加兼容性前缀，借助postcss-loader，postcss.config.js 配置兼容到哪些版本的浏览器

```js
let postCssPresetEnv = require('postcss-preset-env')
module.exports = {
    plugins: [
        postCssPresetEnv({
            browsers: 'lst 5 versions'
        })
    ]
}
```



can i use 可以查询属性的兼容程度。