devtool：用于调式代码，设置为false，则不生成sourcemap

的值有很多种组合

eval：把源代码通过eval包裹起来

source-map：产生一个 .map 文件

cheap：不包含列信息，也不包含 loader的source-map

module：包含loader的source-map

inline：将 .map 作为dataURL嵌入，不单独生成 .map 文件



开发中：eval-source-map，速度快，调试更好

生产：hidden-source-map，隐藏源代码，减少文件体积



**如何调试线上代码？**

webpack打包仍然需要生成sourcemap，但是将map文件放到本地服务器，将不包含map文件的其它文件部署到服务器。

devtool设置：hidden-source-map，生成单独的map文件，但是不在main.js中建立关联。

将map文件存在本地的开发服务器上，在生产项目页面打开控制台，右键，add source map，输入本地source-map地址，就可以调试了。



**调试test环境代码**

```js
// filemanager-webpack-plugin 文件管理器插件，可以精细化控制生成过程

// 此插件生成 sourcemap
new Webpack.sourceMapDevtoolPlugin({
    append, // 向输出文件添加映射文本
    filename
}),
// 将要发布test环境，生成sourcemap文件，但是此文件不会发到test环境，只会放在本地
new FileManagerPlugin({
    events: {
        onEnd: {
            copy: [
                source: './dist/**/*.map',
                destination: path.resolve(__dirname, 'maps')
            ],
        	delete: ['./dist/**/*.map']
        }
    }
})
```

