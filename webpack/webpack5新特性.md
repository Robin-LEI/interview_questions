1. 新增资源模块

   替换了原有的raw-loader、url-loader、file-loader，分别采用 asset/source，asset/inline 导出一个资源的 data URI，asset/resource 向输出目录拷贝文件

2. moduleIds和chunkIds命名优化，不再是1 2 3 这种自然序列命名，模块只要不改 id就不会改变，命名优化后对缓存更友好

3. webpack5移除了nodejs核心模块的polyfill自动引入，如果用到，需要手动引入，webpack会报错提示你安装

   - polyfill：抹平浏览器差异、抹平环境的差异、环境里缺啥补啥
   - webpack5开始不在自动填充polyfill，会专注于前端模块兼容，node模块也不属于前端模块，所以之后不会为nodejs模块引入polyfill了，尽量使用前端兼容的模块，比如axios，既可以在前端使用也可以在后端使用

4. 更强大的 tree-shaking

   - tree-shaking原理：webpack4本身的tree-shaking比较简单，主要找一个 import 进来的变量是否在这个模块使用过
   - webpack5可以根据作用域之间的关系进行优化，比如有两个文件 module1.js和module2.js，module1中有两个方法，module2中有两个方法，在index.js中只引入了module1中的某个方法，那么其它没有被用到的方法会被tree-shaking

5. 副作用，package.json中设置 sideEffects: false; 告诉webpack我这个项目中没有副作用，凡是没有使用的语句全部删除，但是你需要确保你的项目的确没有副作用。

   ```json
   {
   	"sideEffects": ["*.css"] // 如果是css文件不要帮我tree-shaking，白名单
   }
   ```

   





