每一个loader可以有一个pitch方法，

loader是一个函数，接受source源文件参数。

loader-runner：loader的执行器，



loader本身没有类型。



loader的执行顺序是 从右到左、从下到上。

配置loader顺序可以通过 enforce 字段。

enforce有三个值，分别是 pre、post、normal

其中 normal 是默认值，执行顺序是 pre、normal、post

还有一个特殊的 行内 loader，inline-loader，不能通过enforce指定，在引入文件时候进行配置，

顺序是 pre、normal、inline、post



最左侧的loader必须要返回一个js脚本，因为这个结果要给到webpack，而webpack会把这个结果用ast parser按js解析



# babel-loader实现

如何让webpack中的loader不从node_modules下面找，加载我们自己写的loader

```js
// webpack.config.js
module.exports = {
    resolveLoader: {
        alias: {
            'babel-loader': path.resolve(__dirname, 'loaders/babel-loader.js')
        }
    }
    // 或者
    modules: [path.resolve('loaders'), "node_modules"]
}
// 借助 loader-utils 可以获取到我们loader的 options 参数
```



# file-loader

```js

// webpack如何加载一个图片
// 1. 生成一个文件名
// 2. 向输出目录，比如 dist 目录写入一个文件
// 3. 返回一段模块化的js脚本，js脚本会导出这个新的路径文件名

// 借助 loader-utils 的 getOptions方法获取loader的参数
// 借助 loader-utils 的 interpolateName方法根据loader上下文对象，options.name，source获取一个唯一的文件名 url
// 调用 emitFile 方法传入 url 和 content 向输出目录写入文件
// 设置 loader.raw = true 
设置loader.raw = true 
默认情况下，webpack传给loader的的是一个字符串，设置为true之后，告诉webpack不要把源文件内容给我转成字符串，保留buff就可以了

function loader(content) {
    
}
```



# less-loader

```js
引入 less
调用 less.loader 传入source 编译less文件
在回调函数中 调用 callback 传入解析后的 css

let less = require('less');
function loader(source) {
    let callback = this.async();
    less.render(source, { filename: this.resource }, (err, output) => {
        callback(err, output.css);
    });
}
module.exports = loader;
```





# style-loader

```js
创建一个 style 标签
把source源文件插入style的innerHTML中
把style标签插入到head中

function loader(source) {
    let script=(`
      let style = document.createElement("style");
      style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style);
    module.exports = "";
    `);
    return script;
} 
module.exports = loader;
```

