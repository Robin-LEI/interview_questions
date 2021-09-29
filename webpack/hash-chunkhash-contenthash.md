webpack中对输出文件命名可以采用hash、contenthash、chunkhash。

hash：

hash值的生成和整个项目有关系，只要项目中的任何一个文件内容发生了变化，hash值就会变化。



chunkhash：

每一个入口就是一个chunk，每一个chunk对应一个hash，只有某个入口对应的代码块改变了，才会引起chunkhash的改变，而且不会影响到另外一个入口对应的chunkhash值。



contenthash：

使用chunkhash存在一个问题，当在一个js中引入一个css文件，编译后他们的hash是相同的，而且只要js发生改变，css的hash也会引起改变，即使css的内容并没有修改，配置min-css-extract-plugin中的contenthash可以解析这个问题，只要css没有改变，就不会重新构建。



[参考资料](https://newsn.net/say/webpack-public-path.html)