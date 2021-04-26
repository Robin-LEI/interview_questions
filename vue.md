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
   > <hr>
   >
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
   
   
   
8. 

   



# vue打包工具采用rollup

1. rollup相比webpack的优点？

   > 打包结果比较清晰，体积小，更适合用于打包类库
   >
   > webpack更适合用于日常开发项目打包

###   rollup 简易版config配置

1. rollup的配置文件为`rollup.config.js`

2. 基础使用配置

   ```js
   import babel from 'rollup-plugin-babel';
   import serve from 'rollup-plugin-serve';
   
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