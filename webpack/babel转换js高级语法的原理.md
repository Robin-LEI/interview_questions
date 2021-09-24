借助babel-loader处理js的高级语法。



```js
{
    loader: 'babel-loader',
    options: {
        presets: [
            "@babel/preset-env","@babel/preset-react"
        ],
        plugins: [
            ["@babel/plugin-proposal-decorators", {legacy: true}],
            ["@babel/plugin-proposal-class-properties", {loose: true}]
        ]
    }
}
```



**babel转换js高级语法的原理：**

1. babel-loader本身不知道怎么把高级语法转为es5
2. 但是babel-core知道，babel-core是一个函数，babel-loader的作用就是调用babel-core这个函数
3. babel-core可以把高级语法转为ast语法树，比如把es6语法转为es6语法树
4. 然后交给preset/env处理，预设是插件的集合，内置了很多个插件，会把es6的语法树转为es5的语法树
5. 最后把转化好的es5语法树交给babel-core解析生成es5代码