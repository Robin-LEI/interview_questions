webpack的导出文件是一个匿名自执行函数。

内部包括 webpack_modules 对象，一个闭包webpack_require函数，一个缓存对象 webpack_module_cache。

webpack_modules对象存放导出的模块定义，key是导出文件所在的路径+文件名，值是一个函数定义；

webpack_require函数用来根据模块key来加载模块的，并且返回导出结果，同时把结果放入缓存中，下次再来取的时候，直接从缓存中拿；

