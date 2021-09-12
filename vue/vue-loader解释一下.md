1. 是webpack的一个插件
2. 是一个加载器，负责解析.vue文件为一个js模块，方便浏览器的读取
3. 主要是把vue文件的template、style、script三个部分分别提取出来，把他们分别交给对应的loader去处理，比如style一般交给css-loader处理，template交给vue-template-compiler处理