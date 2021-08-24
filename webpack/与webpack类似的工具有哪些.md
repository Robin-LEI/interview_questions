最早的是grunt

配置文件是gruntfile.js

缺点是配置项太多



然后发展到gulp

配置文件是gulpfile.js

基于任务流的构建工具

常用的四个方法，src、task、dest、pipe

缺点是处理异常麻烦，自己需要写各种处理规则



出现了webpack打包工具，优点是对模块化打包友好，缺点是打包后的文件体积大



rollup

适合打包类库，webpack适合打包项目，是一个JS模块打包器，优点是打包后的文件体积小，文件简洁，缺点是对代码拆分、静态资源支持不好



parcel

快速、零配置，没有配置文件

parcel内置了一个开发服务器，更改文件时自动重建你的应用程序，支持热更新，指定入口文件即可

缺点是不支持sourcemap、treeshaking

