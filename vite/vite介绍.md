

用过vite吗？

> 了解过，自己写过，公司项目目前没用过

你认为webpack和vite最大的区别是什么？

> ① 冷启动时，vite速度快于webpack
>
> 因为webpack在启动一个项目的时候，会先进行找到入口、找模块依赖、编译，打包，最终把输出结果交给服务器。
>
> 但是vite是直接启动一个开发服务器，请求哪个模块在对这个模块进行实时编译。
>
> ②在热更新方面，vite的速度也是要快于webpack的
>
> 对vite而言，当改动一个模块后，仅仅需要让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。

你会从webpack转到vite吗？

> 等到后面vite的生态相对成熟丰富之后，会考虑。



特点：

1. 冷启动速度快
2. 文件很多，热更新速度快
3. 通用的脚手架，并不是只支持 vue



配置文件

vite.config.js

```js
vite 开发
vite build 构建
vite preview 预览
```

npm init @vitejs/app name --template vue



当冷启动开发服务器时，基于打包器的方式是在提供服务之前去急切地抓取和构建你的应用。

vite只需要在浏览器请求源码的时候进行转换并按需提供源码，根据情景动态导入的代码，只需要在当前屏幕上实际使用的时候才会被处理。



![](https://vitejs.cn/assets/bundler.37740380.png)

如果改了其中的某一个模块，webpack会重新打包的

![](https://vitejs.cn/assets/esm.3070012d.png)



type='module'



vite在开发环境不打包，那么产生这么多零散的文件会不会对浏览器产生阻塞呢？

不会，http2 多路复用

裸模块地址重写，不是裸模块，直接返回结果

import xx from 'vue'

import xx from '/@modules/vue'

如果 请求url 以 /@modules/ 开头，需要去node_modules查找

1. 拿到裸模块名称
2. 根据这个名称去node_modules目录查找
3. 从对应的包下的package.json中查找module字段对应的值
4. 返回处理结果



处理 sfc 请求

读取vue文件，解析为js，主要经过代码生成，模板编译