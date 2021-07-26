# vue2

1. new Vue发生了什么？

   > new Vue的时候，对Vue构造函数实例化，拿到用户传递进来的options进行初始化。
   >
   > new Vue的时候，先调用`init`方法进行初始化，init方法是Vue的原型方法，init方法先把用户传递进来的options绑定在vm实例对象上的$options属性上，因此$options上就有了用户传递进来的所有属性
   >
   > 然后调用`initState`方法，传入vm实例，进行状态的初始化
   >
   > 在initState中拿到用户的options，并且判断有没有传入data属性，如果传了调用`initData`进行数据的初始化
   >
   > initData方法，接收参数vm实例，在这个方法中需要对用户传递进来的data进行拦截，采用Object.defineProperty重新定义，通过vm.$options.data拿到用户绑定的data，这个data可能是函数也可能是一个对象，如果是函数，需要执行`data.call(vm)`后拿到返回结果
   >
   > 调用`observe(data)`观测数据
   >
   > 在observe方法中只对对象类型的数据进行观测，对非对象类型的数据不尽兴观测，也没法观测，这个函数返回一个Observer类的实例
   >
   > 在`Observer类`中，调用`walk`方法将对象中所有的key使用Object.defineProperty重新定义
   >
   > walk方法并没有直接对data进行观测，内部调用了`defineReactive`，在defineReactive中对data中的数据进行了定义，添加get、set方法，使其变成了响应式，在这个方法中对传入的参数data进行判断，如果data是一个对象，需要递归调用observe方法，这也就解释了为什么vue2中不建议数据嵌套过深，那样会影响性能，因为过深的嵌套会导致过多的递归调用，而递归调用本身是很消耗性能的。
   >
   > 注意，在`类Observer`中需要对参数进行判断，如果传入的数据是对象，那直接调用walk方法进行，如果是数组，则不采用Object.defineProperty这种方法进行，采取重写数组常用的七个方法的方式进行定义数组的数据响应式。
   >
   > 如果是数组，使用Object.setPropertyOf(value, arrayMethods)改写数组的原型，然后再调用`observeArray`方法，对数组中的对象进行调用observe方法进行拦截
   >
   > 对数组方法重写的时候需要注意，不能直接改写，因为只有在vue中使用的数组才需要变成响应式，那些不在vue中使用的数组仍然需要采用原始方法。
   >
   > `arrayMethods = Object.create(Array.property)`
   >
   > created 数据已经被劫持了，变成响应式了
   >
   > beforeMount 渲染之前
   >
   > mounted 调用render方法
   >
   > 钩子中的this指向的vm实例
   >
   > mixin数据的合并会导致数据的来源不明确，mixin是一个静态方法，一个全局API
   >
   > mergeOptions(this.options，mixin)的实现原理：// this.options存储的是全局配置
   >
   > 两个参数 parent，child，把child合并到parent上
   >
   > 合并普通数据：
   >
   > 如果父亲有的，儿子也有，那么儿子覆盖父亲
   >
   > 如果父亲有，儿子没有，那么用父亲的
   >
   > 遍历parent
   >
   > 都是对象，直接合并
   >
   > 遍历儿子
   >
   > 引申出合并对象？？
   >
   > 如果合并的是钩子，采用合并钩子的策略
   >
   > 把两个钩子变成一个数组结构
   >
   > 合并为数组后依次执行
   
   组件的合并策略
   
   Vue.component 可以声明组件
   
   内部使用一个 Vue.extend API,返回一个通过对象创建的一个类，通过这个类去创建组件去使用
   
   new Vue({
   
   ​	components: {} // 冲突时这里声明的组件优先，先查找自己身上是否存在，没有查找父亲的 \__proto__
   
   })
   
   
   
   Vue.extend = function() {
   
   ​	
   
   }
   
   
   
   组件的渲染原理
   
   需要对标签名做过滤，因为标签名有可能是自定义组件
   
   组件独有componentOptios和hook（存放组件的构造函数）
   
   vue是如何渲染的？
   
   > <hr>
   > **模板渲染**
   >
   > 1. 需要将模板变成一个render方法，render() { return _c('li', {}, name) } // <li>name</li>
   > 2. 需要去当前实例上取值（vm），这里采用with语法
   > 3. 得到虚拟dom，可以描述dom结构
   > 4. 生成一个真实dom，扔到页面中
   >
   > **模板编译原理**
   >
   > 如何表示html（ast语法树），再把html在转换成js语法
   >
   > <hr>
   >
   > 在执行vue初始化调用init方法的时候，判断用户有没有传入el，如果传入了el，表明数据可以挂载到页面上。
   >
   > 调用`$mount(vm.$options.el)`方法，在此方法里，首先需要解析模板得到render函数，获取模板的优先级：render > template > 外部模板，然后调用`compileToFunctions(template)`编译模板得到render函数，再把render绑定到options上。
   >
   > `compileToFunctions`方法：
   >
   > 解析template。例如：
   >
   > ```html
   > <div id="app">
   >     <div style="color:red;">
   >         <span>{{name}}</span>
   >     </div>
   > </div>
   > ```
   >
   > 调用parseHTML(template)，采用边解析边删除的策略。采用栈来记录节点的父节点，同时跟踪children，最终次方法返回一颗AST语法树，树中包含了如下节点：
   >
   > ```js
   > {
   >     tagName: '',
   >     attrs: [{ style: 'color: red;' }],
   >     type: 1, // nodeType
   >     parent: '',
   >     children: []
   > }
   > ```
   >
   > 调用`generate`函数，传入获取的ast语法树，获取到code，code的形式为
   >
   > ```js
   > _c('div', {style: 'color: red'}, _v('hello'))
   > ```
   >
   > 使用with包裹code，`with(this) {return code}`，得到render字符串，在使用new Function(render) 得到返回值fn，这个返回值fn就是render函数



2. Vue为什么不采用类而是采用构造函数

   > 采用构造函数，更有利于代码的扩展，使得代码编写更加清晰，如果我们想做一个初始化的操作，可以直接在Vue的prototype原型上扩展一个init方法
   >
   > 还可以拆分逻辑在不同的文件中，更有利于代码的维护，更好的体现模块化的概念
   >
   > 如果采用类使得大量代码堆积在一个文件中，不易维护
   >
   > class Vue {
   >
   > ​	init() {},
   >
   > ​	xxx() {}
   >
   > }

3. vue2中使用的options API和vue 3中使用的composition API有什么区别？

   > options API，意味着在每个`.vue`文件中，要想实现某个功能，需要在不同的配置项中编写代码，比如在data中定义变量，在computed中定义计算属性，在methods中编写方法，伴随着项目的复杂度增高，`.vue`文件代码量也不断增大，这时如果我们想要定位一个错误，不容易查找，需要在各个options中逐个排查
   >
   > composition API，把vue2中的options API进行了整合，实现某个功能把需要用到的各个模块都写在一个函数里，体现了高内聚、低耦合的特点，便于代码的开发和维护

4. 为什么vue中data函数可以拿到this，即vm实例对象

   > 在源码中`initData`中对data进行处理的时候，判断如果data是函数，则执行它，拿到返回结果，即`data.call(vm)`，这就把data内部的this绑定到vm身上了

5. 为什么数组不采用Object.defineProperty拦截？

   > 如果数组也采用这种方式进行拦截，当遇到一个数据量很大的数组的时候，非常浪费性能，因为需要递归遍历数组每一项，而用户通常使用的数组的时候很少会这样使用`arr[199] = xxx`，大部分会采用push、unshift、pop...等方法，所以只需要重写数组的这几个常用方法，同时添加更新操作即可。
   >
   > 对数组的七个方法进行拦截`pop、push、shift、unshift、splice、reverse、sort`，为什么不对`concat、slice、join、some、map、filter、every`这些方法进行拦截重写？因为这几个方法不会改变原数组，那七个方法会改变原数组。
   
6. nodeType有哪几种常用类型

   | nodeType | 含义     |
   | -------- | -------- |
   | 1        | 元素     |
   | 2        | 属性节点 |
   | 3        | 文本节点 |
   | 8        | 注释节点 |

   

7. with和eval区别

   ```js
   // with的使用
   function a() {
       with(this) { // 这里this就绑定到了{name: 'test'}
           console.log(name) // test
       }
   }
   a.call({name: 'test'})
   
   // eval 不干净的执行
   let a = 100
   eval(`console.log(a)`) // 100
   
   // 注意，在严格模式下，with和eval都不能使用
   ```
   
   
   
   vue2基于options api，在vue3中依然可用
   
   Vue2.0 采用的是构造函数，而不是类
   
   ```js
   class Vue {
       xxx() {},
       xxx() {},
       xxx() {}
   }
   
   Vue.prototype.xxx = function() {}
   // 如果采用类扩展方法，违背了原则，因为一方面使用类，一方面又采用原型扩展
   ```
   
   $options 表示用户传入的所有的options选项
   
   new Vue首先调用init进行初始化
   
   initState初始化状态，把数据定义在vm实例上，后续数据更新，进行视图更新，最重要的是初始化数据
   
   initData数据初始化，最重要的是进行数据劫持，采用Object.defineProperty
   
   data不是函数就得是一个对象，data = typeof data === 'function' ? data.call(vm) : data
   
   调用observe(data)观测数据，只是对data这个对象进行观测，采用Observer类的形式观测
   
   vm._data 获取到观测后的数据，采用代理使得用户可以通过vm实例直接访问到data数据
   
   ，内部主要采用Object.defineProperty完成
   
   vue2中对数组不是采用的是不同的方法，并没有进行直接拦截，重写了数组的七个方法（因为·这7个方法会改变原数组，pop、push、shift、unshift、reverse、splice、sort），当我们观测的数据是数组的时候，改变其原型链，指向我们自己定义的方法，为什么数组不采用和对象一样的拦截方法，当数组数据量过大的时候，性能不好，因为多次递归，递归产生栈。
   
   value.\__proto__ = arrayMethods
   
   等价于
   
   Object.setPropertyOf(value, arrayMethods)
   
   数组中的对象数据改变了也需要更新视图
   
   不管是数组还是对象，只要被观测过了，其自身都会携带一个\__ob__属性，这可以为我们解决循环引用的问题
   
   
   
   vue大的执行流程
   
   1. 把模板变成render方法
   2. 需要去当前实例取值
   3. 产生虚拟dom，用来描述dom结构
   4. 生成真实dom，扔到页面上
   
   
   
   ast语法树和虚拟dom区别
   
   
   
   模板编译的流程
   
   1. 判断用户是否传入el，如果传入el，则数据可挂载到页面上
   2. 看用户是否传入render函数，如果传入，优先使用
   3. 如果用户没有传render函数，看用户是否传入template，如果传入使用
   4. 如果没有传递，获取el的outeHTML作为模板
   5. 调用compileToFunctions传入template便以为render函数
   
   
   
   ast语法树，描述语法本身，也可以描述js、html、css等
   
   ```js
   {
       tag: 'div',
       type: 1, // nodeType
       attrs: [{style: 'color: red'}],
       children: []
   }
   ```
   
   模板解析是怎么解析的？
   
   调用parseHTML(template)，每解析一块，就删除一块
   
   同时根据开始标签、结束标签、文本内容生成一个ast语法树
   
   
   
   vue3支持多个根元素（只是在最外层包了一个空元素）
   
   模板解析完成，获取ast语法树之后，调用generate(ast)生成code
   
   使用with语法对code进行包装，`with(this) {return code}`，这样做的好处是函数内部的变量都会从传入的this上取值
   
   然后把这个包装后的字符串作为参数传入new Function（这个函数会根据传入的字符串创建函数），这样得到的函数就是render函数



在解析的过程中，遇到文本和普通元素的解析方式不一样，文本分为普通文本、混合文本、有{{}}的

render函数拿到之后，调用mountComponent(vm, el)进行组件挂载

默认vue通过watcher来进行渲染的，称之为渲染watcher，每一个组件都有一个渲染watcher

new Watcher内部会调用一个updateComponent方法，每一个watcher都有一个id，作为唯一标识，每new一次watcher，id就自增一次，该方法内部会执行 vm.\_update(vm.\_render()),vm.\_render()返回虚拟节点，vm.\_update根据虚拟节点渲染真实dom

vm.\_render方法内部会调用vm/$options.render方法，根据传入的vm实例，返回vnode

createElement创建元素的虚拟节点

createTextVnode创建文本的虚拟节点

上面这两个方法内部会调用vnode进行数据的包装



lifecycleMixin：更新逻辑

renderMixin：调用render方法逻辑



如何将虚拟节点变成真实节点？

vm.$el 保存的是真实的dom节点

调用vm.\_update传入vnode，生成真实的dom节点

内部调用patch(vm.$options.el, vnode)方法，首先渲染的时候需要用虚拟节点更新真实的dom元素

如何判断patch中的oldVNode参数是虚拟节点还是真实dom？

判断该参数是否存在 nodeType，存在则是真实dom，内部调用createElm传入vnode，根据虚拟节点创建真实dom，赋值到vnode.el上，还需要调用updateProperties更新属性，不是，则进行diff算法



每个组件都有一个watcher

new Vue的时候会产生一个渲染watcher

数据更新如何自动更新视图，而不是手动触发（调用vm.\_update(vm.\_render)）

依赖收集：属性取值的时候，需要记住这个watcher，稍后数据变了，去执行自己记住的watcher即可

只有data上的数据被模板使用了才需要记住watcher

把当前的watcher存放在一个Dep上（这是一个全局变量）

每个属性都有dep



vue的更新操作是异步的

多次更新同一个属性值需要做合并操作

vue更新原理：就是通过nextTick异步执行更新视图逻辑



数组的依赖收集？

如果对数组取值会将当前的watcher和数组进行关联，给数组增加dep属性，注意是给数组本身加dep而不是索引

里层和外层收集的都是同一个watcher



在created的时候，数据已经被劫持了

mounted的时候，调用render方法

vue中钩子函数里面的this指向vue的实例



Vue.mixin 内部主要是mergeOptions



组件的合并策略

Vue.component内部调用Vue.extend，传入一个对象，生成一个类，通过这个类去创建组件



组件的虚拟节点和普通元素的虚拟节点是有区别的，组件的虚拟节点带有hook和componentOptions属性



# diff算法

diff算法是平级比对，不会跨级比对

如果没有diff会多次创建真实dom，浪费性能，更新差异即可。

两个虚拟节点的比对：

1. 如果两个虚拟节点的标签不一样，直接替换掉结束，oldVnode.el.parentNode.replaceChild(createElm(vnode, oldVnode.el))

2. 标签一样，但是是两个文本元素，看内容是否一样，文本的tag名是undefined

3. 元素是相同的，复用老节点，比对；两个节点的属性值，分为以下情况

   - 老的有，新的没有，删除属性
   - 新的有，老的没有，直接用新的覆盖

4. 更新儿子，分为以下情况

   - 老的有儿子，新的有，dom-diff，调用updateChildren，利用双指针，也就是头尾各一个指针，注意这里比对的不是索引，是节点的比较

     ```js
     oldStartIndex = 0
     oldEndIndex = length - 1
     oldStartNode
     oldSEndNode
     
     newStartIndex = 0
     newEndIndex = length - 1
     newStartNode
     newEndNode
     
     ```
     
   - 老的有，新的无，innerHTML = ''
   
   - 老的无，新的有，appendChild

  while(oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
         // 两个指针重合的时候停止
  }
     
  // 常见的操作：尾部插入、头部插入、头移动到尾、尾移动到头、正序和反序
     

```js
 如何判断两个节点是同一节点？
 tag相同 && key相同
 
 向后插入：从头开始比
 向前插入：从尾开始比
 如何判断当前是向前插入还是向后插入？
 看一眼newEndIndex下一个是否有值，如果有向前插入，如果没有向后插入
 
 // insertBefore的第二个参数为null的时候，等价于appendChild
 
 为什么v-for要加key？为什么key不建议用索引？
 加key为了在做dom-diff的时候，减少不必要的创建dom，节省性能。因为在前端操作中，很多时候的时候，不一定要去创建新的dom，只是移动了顺序。
 比如用户的操作只是为了逆序输出，如果用索引做key，在做比对的时候，认为它们是相同的节点，此时复用老节点，内部调用patch比对children，如果不一样，这个时候会创建新的dom替换老的，如果不是用索引做key，用一个唯一值id做key，这个时候在比对的时候进行首尾比较，只是移动顺序，不做dom的创建。
```



```js
最恶心的情况：现在和以前的完全没关系
插入到olsStartIndex的前面
先处理老节点，得到一份映射表，key和index的映射表，传入key获取index
循环拿newStartVnode.key在映射表里面找，如果key在里面：需要两个虚拟节点比对，把老的节点设置为undefined，同时把老的节点移动
如果不在里面新的节点移动到oldStartVnode.el的前面
```



# vue打包工具采用rollup

1. rollup相比webpack的优点？

   > 打包结果比较清晰，体积小，更适合用于打包类库
   >
   > webpack更适合用于日常开发项目打包

###   rollup 简易版config配置

1. rollup的配置文件为`rollup.config.js`

2. rollup打包比较纯粹，需要和babel配合使用

3. 基础使用配置

   ```js
   import babel from 'rollup-plugin-babel'; // rollup和babel的桥梁
   import serve from 'rollup-plugin-serve'; // 启动webpack服务
   
   @babel/core // babel 核心模块
   @babel/preset-env // es6-es5
   
   export default {
       input: '包的入口点，必填参数，比如 main.js、index.js、app.js等',
       output: {
           file: '打包后输出到哪个路径，比如 dist/vue.js',
           format: '定义输出文件的类型，amd：异步模块定义，用于像requestJs这样的模块加载器，cjs：适用于commonJs，iife：一个自动执行的功能，适合在script中使用，只能在浏览器中使用，umd：通用模块定义，以amd、cjs、iife为一体',
           name: '打包后全局的名字，比如Vue',
           sourcemap: '便于定位错误，true|false'
       },
       plugins: {
           babel({
               exclude: '/node_modules/**'  // babel把es6转为es5，排除node_modules目录不做转化
           }),
           serve({
           	open: true, // 打包完成是否默认打开页面
           	openPage: '/public/index.html', // 打开什么页面
           	port: 3000,
           	contentBase: '.' // 把哪个目录变为服务根目录 . 表示当前目录
       	})
       }
   }
   ```

   



vue编码但是不渲染的标签，vue-fragment，`npm install -g vue-fragment`，使用，`<fragment></fragment>`



如何查看npm安装包的版本信息

- `npm view packageName versions`
- `npm info packageName`
- 查看npm源：`npm config get registry`



# vue-ssr

1. 什么是服务端渲染？

   > 通常，我们使用vue开发的单页面应用属于客户端渲染。
   >
   > 放在服务器进行的渲染就是服务端渲染，放在浏览器进行渲染的就是浏览器渲染，服务端渲染就是在服务器端让数据和模板进行结合，然后返回一个html字符串给浏览器，这样浏览器拿到字符串之后就可以直接进行渲染。

2. 为什么需要服务端渲染？

   > 客户端不利于SEO，因为默认html文件就是一个空的div标签，没有任何内容。
   >
   > 采用服务端渲染之后返回的内容是带有内容的，可以被爬虫爬取。
   >
   > 采用服务端渲染可以减少首页加载的白屏时间，因为SSR已经将HTML字符串返回给浏览器。
   >
   > 同时SSR也存在弊端，比如占用CPU和内存资源过多，一些常用的浏览器api可能无法使用，无法操作dom。
   >
   > 在vue中只支持beforeCreate和created两个生命周期。

3. 开启vue-ssr

   - 服务端采用nodejs，因为nodejs天生支持js
   - 【在没有采取模板渲染的情况下】服务端需要安装 vue-server-renderer vue，引入vue-server-renderer，调用其createRenderer函数，创建一个渲染函数，链式调用 renderToString，渲染出一个字符串，把这个字符串作为内容响应给浏览器。
   - 【采取模板渲染】配合webpack，可以让服务端开发变得更方便，可以像客户端开发一样，编写.vue文件，通过模板调用createRenderer创建渲染函数，把模板解析为字符串返回给客户端
   - 通过webpack实现编译vue项目，`npm install webpack webpack-cli vue vue-loader vue-style-loader css-loader webpack-dev-server @bable/core babel-loader @babel/preset-env html-webpack-plugin vue-template-compiler `
     - webpack-cli解析命令行参数的，比如 --config
     - vue-loader 解析.vue文件
     - vue-style-loader 用于服务端插入css，客户端使用的是style-loader，但是不支持服务端
     - vue-template-compiler 解析vue模板

4. 



1. vue是什么？它的特点？

   > - vue的核心库只关注视图层，vue框架是数据驱动视图，数据喝视图的变化是同步的，采用的架构是MVVM
   >
   > - vue可以自底向上逐层应用
   >
   >   > 从基层开始做起，把基础的东西写好，在逐渐的添加功能喝效果
   >
   > - vue是一个渐进式的框架
   >
   >   > 渐进式的意思是从少到多，从弱到强，vue并不强制开发者一下就使用它的全部
   >
   > - 声明式渲染
   >
   >   > vue.js的核心是一个允许采用简洁的模板语法来声明式的将数据渲染进dom的系统
   >   >
   >   > ```vue
   >   > <div id="app">
   >   >   {{ message }}
   >   > </div>
   >   > ```
   >   >
   >   > 
   >
   > - 采用组件化构建应用，在vue中，一个组件本质上就是一个vue实例
   >
   >   ```vue
   >   // 注册一个组件
   >   Vue.component('todo-item', {
   >     props: ['todo'], // 可以接收父组件传递过来的数据
   >     template: '<li>这是个待办项</li>'
   >   })
   >   ```
   >
   >   
   >
   > - 

2. vue实例

   > - 每一个应用都是通过用Vue函数创建一个新的Vue实例开始的
   > - 创建vue实例的时候，可以传入一个选项对象
   > - 所有的vue组件都是vue实例，并且接收相同的选项对象（一些根实例特有的选项除外）
   > - 当一个vue实例被创建的时候，它将data对象中的所有属性加入到vue的响应式系统中，当这些属性的值发生改变的时候，视图将会产生响应，，即匹配更新为新的值。注意，不在data中的数据不是响应式的，比如通过vm新增的。
   > - 对于采用`Object.freeze`冻结的属性即使存在于data中，也不会被vue的响应式系统追踪变化。

3. 生命周期钩子

   > - 每一个vue实例在被创建的时候都需要经过一系列的初始化过程，比如需要设置数据监听、编译模板、将实例挂载到dom并且在数据变化的时候更新dom等，同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己代码的机会。
   > - 生命周期钩子中的this指向的是调用它的vue实例，需要注意的是，钩子不要使用箭头函数去定义，因为箭头函数本身没有this，this作为一个变量一直向上级的词法作用域去查找。
   > - beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed

4. vue从2.6.0开始支持动态参数

   ```js
   <a v-bind:[attributeName]="url"> ... </a>
   ```

   

5. 修饰符

   ```js
   // .lazy
   <input v-modal.lazy="input_lazy" />
   // 这样当焦点没有从输入框失去的时候，不会更新input_lazy的值，只有当失去焦点的时候，才会更新数据
       
   // .number
   <input v-modal.number="input_number" /> 
   // 自动将数据的内容转为数值
   
   // .trim
   <input v-modal.trim="input_trim" /> 
   // 自动将数据框的前后空格给去除
       
   // 以上三个属于v-model的修饰符
       
   // 以下几个属于事件修饰符
   
   // .stop
   var vm = new Vue({
      el: "#app",
      methods: {
        div_click: function () {
          console.log("div click...");
        },
        stop_click: function () {
          console.log("stop_click...");
        }
      }
    });
    <div class="row">
      <h2>v-on.stop</h2>
      <div @click="div_click">
        <button type="button" @click.stop="stop_click">StopPropagation</button>
      </div>
      <hr />
    </div>
   // 该修饰符阻止事件向上冒泡，内部相当于调用了stopPropagation()，这样当触发stop_click事件的时候，就不会触发div_click事件
   
   // .prevent，相当于调用preventDefault()
    <div class="row">
      <h2>v-on.prevent</h2>
      <form @submit.prevent="form_submit">
        <button type="submit">Submit</button>
      </form>
      <hr />
    </div>
   // 阻止事件默认行为
   
   // .self
    <div class="row">
      <h2>v-on.self</h2>
      <div @click.self="div_click" style="display:inline-block; width: px; background-color:red;">
        <button type="button" @click="stop_click">Button</button>
      </div>
      <hr />
    </div>
   // 只有当事件在自己元素本身上点击才会触发回调
   
   // .one
   // 表示绑定的事件只会触发一次，也就是说多次点击，只会在第一次点击的时候触发
   
   // 键盘修饰符可以自定义
   Vue.config.keyCodes.ent = 13; // 值13是键盘上enter键的keyCode
   <input type="text" @keyup.ent="enter_click"/>
   // 上面这种写法等价于下面
   <input type="text" @keyup.enter="enter_click"/>
   ```

   

6. 

