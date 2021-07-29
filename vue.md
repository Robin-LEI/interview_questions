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

   

6. 计算属性

   > 计算属性具备缓存
   >
   > 基于它们的响应式依赖进行缓存的，只有相关依赖发生改变的时候，才会重新计算值。
   >
   > 计算属性可以依赖其它计算属性，计算属性不仅可以依赖当前vue实例数据，也可以依赖其它实例的数据。

   > 为什么计算属性需要缓存？
   >
   > 假设我们有一个性能开销比较大的计算属性A，它需要遍历一个巨大的数组并做大量的计算，然后我们可能有其它的计算属性依赖于A，如果没有缓存，我们将不可避免的多次执行A的getter，造成性能的浪费，如果不希望有缓存，可以使用方法替代。

   > 计算属性默认只有getter，在需要的时候可以提供一个setter
   >
   > ```js
   > computed: {
   >   fullName: {
   >     // getter
   >     get: function () {
   >       return this.firstName + ' ' + this.lastName
   >     },
   >     // setter
   >     set: function (newValue) {
   >       var names = newValue.split(' ')
   >       this.firstName = names[0]
   >       this.lastName = names[names.length - 1]
   >     }
   >   }
   > }
   > // 现在再运行 vm.fullName = 'John Doe' 时，setter 会被调用，vm.firstName 和 vm.lastName 也会相应地被更新。
   > ```
   >
   > 

7. 绑定class

   ```vue
   // active 这个class存在与否，取决于isActive是否为true
   <div v-bind:class="{ active: isActive }"></div>
   
   // 绑定的数据对象不必内联定义在模板里，即采用下面这种写法
   <div v-bind:class="classObject"></div>
   data: {
     classObject: {
       active: true,
       'text-danger': false
     }
   }
   
   // 也可以绑定一个返回对象的计算属性
   <div v-bind:class="classObject"></div>
   data: {
     isActive: true,
     error: null
   },
   computed: {
     classObject: function () {
       return {
         active: this.isActive && !this.error,
         'text-danger': this.error && this.error.type === 'fatal'
       }
     }
   }
   
   // 采用数组的语法
   <div v-bind:class="[activeClass, errorClass]"></div>
   data: {
     activeClass: 'active',
     errorClass: 'text-danger'
   }
   
   // 数组中增加条件判断，下面这种写法将始终添加errorClass，但是只有在isActive为真的时候，才会有activeClass类名
   <div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
   
   // class也可以用在组件上，当在一个自定义组件上使用calss属性时，这些class将被添加到该组件的根元素上面，这个元素上已经存在的class不会被覆盖
   Vue.component('my-component', {
     template: '<p class="foo bar">Hi</p>'
   })
   // 然后在使用它的时候添加一些 class：
   <my-component class="baz boo"></my-component>
   // HTML 将被渲染为：
   <p class="foo bar baz boo">Hi</p>
   ```

   

8. style绑定

   ```vue
   // 对象语法
   <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
   data: {
     activeColor: 'red',
     fontSize: 30
   }
   
   // 直接绑定一个样式对象，注意，对象语法常常结合返回对象的计算属性使用
   <div v-bind:style="styleObject"></div>
   data: {
     styleObject: {
       color: 'red',
       fontSize: '13px'
     }
   }
   
   // 数组语法，可以将多个样式对象应用到同一个元素上
   <div v-bind:style="[baseStyles, overridingStyles]"></div>
   
   // 当v-bind:style使用需要添加浏览器前缀的css属性时，比如transform，vuejs会自动侦测并添加相应的前缀。
   
   // 从2.3.0开始可以为style绑定中的属性提供一个包含多个值的数组，常用语提供多钱带前缀的值
   <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
   // 这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 display: flex。
   ```

   

9. v-if和v-show

   > - v-if是“真正”的条件渲染，因为它会在切换的过程中把条件块内的事件监听器和子组件适当的销毁和重建
   > - v-if也是惰性的，如果初始渲染条件为假，则什么也不做，一直到条件第一次变为真的时候，才会开始渲染条件块
   > - v-show不管初始条件是什么，元素总是会被渲染，并且只是简单的基于css进行切换
   > - 一般来说，v-if有更高的切换开销，v-show有更高的初始渲染开销。因此，如果需要频繁的切换，使用v-show更好，如果在运行的时候，条件很少改变，使用v-if更好
   > - 带有v-show的元素始终会被渲染并保留在dom中，v-show只是简单的切换元素的css属性display，注意，v-show不支持<template>元素，也不支持v-else

10. v-if和v-for为什么不推荐在一起使用

    > 不推荐同时使用v-if和v-for
    >
    > 当二者一起使用时，v-for具有比v-if更高的优先级，意味着v-if将分别重复的运行于每个v-for循环中。

11. 组件

    ```js
    // 组件是可复用的vue实例，组件定义好之后，可以作为自定义元素来使用
    // 因为组件是可复用的vue实例，所以它们与new vue接受相同的选项，例如data、computed、watch、methods以及生命周期钩子等。仅有的例外是el这样只有根实例特有的选项除外。
    
    // 组件可以被复用
    // 每使用一次组件，就会有一个它的新实例被创建，每个组件会维护自己各自的数据
    
    // 组件的注册分为全局注册和局部注册
    // Vue.component属于全局注册，也就是说它们在注册之后可以用在任何新创建的Vue根实例（new Vue）的模板中
    
    // 全局注册往往是不够理想的，比如，如果你使用webpack这种构建工具，全局注册所有的组件意味着即使你不在使用一个组件了，它仍然会被包含在你最终的构建结果中，这就造成了用户下载的JavaScript的无谓增加。
    
    // 局部注册的组件
    var ComponentA = { /* ... */ }
    var ComponentB = { /* ... */ }
    // 然后在 components 选项中定义你想要使用的组件：
    new Vue({
      el: '#app',
      components: {
        'component-a': ComponentA,
        'component-b': ComponentB
      }
    })
    // 注意，局部注册的组件在其子组件中不可用，.vue文件也是局部组件
    import ComponentA from './ComponentA.vue'
    export default {
      components: {
        ComponentA
      },
      // ...
    }
    
    // 可以有动态组件
    <!-- 组件会在 `currentTabComponent` 改变时改变 -->
    <component v-bind:is="currentTabComponent"></component>
    ```

    

12. data必须是一个函数

    > 一个组件的data选项必须是一个函数，因此每个实例可以维护一份被返回对象的独立的拷贝
    >
    > 如果没有这条规则，在一个组件中修改了数据，其它依赖这个数据的组件也会发生改变。

13. prop

    > - prop的传递遵循单向数据流，也就是说父级prop的更新会向下流动到子组件中，但是反过来则不行，这样可以防止子组件意外的改变父组件的状态
    > - 注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身**将会**影响到父组件的状态。
    >
    > ```js
    > // props验证
    > // 带有默认值的对象
    > propE: {
    >     type: Object,
    >     // 对象或数组默认值必须从一个工厂函数获取
    >     default: function () {
    >     	return { message: 'hello' }
    >     }
    > }
    > 
    > // 自定义验证函数
    > propF: {
    >     validator: function (value) {
    >         // 这个值必须匹配下列字符串中的一个
    >         return ['success', 'warning', 'danger'].indexOf(value) !== -1
    >     }
    > }
    > ```
    >
    > - 禁用属性继承：inheritAttrs: false

14. 自定义组件的v-model

    - 一个组件上的v-model默认会利用名为value的属性和名为input的事件
    - model选项可以修改默认的value属性和input事件

    ```js
    Vue.component('base-checkbox', {
      model: {
        prop: 'checked',
        event: 'change'
      },
      props: {
        checked: Boolean
      },
      template: `
        <input
          type="checkbox"
          v-bind:checked="checked"
          v-on:change="$emit('change', $event.target.checked)"
        >
      `
    })
    
    // 使用
    <base-checkbox v-model="lovingVue"></base-checkbox>
    // lovingVue的值会传递给checked，当change事件触发的时候，lovingValue的值也会更新
    ```

    

15. .async修饰符

    ```js
    // 是update:myPropName语法糖
    
    // 父组件
    <template>
    <div>
      <text-comp :title="doc.title" v-on:update:title="doc.title=$event"></text-comp>
    </div>
    </template>
    
    <script>
    import textComp from './text-comp.vue'
    export default {
      components: {
        textComp
      },
      data() {
        return {
          doc: {
            title: 'hello world'
          }
        }
      },
    }
    </script>
    
    // 子组件
    <template>
      <div>
        <h1>{{title}}</h1>
        <button @click="$emit('update:title', 'hello 666')">update title</button>
      </div>
    </template>
    
    <script>
    export default {
      props: {
        title: String,
        default: ''
      }
    }
    </script>
    
    // 使用了 .async 修饰符之后，父组件这样写，等价于上面那种写法，只不过简化了书写
    <text-comp :title.sync="doc.title"></text-comp>
    ```

    

16. 插槽

    - 后背内容

      ```js
      // 后背内容（插槽的默认内容）
      <button type='submit'>
          <slot>默认Submit</slot>
      </button>
      // 使用的时候，如果不提供默认的插槽内容，那么就显示“默认Submit”，如果提供则会覆盖
      ```

    - 具名插槽

      ```js
      // 具名插槽
      // 应用场景：有时候我们需要有多个插槽，例如对于一个layout组件，需要包含头部、主体、底部
      <div class="container">
        <header>
          <!-- 我们希望把页头放这里 -->
        </header>
        <main>
          <!-- 我们希望把主要内容放这里 -->
        </main>
        <footer>
          <!-- 我们希望把页脚放这里 -->
        </footer>
      </div>
      
      // 利用slot元素有一个name属性解决
      <div class="container">
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
      // 即使不写name，默认也是存在的，即是default
      
      // 在向具名插槽提供内容的时候，我们可以在一个template元素上使用v-slot指令传递slot的name
      <base-layout>
        <template v-slot:header>
          <h1>Here might be a page title</h1>
        </template>
      
        <p>A paragraph for the main content.</p>
        <p>And another one.</p>
      
        <template v-slot:footer>
          <p>Here's some contact info</p>
        </template>
      </base-layout>
      // 注意，任何没有被包裹在带有v-slot的template中的内容都会被视为默认插槽的内容
      // 当然也可以这么写
      <template v-slot:default>
          <p>A paragraph for the main content.</p>
          <p>And another one.</p>
      </template>
      // 注意，v-slot只能加在template上
      
      // 具名插槽可以缩写，把v-slot缩写为#
      <template #footer>
          <p>Here's some contact info</p>
      </template>
      ```

      

    - 作用域插槽

    ```js
    // 作用域插槽
    // 应用场景：有时候需要让父级插槽内容能够访问子组件的数据
    // 这个时候可以把子组件的数据作为slot的属性绑定上去，绑定在slot元素上的属性被称为插槽的prop
    
    // 子组件
    <span>
      <slot v-bind:user="user">
        {{ user.lastName }}
      </slot>
    </span>
    // 父组件
    <current-user>
      <template v-slot:default="slotProps"> // slotProps 插槽prop的名字，可以随意起
        {{ slotProps.user.firstName }}
      </template>
    </current-user>
    // 父组件还可以这么写
    <current-user v-slot:default="slotProps">
      {{ slotProps.user.firstName }}
    </current-user>
    // 父组件也可以这么写
    <current-user v-slot="slotProps">
      {{ slotProps.user.firstName }}
    </current-user>
    
    // 注意：如果出现多个插槽，只能这么写
    <current-user>
      <template v-slot:default="slotProps">
        {{ slotProps.user.firstName }}
      </template>
    
      <template v-slot:other="otherSlotProps">
        ...
      </template>
    </current-user>
    
    
    // 解构插槽prop
    <current-user v-slot="{ user }">
      {{ user.firstName }}
    </current-user>
    // 解构重命名
    <current-user v-slot="{ user: person }">
      {{ person.firstName }}
    </current-user>
    // 定义后背内容prop
    <current-user v-slot="{ user = { firstName: 'Guest' } }">
      {{ user.firstName }}
    </current-user>
    
    ```
    
    - 动态插槽名
    
    ```js
    // 插槽的名称支持动态插槽名
    <base-layout>
      <template v-slot:[dynamicSlotName]>
    ...
      </template>
</base-layout>
    ```
    
      

    - 插槽的应用场景

    ```js
    // 比如当我们使用todo-list组件的时候，可以为todo定义一个不一样的template，这样可以避免封装的todo-list组件内部的结构写死，同时结合作用域插槽一起使用，可以在父组件拿到子组件的数据做业务逻辑
    
    // 父组件
    <template>
      <div>
        <todo-list v-bind:todos="todos">
          <template v-slot:todo="{ todo }">
            <span v-if="todo.isComplete">✓</span>
            {{ todo.text }}
          </template>
        </todo-list>
      </div>
    </template>
    
    <script>
    import TodoList from "./todo-list.vue";
    export default {
      components: {
        TodoList,
      },
      data() {
        return {
          todos: [
            {
              id: 1,
              text: "js",
              isComplete: true
            },
            {
              id: 2,
              text: "html",
              isComplete: false
            },
          ],
        };
      },
    };
    </script>
    
    // todo-list组件
    <template>
      <div>
        <ul>
          <li v-for="todo in filteredTodos" v-bind:key="todo.id">
            <!--
        我们为每个 todo 准备了一个插槽，
        将 `todo` 对象作为一个插槽的 prop 传入。
        -->
            <slot name="todo" v-bind:todo="todo">
              <!-- 后备内容 -->
              {{ todo.text }}
            </slot>
          </li>
        </ul>
      </div>
    </template>
    
    <script>
    export default {
      props: {
        todos: Array
      },
      data() {
        return {
          filteredTodos: this.todos
        };
      },
    };
    </script>
    ```



17. 动态组件

18. 异步组件

19. 处理边界情况

20. 自定义指令

    - v-model、v-show是默认的内置指令

    - vue允许注册自定义的指令

    - 用自定义组件实现聚焦输入框的例子

      ```js
      // 当页面加载的时候，这个输入框将自动获取焦点（注意，autofocus在移动版Safari上不工作）。事实上，只要你再打开这个页面后还没有点击过任何内容，这个输入框就应当是处于聚焦状态。
      
      // 使用Vue.directive注册全局指令 v-focus
      Vue.directive('focus', {
        // 当被绑定的元素插入到 DOM 中时……
        inserted: function (el) {
          // 聚焦元素
          el.focus()
        }
      })
      
      // 如果想注册局部指令，组件中也接受一个 directives 的选项：
      directives: {
        focus: {
          // 指令的定义
          inserted: function (el) {
            el.focus()
          }
        }
      }
      ```

    - 指令的钩子函数（一个指令定义对象可以提供如下几个钩子函数，均为可选）

      - bind：只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置
      - inserted：被绑定的元素插入到父节点时调用（仅仅保证父节点存在，但是不一定已经被插入到文档中）
      - update：所在组件的VNode更新时调用
      - componentUpdated：指令所在的组件的VNode及其子组件VNode全部更新后调用
      - unbind：只调用一次，指令和元素解绑的时候调用

    - 钩子函数的参数

      - el：指令所绑定的参数，可以用来直接操作dom
      - binding：指令的核心对象，描述指令的全部信息属性，比如name、value、oldValue、expression、arg、modifers
      - vnode：vue编译生成的虚拟节点
      - oldValue：上一个虚拟节点，仅仅在update和componentUpdated钩子中可用

    - 指令接受参数，也接受动态参数，`v-mydirective:[argument]="value"`

      ```js
      <div v-demo="{ color: 'white', text: 'hello!' }"></div>
      
      Vue.directive('demo', function (el, binding) {
        console.log(binding.value.color) // => "white"
        console.log(binding.value.text)  // => "hello!"
      })
      ```

      

21. 





1.  vue 如何做权限校验?

   - 接口权限控制

     > 在用户登录成功之后，后台会返回一个token，之后前端每次进行接口请求的时候，都要带上这个token。后台拿到这个token之后进行判断，如果此token确实存在且没有过期，则可以通过访问。如果token不存在后后台判断已经过期，则会跳转到登录页面，要求用户重新登录获取最新的token

   - 页面控制权限

     - 实现页面访问权限又可分为以下两种方案：
       + 方案一：初始化即挂载全部路由，每次跳转前做校验
       + 方案二：只挂载当前用户拥有的路由，如果用户通过URL进行强制访问，则会进入404，相当于从源头进行控制
     - 页面中的按钮的权限控制是否显示
       + vue提供的自定义指令，实现按钮的权限控制

   

2. 描述下自定义指令(vue部分)

   > 在vue2.x中，代码复用和抽象的主要形式是组件。然而，有的情况下，你仍然需要对普通DOM元素进行底层操作，这时候就会用到自定义指令。
   >
   > 自定义指令分为全局指令、局部指令、钩子函数
   >
   > - 全局定义：Vue.directive("focus",{})
   > - 局部定义：directives:{focus:{}}
   > - 钩子函数：指令定义对象提供钩子函数
   >
   > 使用场景：
   >
   > - 普通DOM元素进行底层操作的时候，可以使用自定义指令。
   >
   > - 自定义指令是用来操作DOM的。尽管Vue推崇数据驱动视图的理念，但并非所有情况都适合数据驱动。自定义指令就是一种有效的补充和扩展，不仅可用于定义任何的DOM操作，并且是可复用的。
   >
   > - 使用案例：
   >  - 初级使用： 鼠标聚焦 下拉菜单 相对时间转换 滚动动画
   >   -  高级应用： 自定义指令实现图片懒加载（借助于 IntersectionObserver 实现）

   

3. 说一下 Vue3 的 Composition API

4. 说说Vue开发如何针对搜索引擎做SEO优化?

   - Vue SPA单页面应用对SEO不友好
   - 采用SSR服务端渲染
   - nuxt静态化

5. Vue-cli默认是单页面的，如果要开发多页面应该怎么办?

6. Vue是如何收集依赖的?

7. vue双向数据绑定原理?

   > vue通过使用双向数据绑定来实现了view和model（业务数据）的同步更新，vue.js是采用数据劫持结合发布者-订阅者模式的方式，通过ES5提供的Object.defineProperty()方法来劫持(监视)各个属性的setter,getter，在数据变动的时发布消息给订阅者，触发相应的监听回调。

8. 说一下Vue template到render的过程

   > 

   

9. 说一下Vue的生命周期以及每个阶段做的事情

   - beforeCreate：数据观测和初始化事件还没有开始
   - created：数据观测完成，属性和方法的运算，初始化事件完成，$el属性还没有显示出来
   - beforeMount：相关的render函数首次被调用，模板编译完成，把data里面的数据和模板生成html，此时还没有挂载html到页面上
   - mounted：用上面编译好的html内容替换el属性指向的dom对象，此时模板中的html已经被渲染到页面中
   - beforeUpdate：数据更新之前调用，发生在虚拟dom重新渲染和打补丁之前，在该钩子中进一步更改状态，不会触发重复渲染过程
   - updated：组件dom已经被更新
   - beforeDestroy：实例销毁之前调用，实例仍然可以使用
   - destroyed：实例销毁之后调用，调用后所有的事件监听器会被移除，所有的**子实例**也会被销毁

   

10. 子组件可以直接改变父组件的数据么？说说你的理由？(vue部分)

11. 怎样理解 Vue 的单向数据流？

    > 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。
    >
    > 额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。子组件想修改时，只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。
    >
    > 有两种常见的试图改变一个 prop 的情形:
    >
    > - 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值：
    >
    >   ```js
    >   props: ['initialCounter'],
    >   data: function () {
    >     return {
    >       counter: this.initialCounter
    >     }
    >   }
    >   ```
    >
    >   
    >
    > - 这个 prop 以一种原始的值传入且需要进行转换。 在这种情况下，最好使用这个 prop 的值来定义一个计算属性
    >
    >   ```js
    >   props: ['size'],
    >   computed: {
    >     normalizedSize: function () {
    >       return this.size.trim().toLowerCase()
    >     }
    >   }
    >   ```
    >
    >   

12. v-model是如何实现的，语法糖实际是什么？

13. 说一下Vue单页与多页的区别?

    > SPA：指的是只有一个主页应用（一个html页面），一开始只需要加载一次js、css等相关资源。所有的内容都包含在主页面，对每一个功能模块组件化，单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
    >
    > MPA：指的是有多个独立页面的应用（多个html页面），每个页面必须重复加载js、css，多页面应用跳转，需要整页资源刷新。

    > 区别
    >
    > - 刷新方式
    >   - SPA：相关组件切换，页面局部刷新或更改
    >   - MPA：整页刷新
    > - 路由模式
    >   - SPA：可以使用hash或者history
    >   - MPA：普通链接跳转
    > - 用户体验
    >   - SPA：页面切换的时间短，用户体验好，但是第一次需要加载的文件过多
    >   - MPA：页面切换缓慢，流畅度不够，用户体验比较差，尤其网速慢的情况
    > - 数据传递
    >   - SPA：容易实现数据的传递，有多种方式
    >   - MPA：依赖URL传参，本地存储等
    > - 使用范围
    >   - SPA：追求较高的流畅度，对SEO要求不高
    >   - MPA：对SEO要求较高的网站
    > - 资源文件
    >   - SPA：组件公用的资源只需要加载一次
    >   - MPA：每个页面都需要加载公用的资源

    

14. 说一下Vue的$nextTick原理

15. 使用过 Vue SSR 吗？说说 SSR？

16. 说一下Vue 的父组件和子组件生命周期钩子函数执行顺序？

    > 分为以下四类
    >
    > - 加载渲染过程
    >
    >   `父beforeCreate -> 父created -> 父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted`
    >
    > - 子组件更新过程
    >
    >   `父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated`
    >
    > - 父组件更新过程
    >
    >   `父beforeUpdate -> 父updated`
    >
    > - 销毁过程
    >
    >   `父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed`

    

17. 在哪个生命周期内调用异步请求？

    > 可以在钩子函数created、beforeMount、mounted中进行调用，因为在这三个钩子函数中，data已经创建且被初始化完成，可以将服务端返回的数据赋值给它，但是建议在created进行。
    >
    > 因为可以更快获取数据，减少页面的loading时间，ssr不支持beforeMount、mounted函数，所以放在created还可以保证代码的一致性。

    

18. Vue 组件间通信有哪几种方式？

    - 主要是指3类通信：父子组件通信、隔代组件通信、兄弟组件通信
    - props/$emit，适用于父子组件
    - ref与$parent/$children，适用父子组件通信
      - ref如果用在普通的dom元素上，指向的是dom元素，如果用在组件上，指向的是组件实例
      - $parent/$children，访问父子组件实例
    - EventBus，适用于父子、兄弟、隔代通信，原理是通过一个空的Vue实例作为中央事件总线，用它来触发事件和监听事件，从而实现在任何组件间的通信，包括隔代、父子、兄弟组件
    - $attrs/$listeners，适用于隔代组件，通常配合inheritAttrs一起使用
    - provide/inject，适用于隔代组件，祖先组件通过provider来提供变量，然后再子孙组件中通过inject来注入变量，通常用作组件库开发
    - vuex，适用于父子、兄弟、隔代

    

19. 为什么组件中的 data 必须是一个函数，然后 return 一个对象，而 new Vue 实例里，data 可以直接是一个对象？

    > 因为组件是用来复用的，并且js之间对象是引用的关系，如果组件中data是一个对象，那么这样作用域没有隔离性，子组件中的data属性值会相互影响，如果组件中data选项是一个函数，那么每个实例可以维护一份被返回对象的独立的拷贝，组件实例之间的data属性值不会互相影响，而new Vue的实例是不会被复用的，因此不存在引用对象的问题。

    

20. 关于对 Vue 项目进行优化，你有哪些方法?

    - 代码层面的优化
      - v-if和v-show区分使用场景
      - computed和watch区分使用场景
      - v-for遍历必须为每一项添加key，同时不要和v-if同时使用
      - 长列表性能优化
      - 事件的销毁
      - 图片资源懒加载
      - 路由懒加载
    - webpack层面的优化
      - webpack对图片进行压缩
      - 提取公共代码，比如组件的css
      - 优化source-map
    - web技术方面的优化
      - 开启gzip压缩
      - 浏览器缓存
      - CDN的使用
      - 使用 Chrome Performance 查找性能瓶颈



21. 说一下Vue的keep-alive是如何实现的，具体缓存的是什么？

22. 对虚拟DOM的理解？虚拟DOM主要做了什么？虚拟DOM本身是什么？

> 什么是虚拟dom？
>
> - 虚拟dom是一个js对象，通过对象的形式来表示DOM结构，通过事务处理机制，将多次DOM修改的结果一次性的更新到页面上，从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。
>
> - 设计的最初目的，就是更好的跨平台，比如node.js就没有DOM，如果想实现SSR，那么一个方式就是借助虚拟dom，因为虚拟dom本身就是js对象。在代码渲染到页面之前，vue或者react会把代码转换成一个对象(虚拟DOM)。以对象的形式来描述真实dom结构，最终渲染到页面。在每次数据发生变化前，虚拟dom都会缓存一份，变化之时，现在的虚拟dom会与缓存的虚拟dom进行比较。
>
> 
>- 在vue或者react内部封装了diff算法，通过这个算法来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

> 为什么要用虚拟dom？
>
> - 保证性能下限，在不进行手动优化的情况下，依然可以提供过得去的性能
> - 跨平台，因为虚拟dom本质上是js对象，可以很方便的跨平台操作，比如服务端渲染ssr

> 虚拟dom真的比真实dom好吗？
>
> 首次渲染大量dom时，由于多了一层虚拟dom的计算，比innerHTML插入慢。



23. 计算属性和普通属性的区别是什么？

> - 计算属性是基于他们的依赖进行缓存的，只有在相关依赖发生改变时，他们才会重新求值，也就是说，只要他的依赖没有发生变化，那么每次访问的时候计算属性都会立即返回之前的计算结果，不再执行函数
> - computed是响应式的，methods是非响应式的
> - 访问的方式不一样，computed的成员可以像属性一样访问，但是methods定义的成员得像函数一样去调用
> - 如果声明的计算属性计算量非常大的时候，而且访问量次数非常多，改变的时机却很小，那就需要用到computed，缓存会让我们减少很多计算量
> - computed不支持异步，当computed内有异步操作时无效，无法监听数据的变化

24. computed和watch的使用场景区分
25. vue的长列表性能优化