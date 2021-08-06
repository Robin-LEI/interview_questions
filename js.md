防抖

- 原理：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时

- 适用场景：按钮提交，防止多次提交按钮，只执行最后提交的一次；搜索框联想场景，防止联想发送请求，只发送最后一次输入；判断scroll是否滑动到底部（滚动事件+防抖）。

- 总的来说，适合多次事件，一次响应的情况。

- 简易版实现

  ```html
  <button onclick="clickBtn()">click me</button>
  <script>
  function debounce(fn, wait) {
      var timer = null;
      return function() {
          let context = this;
          let args = arguments;
          if (timer) {
              clearTimeout(timer);
              timer = null;
          }
          timer = setTimeout(function() {
             fn.apply(context, args); 
          }, wait);
      }
  }
  let fn = function() {
      console.log('debounce');
  }
  let d = debounce(fn, 1000)
  function clickBtn() {
      d()
  }
  </script>
  ```

2. 节流

   - 规定一个单位时间，在这个单位时间内，只能有一次触发事件的回调函数执行，如果在同一个单位时间内，某事件被触发多次，只能有一次生效。

   - 适用场景：拖拽场景，固定时间内只执行一次，防止超高频次触发位置变动；缩放场景，监控浏览器resize。

     ```html
     <!-- 定时器实现 -->
     function throttle(func, wait) {
         let timeout;
         return function () {
             const context = this;
             const args = arguments;
             if (!timeout) {
                     timeout = setTimeout(function () {
                     timeout = null;
                     func.apply(context, args)
                 }, wait)
             }
         }
     }
     <!-- 时间戳实现 -->
     function throttle(func, wait) {
       let context, args;
       let previous = 0;
       return function () {
         let now = +new Date();
         context = this;
         args = arguments;
         if (now - previous > wait) {
           func.apply(context, args);
           previous = now;
         }
       }
     }
     let fn = function () {
     	console.log('scroll');
     }
     let d = throttle(fn, 1000);
     window.onscroll = function () {
     	d();
     }
     ```


2. 对闭包的看法，为什么要用闭包？说一下闭包原理以及应用场景？

   - 什么是闭包？

     闭包可以让你在一个内层函数访问到外层函数的作用域。由于在JavaScript语言中，只有子函数可以读取局部变量的值，因此可以把闭包简单理解成“定义在一个函数内部的函数”，所以在本质上，闭包就是把内部函数和外部函数连接起来的一座桥梁。

   - 使用闭包的注意点（缺点）

     - 闭包会使得函数中的变量保存在内存中不能被及时释放，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题。在IE中可能会导致内存泄露，解决办法是，在退出函数之前，将函数中不用的变量全部删除
     - 安全问题，闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当做对象使用，这个时候闭包就可以看做一个公共方法，父函数内部的变量作为私有属性，这时一定要小心，不要随便改变父函数内部变量的值。

   - 闭包的原理？

     - 函数执行分为两个阶段（预编译阶段和执行阶段）
       - 预编译阶段，如果发现内部函数使用了外部函数的变量，则会在内存中创建一个“闭包”对象并保存对应变量值，如果已存在“闭包”，则只需要增加对应的属性值即可。
       - 执行完后，函数执行上下文会被销毁，函数对“闭包”对象的引用也会被销毁，但其内部函数还持用该“闭包”的引用，所以内部函数可以继续使用“外部函数”中的变量，直到内部函数被销毁后才被销毁
       
       > **JS运行三部曲**
       >
       > - 语法分析
       > - 预编译：预编译就是把函数参数、变量声明、函数声明提升到逻辑的最前面，发生在函数执行的前一刻
       > - 解释执行
       >
       > > js是单线程的解释型语言
       > >
       > > 单线程就是先执行一个，在执行另外一个
       > >
       > > 解释型语言就是先翻译一行，在执行一行，在翻译一行，在执行一行
       > >
       > > 但是js在执行之前通常会先通篇扫描一遍代码，而不执行代码，通篇扫描的目的是看看有没有什么低级语法错误，这个过程就叫做语法分析。
       > >
       > > 扫描完成之后，才真正开始预编译。
       >
       > > **预编译四部曲（函数内的预编译）**
       > >
       > > - 创建AO对象
       > > - 找形参和变量声明，将变量和形参名作为AO属性名，值为undefined
       > > - 将实参值和形参统一
       > > - 在函数体里面找函数声明，值赋予函数体
       >
       > > AO对象（活跃对象/执行期对象），在函数执行前执行函数预编译，此时产生一个AO对象，AO对象保存这个函数的参数变量
       > >
       > > GO对象（全局对象，等同于window）：在开始预编译时产生的对象，比AO对象先产生，用于存放全局变量，也称为全局作用域
       >
       > > js中常见的函数声明
       > >
       > > ```js
       > > // 表达式声明
       > > var a = function() {}
       > > 
       > > // 函数声明
       > > function b() {}
       > > 
       > > // 区别1
       > > // 函数声明可以提前被解析出来，但是表达式声明不可以
       > > // 解析器会先读取函数声明，并使其在执行任何代码之前可以访问，在任何地方调用都可以
       > > // 函数表达式必须要等到解析器执行到它所在的代码才会被真正的执行，提前调用会报错
       > > 
       > > // 区别2
       > > // 函数表达式可以直接后面加括号，而函数声明不可以
       > > var a = function() {}();
       > > 
       > > function b() {}() // 会报错
       > > 
       > > // 注意：当同时使用这两种方式声明同一个函数名，最终执行的是函数表达式声明的函数
       > > ```
       > >
       > > 

   - 闭包的优点？

     - 可以从内部函数访问到外部函数的作用域中的变量，访问到的变量长期驻扎在内存中，可以供之后使用
     - 避免变量污染全局

   - 闭包的使用场景

     - 模块封装，采用这种方式防止变量污染全局

       ```js
       var module = (function() {
           // 这样声明为模块的私有变量，外界无法直接访问
           var foo = 0;
           function test() {}
           module.prototype.bar = function bar() {
               return foo;
           };
           return test;
       })();
       ```

       

     - 在循环中创建闭包，防止取到意外的值

       ```js
       for (var i = 0; i < 3; i++) {
           document.getElementById('id' + i).onfocus = function() {
             alert(i);
           };
       }
       //可用闭包解决
       function makeCallback(num) {
         return function() {
           alert(num);
         };
       }
       for (var i = 0; i < 3; i++) {
           document.getElementById('id' + i).onfocus = makeCallback(i);
       }
       ```

3. 实现add(1)(2)(3)

   - 考点：函数柯里化，柯里化是把接受多个参数的函数转变为接受一个单一参数的函数，并且返回接受余下的参数且返回结果的新函数的技术。

     ```js
     // 求和函数
     function add(...args) {
         return args.reduce((a, b) => a + b);
     }
     // 把求和函数变为柯里化函数
     function currying(fn) {
         let args = [];
         return function temp(...newArgs) {
             if (newArgs.length) { // 继续调用
                 args = [...args, ...newArgs];
                 return temp; // 继续返回函数，以便支持链式调用
             } else { // 开始执行
                 let val = fn.apply(this, args);
                 args = []; // 清空，以便下一次使用的时候，不被污染
                 return val;
             }
         }
     }
     // 测试
     let addCurry = currying(add)
     console.log(addCurry(1)(2)(3)(4, 5)())  //15
     console.log(addCurry(12)(221)(3, 4, 5)())  //15
     console.log(addCurry(1)(2, 3, 4, 5)())  //15
     ```

4. 类数组和数组的区别，dom的类数组如何转换为数组

   - 数组是一个特殊的对象，与常规对象的区别：

     - 当有新元素添加到列表中，自动更新length属性
     - 设置length属性，可以截断数组
     - 从Array.prototype中继承了方法

   - 类数组是一个拥有length属性，并且它的属性为非负整数的普通对象，*类数组不能直接调用数组的方法*

   - 本质区别：类数组是简单对象，它的原型关系和数组不同

     ```js
     let arrayLike = {
         length: 10,
     };
     console.log(arrayLike instanceof Array); // false
     console.log(arrayLike.__proto__.constructor === Array); // false
     console.log(arrayLike.toString()); // [object Object]
     console.log(arrayLike.valueOf()); // {length: 10}
     
     let array = [];
     console.log(array instanceof Array); // true
     console.log(array.__proto__.constructor === Array); // true
     console.log(array.toString()); // ''
     console.log(array.valueOf()); // []
     ```

   - 类数组转为数组

     ```js
     Array.from()
     Array.prototype.slice.call()
     Array.prototype.forEach() 进行属性遍历并组成一个新的数组
     // 注意，转换后的数组长度由length属性决定，索引不连续时转换结果是连续的，会自动使用undefined补位。
     ```

     

5. 说一下事件循环机制（node、浏览器）

   [点击查看](https://blog.csdn.net/weixin_42259266/article/details/110492036?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522161836442916780265449871%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=161836442916780265449871&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_v2~rank_v29-1-110492036.nonecase&utm_term=%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF)

   > **宏任务和微任务**
   >
   > 宏任务是宿主环境提供的，比如浏览器
   >
   > 微任务是语言本身提供的，比如promise.then
   >
   > 常见的宏任务：ajax，setTimeout，setInterval，requestAnimationFrame，messageChannel，UI渲染，setImmediate（只在IE下才会执行）
   >
   > 常见的微任务：then、queueMicrotask、mutationObserver（浏览器提供的）

   > **GUI渲染线程和JS引擎线程**
   >
   > GUI渲染线程和JS引擎线程是互斥的，当JS引擎执行的时候GUI线程会被挂起，保存在一个队列中，等到JS引擎空闲的时候，立即被执行
   >
   > ```js
   >   <body>
   >   <div id="div">
   >     1
   >   </div>
   >   <div id="div1">123</div>
   >   <script>
   >     while (true) { }
   > 
   >   </script>
   >   <script>console.log(3)</script>
   >   <div id="div2">333</div>
   > </body>
   > ```
   >
   > 

6. 介绍下promise的特性、优缺点，内部是如何实现的，动手实现promise

7. 实现链式调用

   - 链式调用的核心就在于调用完的方法将自身实例返回

     ```js
     // demo1
     function Class1() {
         console.log('初始化')
     }
     Class1.prototype.method = function(param) {
         console.log(param)
         return this
     }
     let c1 = new Class1()
     c1.method('第一次调用').method('第二次调用')
     // demo2
     var obj = {
         a: function() {
             console.log('a')
             return this
         },
         b: function() {
             console.log('b')
             return this
         }
     };
     obj.a().b();
     ```

8. 手写数组转树

   ```js
   // 例如将 input 转成output的形式
   let input = [
       {
           id: 1, val: '学校', parentId: null
       }, {
           id: 2, val: '班级1', parentId: 1
       }, {
           id: 3, val: '班级2', parentId: 1
       }, {
           id: 4, val: '学生1', parentId: 2
       }, {
           id: 5, val: '学生2', parentId: 3
       }, {
           id: 6, val: '学生3', parentId: 3
       },
   ]
   
   let output = {
       id: 1,
       val: '学校',
       children: [{
           id: 2,
           val: '班级1',
           children: [
               {
                   id: 4,
                   val: '学生1',
                   children: []
               },
               {
                   id: 5,
                   val: '学生2',
                   children: []
               }
           ]
       }, {
           id: 3,
           val: '班级2',
           children: [{
               id: 6,
               val: '学生3',
               children: []
           }]
       }]
   }
   
   // 代码实现
   function arrayToTree(array) {
       let root = array[0];
       array.shift();
       let tree = {
           id: root.id,
           val: root.val,
           children: array.length > 0 ? toTree(root.id, array) : []
       };
       return tree;
   }
   
   function toTree(parentId, array) {
       let children = [];
       let len = array.length;
       for (let i = 0; i < len; i++) {
           let node = array[i];
           if (node.parentId === parentId) {
               children.push({
                   id: node.id,
                   val: node.val,
                   children: toTree(node.id, array)
               })
           }
       }
       return children;
   }
   // 测试
   console.log(arrayToTree(input))
   ```

9. 单点登录实现原理

   - 什么是单点登录

     - 单点登录SSO（single sign on），是一个多系统共存的环境，用户在一处登录后，就不用再其它系统中登录，也就是用户的一次登录得到其它系统的信任
     - 单点登录有一个独立的认证中心，只有认证中心才能接受用户的用户名和密码等信息进行认证，其他系统不提供登录入口，只接受认证中心的间接授权。间接授权通过令牌实现，当用户提供的用户名和密码通过认证中心认证后，认证中心会去创建授权令牌，在接下来的跳转过程中，授权令牌作为参数发送给各个子系统，子系统拿到令牌即得到了授权，然后创建局部会话。

   - 单点登录原理（单点登录有同域和跨域两种情景）

     - 同域

       > 适用场景：都是企业自己的系统，所有系统都使用同一个一级域名通过不同的二级域名来区分。
       >
       > 举个例子：公司有一个一级域名zlt.com，我们有三个系统分别为：门户系统（sso.zlt.com）、应用1（app1.zlt.com）和应用2（app2.zlt.com），需要实现系统之间的单点登录，实现架构如下：
       >
       > 1. 门户系统设置的cookie的domain为一级域名也是zlt.com，这样就可以共享门户的cookie给所有的使用该域名xxx.zlt.com的系统
       > 2. 使用spring session等技术让所有系统共享session
       > 3. 这样只要门户系统登陆之后无论跳转应用1或者应用2，都能通过门户cookie中的sessionId读取到session中的登录信息实现单点登录

     - 跨域

       > 单点登录之间的系统域名不一样，例如第三方系统。由于域名不一样不能共享cookie了，需要一个独立的授权系统，即一个独立的认证中心（passport），子系统的登录均可以通过passport，子系统本身将不参与登录操作，当一个系统登录成功后，passport将会颁发一个令牌给子系统，子系统可以拿着令牌去获取数据，为了减少频繁认证，各个子系统在被passport授权以后，会建立一个局部会话，在一定时间内无需再次向passport发起认证。

   - 注销流程

     - 用户向系统提交注销操作
     - 系统根据用户与系统1建立的会话，拿到令牌，向sso认证中心提交注销操作
     - sso认证中心校验令牌有效，销毁全局会话，同时取出所有用此令牌注册的系统地址
     - sso认证中心向所有注册系统发起注销请求，各注册系统销毁局部会话
     - sso认证中心引导用户到登录页面

10. 有哪几种方式可以解决跨域问题？（描述对应的原理）

    > 跨域是因为浏览器的同源策略导致的，所谓的同源策略是指协议+域名+端口号，全部相同才可以

    > 一个域名的地址组成
    >
    > https:// www.abc.com:9000/scripts/jquery.js
    >
    > https:// 协议
    >
    > www 子域名
    >
    > abc.com  主域名
    >
    > 9000  端口号
    >
    > scripts/jquery.js  请求资源地址

    > 有三个标签是允许跨域加载资源的
    >
    > img的src
    >
    > link的href
    >
    > script的src

    > 请求跨域时，不是请求发布出去，请求可以发出去，服务端能接受到正常请求并作出响应，只是结果被浏览器拦截了
    >
    > **通过表单可以发起跨域请求**
    >
    > 比如a页面有form表单，b页面的路径是a的提交地址
    >
    > a页面submit后，浏览器刷新页面，页面显示b页面的内容
    >
    > form表单是将数据提交给了b页面，a页面并没有读取b页面的内容
    >
    > **ajax跨域是因为要读取接口地址的信息**

    > **跨域的解决方案**
    >
    > 1. jsonp
    >
    >    > 原理是利用script标签的src没有跨域限制的漏洞，jsonp请求一定需要对方的服务器做支持才可以
    >    >
    >    > jsonp和ajax相同，都是客户端向服务端发送请求，从服务端获取数据的方式，但是ajax属于同源策略，jsonp属于非同源策略，jsonp是异步请求的
    >    >
    >    > jsonp的优点是简单方便，缺点是只支持get请求，会遭受xss攻击
    >
    > 2. cors
    >
    >    > cors需要浏览器和后端同时支持，浏览器会自动进行cors通信，主要是后端需要配置各种头，服务端设置Access-Control-Allow-Origin就可以开启cors
    >
    > 3. postMessage
    >
    >    > 支持当前页面和打开的新窗口的数据传递，支持多窗口之间的消息传递，页面和iframe的消息传递，支持这三个场景的跨域数据传递
    >    >
    >    > `otherWindow.postMessage(message, targetOrigin, [transfer]);`
    >    >
    >    > message要发送的数据
    >    >
    >    > targetOrigin 目标源
    >
    > 4. websocket
    >
    >    > websocket是一种双向通信协议，在建立连接之后，websocket的server和client都可以主动向对方发送数据，此时它们的通信和http无关
    >
    > 5. nginx反向代理
    >
    >    > 需要搭建一个中转的nginx的服务器，用于转发请求
    >    >
    >    > 原理是通过nginx配置一个代理服务器（域名和domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺序修改cookie中domain信息，方便当前域cookie写入，实现跨域登录
    >    >
    >    > ```js
    >    > // nginx.conf 文件
    >    > server {
    >    >     listen	80;
    >    >     server_name	localhost;
    >    >     location / {
    >    >         proxy_pass	https://fxtest.accuat.com;
    >    >     }
    >    > }
    >    > // 这样当我们访问 localhost:80/test 时候会间接请求 https://fxtest.accuat.com/test
    >    > 
    >    > // 在webpack.config.js中的devServer属性也可以进行配置proxy
    >    > devServer: {
    >    >     port: 8080,
    >    >     open: true,
    >    >     host: "localhost",
    >    >     proxy: {
    >    >       "/api": {
    >    >         target: "https://fstest.accuat.com",
    >    >         changeOrigin: true,
    >    >         pathRewrite: {
    >    >           "^/api": ""
    >    >         }
    >    >       }
    >    >     }
    >    >   }
    >    > ```
    >    >
    >    > 
    >
    > 6. window.name + iframe
    >
    >    > name值在不同的页面（甚至不同域名）加载后依旧存在
    >    >
    >    > window.name可以支持2MB的数据
    >
    > 7. location.hash + iframe

11. 原生实现ES5的Object.create() 方法

    ```js
    // Object.create(proto[, propertiesObject])
    // 此方法使用指定的原型对象和其属性创建了一个新的对象
    // 第二个参数表示属性描述符，如果是null或非原始包装对象，则抛出一个TypeError异常【经过测试传null报错】
    // 如果不指定对应的属性描述符，默认都是false
    
    let obj = {name: 'obj'}
    let x = Object.create(obj)
    x.__proto__ === obj; // true
    
    // 使用Object.create(null)初始化一个新对象相比直接使用对象字面量的形式有什么好处
    1. 使用前者创建出来的对象干净，没有任何其它属性，我们可以自己定义hasOwnProperty、toString等方法，不用担心覆盖原型链上的方法
    2. 使用for...in遍历的时候，会遍历对象原型链上的所有属性，使用前者可以减少遍历的次数
    3. 当需要一个非常干净且高度可定制的对象作为数据字典的时候，同时想提高一点性能的时候可以采用前者，其它情况均可以采用后者
    
    
    /*
        enumerable可枚举，默认为false
        configurable可删除，默认为false,true表示不能删除，false可以删除
        writable可赋值，默认为false
        value属性的值
    */
    const person = {
        isHuman: false
    };
    const me = Object.create(person, {
        isHuman: {
            configurable: true
        }
    });
    // Object.defineProperties() 直接在一个对象上定义新的属性或者修改现有的属性，并返回该对象
    // 判断一个值是不是对象：value === Object(value) 则是对象，反之不是
    因为Object(1)会调用Number对1进行包装，返回一个包装对象
    // 模拟实现
    Object.create = function(prototype, properties) {
        if (typeof prototype !== 'object') {
            throw TypeError();
        }
        function Ctor() {}
        Ctor.prototype = prototype;
        let o = new Ctor(); // o 就会继承 prototype 上的所有属性和方法
        if (prototype) {
            // 实例对象的constructor属性指向其构造函数
            这里为什么要改？
            实例对象的constructor属性指向其构造函数，不指向构造函数的prototype
            实例对象的__proto__指向构造函数的prototype
            o.constructor = Ctor;
        }
        if (properties != undefined) {
            if (properties !== Object(properties)) { // 不是对象
                throw TypeError();
            }
            Object.defineProperties(o, properties);
        }
        return o;
    }
    
    在JS中，为什么在构造函数上设置原型会改变其实例上的constructor属性？
    function Person() {}
    function Animal() {}
    
    Person.prototype = Animal;
    
    let p = new Person();
    
    // 为什么Person.prototype = Animal;会导致这个打印为false
    console.log(p)
    console.log(p.constructor === Person) // false
    
    下面打印为true的原因是，实例对象本身没有constructor属性，查找的时候会沿着原型链向上查找，这里就会沿着 __proto__ 向上查找
    而 实例对象的 __proto__ 指向构造函数的原型对象
    这里的原型对象被修改成了 Animal构造函数 
    而Animal构造函数本身没有 constructor 属性，但是它是Function的实例，所以会沿着 __proto__ 继续向上查找 找到Function构造函数
    原型对象上有constructor属性指向构造函数
    console.log(p.constructor === Function) // true
    console.log(p.constructor === Animal) // false
    
    // 想知道构造函数有几个参数
    实例.constructor.length
    ```

    

12. 请列出至少5个JavaScript常用的内置对象，说明其用途

    - js的标准内置对象分为：值属性和函数属性，值属性指的是全局属性，函数属性指的是全局方法
    - 值属性：undefined、NaN、Infinity、globalThis

    - 常用的五种内置对象
      - encodeURI() 对统一资源标识符（URI）进行编码
      - eval() 函数将传入的字符串当做JavaScript代码进行执行
      - isFinite() 判断传入的参数是否为一个有限的数值
      - isNaN() 判断一个值是否为NaN
      - parseInt(string, radix) 将一个字符串string转换为radix进制的整数，radix为介于2-36之间的数，第二个参数默认是10
      
    - 这里的术语“全局对象”（或标准内置对象）不应该与global对象混淆，这里的“全局对象”指的是处在全局作用域里面的多个对象。

    - global对象在全局作用域下可以通过this访问到（非严格模式下，严格模式下得到undefined）

    - 基本对象（包括一般对象、函数对象、错误对象）
      - Object、Function、Boolean、Symbol（一般对象）
      - Error（通过Error对象可以自定义错误对象 ，throw new Error('自定义错误') ）、TypeError（变量或者参数不是预期类型时发生的错误，比如new 字符串，布尔值，数字，var obj = {}; obj.test() ）、SyntaxError（console.log(1 ）、ReferenceError（y=xx，引用一个不存在的变量xx）、RangeError（范围错误，当一个值超出有效范围的时候，new Array(-1) ）（错误对象）
      
    - **escape、encodeURI、encodeURIComponent的区别**

      > escape用于给字符串编码的，返回一个字符的Unicode编码值，对应的解码函数是unescape，不适合使用对URL编码，因为不对ASCII字母、数字进行编码，也不对 *@-+_./进行编码
      >
      > encodeURI，编码的字符范围没有encodeURIComponent广

13. 实现格式化输出，比如输入999999999，输出999,999,999

    ```js
    // 实现1
    function formatOutput(val) {
        if (val == null) return '';
        let result = '';
        val = val + '';
        let str = val.split('').reverse().join('');
        let start = 0;
        let end = 3;
        while (start < str.length) {
            const temp = str.slice(start, end);
            start += 3;
            end += 3;
            result += temp + ','
        }
        result = result.substring(0, result.length - 1);
        result = result.split('').reverse().join('');
        return result;
    }
    
    // 实现2
    function formatNumber(num){
      return Number(num).toLocaleString('en-US'); // 返回这个数字在特定语言环境下的表示字符串
    }
    
    // 实现3
    function formatNumber(num) {
        // Intl对象是ECMAScript国际化API的一个命名空间，它提供了精确的字符串对比，数字格式化，日期和时间格式化
        return new Intl.NumberFormat().format(num);
    }
    
     function parse(number) {
         if (!number) return number;
         if (!isFinite(number)) return number; // 如果不是有限的
         let result = '';
    
         number = (number + '').split('').reverse(); // 变为字符数组
    
         for (let i = 1; i <= number.length; i++) {
             if (i % 3 === 0) {
                 result += number[i - 1] + ',';
             } else {
                 result += number[i - 1];
             }
         }
    
         result = result.split('').join('');
         result = result.slice(-1) === ',' ? result.slice(0, -1) : result;
    
         return result.split('').reverse().join('');
     }
    
    console.log(parse(12345424235))
    ```

    

14. 请实现鼠标点击页面中的任意标签，alert该标签的名称（注意兼容性）

    ```js
    // 直接实现
    document.onclick = function(e) {
        e = e || window.event; // 处理兼容，获取事件的对象
        let o = e.target || e.srcElement; // 获取触发事件的元素
        alert(o.tagName.toLowerCase());
    }
    
    // 优雅实现
    window.onload = function() {
        let body = document.getElementByTagName('body');
        body[0].onclick = function(e) {
        	e = e || window.event;
        	let o = e.target || o.srcElement; // firefox支持target，IE支持srcElement
            let eleName = o && o.tagName ? o.tagName.toLowerCase() : 'No tagName';
            alert(eleName);
    	}
    }
    ```

    

15. 多个tab只对应一个内容框，点击每个tab都会请求接口并渲染到内容框，怎么确保频繁点击tab但能够确保数据正常显示？

    - 分析

      > 因为每个请求处理时长不一致，可能会导致先发送的请求后响应，也就是请求响应的顺序和请求发送的顺序不一致，从而导致数据显示不正确。
      >
      > 可以简化为：连续触发多个请求，如何保证最后响应的结果是最后发送的请求。

    - 类似场景

      > input输入框的即时搜索、表格快速切换页码

    - 解决方案

      > 防抖（过滤掉一些非必要的请求）+ 取消上次未完成的请求（保证最后一次请求的响应顺序）
      >
      > 取消请求的方法：
      >
      > 1. XMLHttpRequest取消请求的方法，abort
      > 2. Axios取消请求的方法，cancelToken

    - 请求取消的方法

      ```js
      // 原生ajax
      XMLHttpRequest返回的实例对象上有abort方法，调用即可
      
      // jQuery 的$.ajax
      let ajax = $.ajax()
      ajax.abort()
      和原生一样，都是调用abort方法，但是操作的对象不一样，取消ajax之后，会触发$.ajax的error方法
      
      // axios
      var CancelToken = axios.CancelToken();
      var source = CancelToken.source();
      
      axios({
          // cancelToken的值起着标识作用，标识由source控制，可以实现精确取消具体哪一个请求
          cancelToken: source.token
      })
      
      source.cancel('请求被手动取消');
      ```

      

16. 尾递归实现

    - 什么是尾递归

      > 尾调用：当一个函数执行时的最后一个步骤是返回另一个函数的调用，这就叫做尾调用。
      >
      > <code>
      >
      > function f(x) {
      >
      > ​	return g(x);
      >
      > }
      >
      > </code>
      >
      > <!-- 注意：以下情况不属于尾调用 -->
      >
      > <code>
      >
      > function f(x) {
      >
      > ​	let y = g(x);
      >
      > ​	return y;
      >
      > }
      >
      > function f(x) {
      >
      > ​	return g(x) + 1;
      >
      > }
      >
      > </code>
      >
      > <!-- 注意：尾调用不一定出现再函数尾部，只要是函数的最后一步调用即可 -->
      >
      > 当一个函数尾调用自身，就叫做尾递归

    - 尾调用优化

      - [点击查看](http://www.ruanyifeng.com/blog/2015/04/tail-call.html)

      - 只保留内层函数的调用记录，如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存，这就是尾调用优化的意义。

        ```js
        function f() {
          let m = 1;
          let n = 2;
          return g(m + n);
        }
        f();
        
        // 等同于
        function f() {
          return g(3);
        }
        f();
        
        // 等同于
        g(3);
        
        // 上面的代码中，如果函数g不是尾调用，函数f就需要保存内部变量m和n的值、g的调用位置等信息
        // 但是由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除f()的调用记录，只保留g(3)的调用记录
        ```

        

    - 尾递归应用

      - 阶乘函数

        ```js
        function factorial(n, total = 1) {
            if (n === 1) {
                return total;
            }
            return factorial(n - 1, n * total);
        }
        ```

      - 斐波那契数列

        ```js
        // 0 1 1 2 3 5 8 13 21 ...
        function Fibonacci(n) {
            if (n === 1 || n === 2) {
                return 1;
            }
            return Fibonacci(n - 2) + Fibonacci(n - 1);
        }
        ```

17. 手写发布订阅

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <script>
            // 被观察者要提供一个接受观察者的方法
            // 观察者模式：观察者和被观察者之间是存在关系的，但是发布订阅二者之间是没有关系的
            // 观察者必须要提供一个update方法用来通知状态更新了
            // 被观察者要存入到观察者中
            // 被观察者
            class Subject {
                constructor(name) {
                    this.name = name;
                    this.observers = [];
                    this.state = '默认状态';
                }
                // 提供一个方法存入被观察者
                attach(observer) {
                    this.observers.push(observer);
                }
                // 用来更新自己的状态
                setState(newState) {
                    this.state = newState;
                    // 通知观察者状态更新
                    this.observers.forEach(o => o.update(newState));
                }
            }
            //  观察者
            class Observe {
                update(newState) {
                    console.log('状态更新，', newState);
                }
            }
            let sub = new Subject('小猪');
            let o1 = new Observe();
            let o2 = new Observe();
            sub.attach(o1);
            sub.attach(o2);
            sub.setState('开始吃饭');
        </script>
    </body>
    </html>
    ```

    

18. 请用JavaScript代码实现事件代理

19. 说一下浏览器缓存

20. cookie 与 session 的区别

21. 浏览器如何做到 session 的功能的。

    > **什么是cookie**
    >
    > 

    > **什么是session**
    >
    > https://juejin.cn/post/6844904034181070861#heading-3

22. 写一个处理加法可能产生精度的函数，比如 0.1 + 0.2 = 0.3

    ```js
    /**
    小数点在计算机中是以二进制表示的，而有的小数在计算机中用二进制表示的时候是无穷的，这就出现了上述的现象
    0.1换成二进制就是0.00011(0011无限循环)
    解决办法：将浮点数转为整数，同时乘上一个倍数A,然后加起来在除以这个倍数A，这个倍数应该是这两个数中最小的那个数的倍数，比如0.1和0.02，倍数A等于100
    **/
    function accAdd(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m;
    }
    ```

    

23. 写一个大数相乘的解决方案。传两个字符串进来，返回一个字符串

24. 解释一下：csrf 和 xss

    > xss：跨站脚本攻击，通常将恶意代码注入到网页上，其他用户浏览的时候就会受到影响。
    >
    > 反射型：http://localhost:3000/welcome?type=\<script>alert(1)</script>
    >
    > chrome发现路径存在异常，会有xss屏蔽功能
    >
    > 一般情况下会让cookie在前端不可以获取，并不是xss的解决方案，只是降低受损的范围
    >
    > 转码：encodeURIComponent
    >
    > 不基于后端，DOM-Based，修改属性，插入内容，document.write，改变结构后，会造成攻击，xss payload
    >
    > 可以使用encodeURI转义URL
    >
    > 存储型：恶意的脚本存储到了服务器上，所有人访问时都会造成攻击，比反射型和DOM-Based范围更大。比如，提交评论。
    >
    > 
    >
    > csrf：跨站请求伪造
    >
    > 攻击者盗用你的身份，以你的名义来发送恶意请求，对服务器来说，这个请求是完全合法的。
    >
    > 1. 用户C打开浏览器，访问受信任网站A，输入用户名和密码请求登录网站A；
    > 2. 在用户信息通过验证后，网站A产生Cookie信息并返回给浏览器，此时用户登录网站A成功，可以正常发送请求到网站A；
    > 3. 用户未退出网站A之前，在同一浏览器中，打开一个TAB页访问网站B；
    > 4. 网站B接收到用户请求后，返回攻击性代码，并发出一个请求要求访问第三方站点A；
    > 5. 浏览器在接收到这些攻击性代码后，根据网站B的请求，在用户不知情的情况下携带Cookie信息，向网站A发出请求。网站A并不知道该请求其实是由B发起的，所以会根据用户C的Cookie信息以C的权限处理该请求，导致来自网站B的恶意代码被执行。

25. 怎么防止 csrf 和 xss

    > 防止xss攻击：
    >
    > 1. 客户端发送给服务器时，需要先校验过滤一下
    > 2. 服务端在做一次过滤（转义）
    > 3. 直接在输出的时候过滤
    >
    > 防止csrf攻击：
    >
    > 1. 添加验证码，钓鱼网站是拿不到用户验证码的，除此之外，验证码也可以防止高并发。
    > 2. 服务端判断来源referer，但是这种也不靠谱，因为钓鱼网站可以自己在自己的服务器上来伪造请求
    > 3. 服务端验证token

26. 跨域的处理方案有哪些

    - 表单是不存在跨域问题的

      > 1. form表单提交数据之后，是没有数据返回的，浏览器认为这是无害的，所以不存在跨域问题
      > 2. ajax提交后，会有响应数据，浏览器不允许一个域名下的js读取另外一个域下的js

    - 什么是同源策略

      > 同源策略是浏览器安全的基石，保护用户的信息安全，防止恶意的窃取用户数据。
      >
      > 所谓的“同源”指的是，协议、域名、端口号都相同
      >
      > 如果有一个不相同，就是非同源，在非同源的情况下，以下操作不能进行：
      >
      > 1. 获取cookie、localStorage、indexDB受到限制
      > 2. DOM无法获取
      > 3. Ajax不能正常发送

    - 跨域：协议、域名、端口号都必须要完全相同，否则就会跨域，浏览器会拦截跨域

    - jsonp

      > 百度搜索就是使用的jsonp
      >
      > 用于浏览器同源策略的限制，浏览器只允许请求当前源（协议、域名、端口号都相同）的资源，但是html的script是一个例外，利用script这个开放的策略，网页可以得到从其它源动态产生的json资源。
      >
      > 缺点：不安全，容易遭受xss攻击，只能发送get请求
      >
      > 实现一个jsonp
      >
      > ```js
      > jsonp({
      >     url: 'http://localhost:3000/say',
      >     params:{wd:'我爱你'},
      >     cb:'show'
      > }).then(data=>{
      >     console.log(data);
      > });
      > 
      > function jsonp({url,params,cb}) {
      >     return new Promise((resolve,reject)=>{
      >         let script = document.createElement('script');
      >         window[cb] = function (data) {
      >             resolve(data);
      >             document.body.removeChild(script);
      >         }
      >         params = {...params,cb} // wd=b&cb=show
      >         let arrs = [];
      >         for(let key in params){
      >             arrs.push(`${key}=${params[key]}`);
      >         }
      >         script.src = `${url}?${arrs.join('&')}`;
      >         document.body.appendChild(script);
      >     });
      > }
      > ```

    - cors

      > 特点：
      >
      > 1. 开发中常用，安全性高
      > 2. 后端设置，跟前端没有关系
      > 3. 主要是靠设置头解决跨域
      >
      > 常见的设置头：
      >
      > ```js
      > // 设置哪个源可以访问我
      > res.setHeader('Access-Control-Allow-Origin', origin);
      > // 允许携带哪个头访问我
      > res.setHeader('Access-Control-Allow-Headers','name');
      > // 允许哪个方法访问我
      > res.setHeader('Access-Control-Allow-Methods','PUT');
      > // 允许携带cookie
      > res.setHeader('Access-Control-Allow-Credentials', true);
      > // 预检的存活时间
      > res.setHeader('Access-Control-Max-Age',6);
      > // 允许返回的头
      > res.setHeader('Access-Control-Expose-Headers', 'name');
      > ```

    - postMessage

      > 有一个http://localhost:3000/a.html，其中引入了一个b页面，在4000端口号下面的，在a页面的iframe加载完成之后，执行
      >
      > ```js
      > frame.contentWindow.postMessage('我爱你','http://localhost:4000');// 发送数据给b页面
      > // 监听b页面发送过来的消息
      > window.onmessage = function (e) {
      >     console.log(e.data);
      > }
      > ```
      >
      > b页面
      >
      > ```js
      > window.onmessage = function (e) {
      >     console.log(e.data);
      >     e.source.postMessage('我不爱你',e.origin) // 发送消息给a页面
      > }
      > ```

    - window.name

      > window.name的特点：
      >
      > name值在不同的页面，甚至不同的域下加载后仍然存在，如果不修改则值不会发生变化，并且可以支持非常长的name值（2MB）。
      >
      > 案例：
      >
      > a和b是同域的，http://localhost:3000/
      >
      > c是独立域的 http://localhost:4000/
      >
      > a如果想要获取c数据，那么在a页面中首先要写上 <code><iframe src="http://localhost:4000/c.html" frameborder="0" onload="load()" id="iframe"></iframe></code>
      >
      > 在加载完成之后，执行如下代码：
      >
      > ```js
      > let first = true
      > function load() {
      >     if(first){
      >         let iframe = document.getElementById('iframe');
      >         iframe.src = 'http://localhost:3000/b.html';
      >         first = false;
      >     }else{
      >         console.log(iframe.contentWindow.name);
      >     }
      > }
      > ```
      >
      > 也就是说，a先引用c，再把c的地址改为b。
      >
      > 注意：每个iframe都有自己的window窗口，这个窗口是top window的子窗口。

    - location.hash

      > 路径后面的hash可以用于通信
      >
      > a想要访问c，a给c传递一个hash值，c受到hash值后，把获取到的hash值传递给b，b将结果放到a的hash中
      >
      > a页面：
      >
      > ```js
      > <iframe src="http://localhost:4000/c.html#iloveyou"></iframe>
      > <script>
      >     window.onhashchange = function () {
      >     console.log(location.hash);
      > }
      > </script>
      > ```
      >
      > c页面：
      >
      > ```js
      > let iframe = document.createElement('iframe');
      > iframe.src = 'http://localhost:3000/b.html#idontloveyou';
      > document.body.appendChild(iframe);
      > ```
      >
      > b页面：
      >
      > ```js
      > window.parent.parent.location.hash = location.hash;
      > ```

    - domain

      > 针对两个二级域名之间进行
      >
      > a页面
      >
      > ```js
      > <iframe src="http://b.zf1.cn:3000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
      > <script>
      >     document.domain = 'zf1.cn'
      >     function load() {
      >         console.log(frame.contentWindow.a); // 可以拿到b页面的a变量值
      >     }
      > </script>
      > ```
      >
      > b页面：
      >
      > ```js
      > <script>
      >     document.domain = 'zf1.cn'
      > 	var a = 100;
      > </script>
      > ```

    - websocket

      > websocket本身不存在跨域问题，可以通过websocket实现非同源之间的数据通信，一般采用socket.io实现

    - nginx

27. CORS 是如何做的？

    > 设置各种头

28. 了解 HTTPS 的过程吗？

29. http 与 tcp 的关系

30. tcp 可以建立多个连接吗？

31. 介绍一下为什么要有 三次握手，四次挥手

32. node express生成二维码的插件，<b>svg-captcha</b>

33. 阻止默认的点击事件，<code>e.preventDefault()</code>

34. 对域名的认识

    > 一级域名 www.baidu.com
    >
    > music.baidu.com 二级域名
    >
    > ![域名](https://z3.ax1x.com/2021/04/18/cI7FRU.png)

35. 请求时有时会会出现options，先试探，不会每次都会发送options，时间是可以设置的，max-age

36. 请描述JavaScript中的Scope

37. 列出3种强制类型转换和2种隐式类型转换

    - 概念

      > 将值从一种类型转换为另外一种类型通常称为类型转换，也叫做显式转换，隐式转换也叫做强制类型转换。

38. Object.setPrototypeOf()

    > 创建对象的时候，改变对象的prototype
    >
    > 第一个参数表示被定义的对象，第二个参数该对象新的原型
    >
    > let p = new Person()
    >
    > Object.setPrototypeOf(p, Obj) 等同于 p.\__proto__ = Obj.prototype;

39. JavaScript的深浅拷贝

    > 浅拷贝
    >
    > 如果拷贝的属性是基础类型，那么拷贝的是基础类型的值，如果属性是引用类型，那么拷贝的是属性的内存地址。
    >
    > ```js
    > // 方法1
    > function shalldowCopy(obj) {
    >     let result = {}
    >     for (let k in obj) {
    >         if (obj.hasOwnProperty(k)) {
    >             result[k] = obj[k]
    >         }
    >     }
    >     return result
    > }
    > // 方法2
    > Object.assign()
    > // 方法3
    > ...
    > // 方法4
    > // 数组的concat
    > ```
    >
    > 
    >
    > **浅拷贝和赋值的区别**
    >
    > 赋值：`let b = a;`，这个时候是把a在栈中的地址赋值给b，此时a和b就指向了一块内存空间，它们二者之间是联动的。
    >
    > 赋值操作得到的结果和原数据指向同一对象。
    >
    > 浅拷贝：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，拷贝前后对象的引用类型共享一块内存，会互相影响。 
    >
    > 浅拷贝得到的结果和原数据不是指向同一对象。
    >
    > <hr>
    > 深拷贝
    >
    > 将对象从内存中完整的拷贝一份出来，并且在堆中开辟一个新的区域存放这个新对象，修改原对象不会影响新对象，反之亦然。
    >
    > ```js
    > // 方法1
    > function deepCopy(obj) {
    >     let result = {}
    >     if (obj instanceof RegExp) return new RegExp(obj)
    >     if (obj instanceof Date) return new Date(obj)
    >     if (typeof obj !== 'object' || obj === null) return obj
    >     for (let k in obj) {
    >         if (obj.hasOwnProperty(k)) {
    >             result[k] = deepCopy(obj[k])
    >         }
    >     }
    >     return result
    > }
    > // 方法2
    > JSON.parse(JSON.stringify()) // 但是这种方式有问题，遇到有日期类、函数类、正则类属性时，失效
    > // 方法3
    > $.extend()
    > // 方法4
    > lodash的deepClone
    > ```

40. instanceof

    > a instanceof b
    >
    > b的prototype是否在a的原型链上

41. 数组扁平化的几种方式

    ```js
    // 方法1
    let arr = [1, [2,3], [4,5,6]];
    console.log(arr.flat(Infinity))
    // 方法2
    let arr = [1, [2,3], [4,5,6]];
    let result = []
    function flat(arr) {
        if (!Array.isArray(arr)) return result.push(arr)
        arr.forEach(item => {
            if (Array.isArray(item)) {
                flat(item)
            } else {
                result.push(item)
            }
        })
        return result
    }
    flat(arr)
    console.log(result)
    // 方法3
    let arr = [1, [2, 3], [4, 5, 6]];
    function flat(arr) {
        return arr.reduce((pre, cur) => {
            return pre.concat(cur)
        }, [])
    }
    console.log(flat(arr))
    ```

    

42. 谈谈JS的运行机制

    > 单线程：同一时间做同一件事情
    >
    > JavaScript是一门单线程语言
    >
    > 为什么js不是多线程？
    >
    > 比如页面中有一个dom元素，一个线程删除此dom节点，另外一个线程给节点添加样式，就不知道听谁的，所以js一开始就被设计为了单线程。
    >
    > js虽然是单线程，但是有同步和异步的概念，这就解决了阻塞的问题。
    >
    > 同步：在一个函数返回的时候，就能够得到预期结果，就好比`console.log()`
    >
    > 异步：在函数返回的时候调用者还得不到预期的结果，而是通过一定手段得到，如setTimeout
    >
    > 同步任务：在主线程排队执行的任务，只有前一个任务执行完成，才能执行后一个任务
    >
    > 异步任务：不进入主线程，进入专门存放异步任务的事件表里面，当同步任务执行完毕之后，在执行异步任务
    >
    > 浏览器会在一个宏任务执行完成之后，下一个微任务执行之前进行页面的渲染
    >
    > 宏任务（macrotask）：script脚本代码、setTimeout、setInterval、文件读写I/O
    >
    > 微任务（microtask）：promise.then、process.nextTick
    >
    > 先执行宏任务，没有宏任务就从事件队列中获取，在执行微任务
    >
    > 在执行代码的过程中，遇到微任务，将它添加到微任务的任务队列中。
    >
    > ```js
    > async function async1() {
    >     console.log('async1 start')
    >     await async2()
    >     console.log('async1 end')
    > }
    > async function async2() {
    >     console.log('async2')
    > }
    > console.log('script start')
    > setTimeout(() => {
    >     console.log('setTimeout')
    > }, 0);
    > async1()
    > new Promise(function(resolve) {
    >     console.log('promise1')
    >     resolve()
    > }).then(function() {
    >     console.log('promise2')
    > })
    > console.log('script end')
    > ```
    >
    > 注意：promise中的异步体现在then和catch中，所以写在promise中的代码是被当做同步任务立即执行的。
    >
    > 在async、await中，在出现await之前，其中的代码也是立即执行的。
    >
    > await做了什么？
    >
    > await等待的是一个表达式，这个表达式的返回值可以是promise对象也可以是其它值。
    >
    > 很多人认为await会一直等待表达式执行完毕之后再去继续执行后面的代码，实际上await是一个让出线程标识。
    >
    > await后面的表达式会先执行一遍，将await后面的代码加入到微任务队列中，然后就会跳出整个async函数来执行后面的代码。
    >
    > async await本身是promise+generator的语法糖，所以await后面的代码是microtask。
    >
    > ```js
    > async function async1() {
    >   console.log('async1 start')
    >   await async2()
    >   setTimeout(() => {
    >     console.log('setTimeout1')
    >   }, 0)
    > }
    > async function async2() {
    >   setTimeout(() => {
    >     console.log('setTimeout2')
    >   }, 0)
    > }
    > console.log('script start')
    > setTimeout(() => {
    >   console.log('setTimeout3')
    > }, 0);
    > async1()
    > new Promise(resolve => {
    >     console.log('promise1')
    >     resolve()
    >   })
    >   .then(() => {
    >     console.log('promise2')
    >   })
    > console.log('script end')
    > ```
    >
    > 

43. arguments

    > 类数组对象，有length属性
    >
    > 如何转化为数组
    >
    > 1. ...，为什么 `... `可以转化？
    >
    > 2. Array.from
    >
    > 3. Array.prototype.slice.call()
    >
    > argument对象没有箭头函数

44. 为什么在调用这个函数的时候，`b`会变成一个全局变量

    ```js
    function func() {
        let a = b = 0;
        // 上面这行代码相当于
        let a = (b = 0);
        // 执行到这行代码的时候，引擎会发现b这个变量没有声明，于是在全局中创建一个b变量
    }
    ```

    

45. V8引擎的垃圾回收机制

    > JavaScript具有自动的垃圾回收机制，也就是说执行环境会管理代码运行过程中使用的内存。

    > 这种垃圾回收机制的原理是：找出那些不在继续使用的变量，然后释放其占用的内存。为此，垃圾回收器会按照固定的时间间隔（或者代码执行中预订的收集时间），周期性的执行这一操作。

    > 局部变量只在函数执行过程中存在，在这个过程中，会为局部变量在栈或者堆内存上分配空间，以便存储他们的值。

46. 哪些操作会造成内存泄露？

    > 1. 闭包
    >
    > 2. 意外的全局变量
    >
    > 3. 被遗忘的定时器
    >
    > 4. 脱离dom的引用
    >
    >    ```js
    >    // dom 元素移除，但 对 dom 元素的引用没有解除，会导致内存泄漏。
    >    // 解决办法：手工移除。elements.button = null
    >    
    >    var elements = {
    >    	button: document.getElementById('button'),
    >    	image: document.getElementById('image')
    >    }
    >    
    >    function doStuff() {
    >        image.src = 'http://some.url/image';
    >        button.click();
    >        console.log(text.innerHTML);
    >    }
    >    
    >    function removeButton() {
    >        document.body.removeChild(document.getElementById('button'));
    >        // 虽然我们用removeChild移除了button, 但是还在elements对象里保存着#button的引用
    >        // 换言之, DOM元素还在内存里面.
    >    }
    >    ```
    >
    >    

47. js延迟加载的方式有哪些？

48. 什么是高阶函数？

49. 输入一个正数N，输出所有和为N的连续正数序列

    ```js
    // 例如，输入15
    // 结果，[[1,2,3,4,5], [4,5,6], [7, 8]]
    ```

    

50. JavaScript中几个优雅的运算符使用技巧

    ```js
    // ?.
    let a = null;
    a?.name // 等价于 a && a.name
    
    // 注意：一个nullish值要么是null要么是undefined
    // ?? 运算符
    undefined ?? 2 // 2
    null ?? 2 // 2
    0 ?? 2 // 0
    true ?? 2 // true
    false ?? 2 // false
    
    undefined || 2 // 2
    null || 2 // 2
    0 || 2 // 2
    true || 2 // true
    false || 2 // 2
    // 所以，对于 ?? 来说，只有当值1位null或者undefined时候，才会返回值2
    // 对于 || 来说，只有当值1为false才会返回值2
    
    // &&=
    x &&= y // 等价于 x && (x = y) 只有当左侧为真的时候才赋值
    
    // ||=
    x ||= y // 等价于 x || (x = y)
    document.getElementById('search').innerHTML ||= '<i>No posts found matching this search.</i>'
    
    ```

    

51. js是如何存储的

    ```js
    var a = 111111111111111110000,
    b = 1111;
    var c = a + b;
    console.log(c) ? 111111111111111110000
    // 在JavaScript中number类型以64位存储。
    // 64位中有符号位1位，指数位11位，实数位52位
    // 2的53次方是最大值，值为：9007199254740992
    // 超过这个值，运算结果就不正确
    ```

    

52. 数组比较大小

    ```js
    var a = [1, 2, 3],
        b = [1, 2, 3],
        c = [1, 2, 4]
    
    console.log(a == b) // false
    console.log(a === b) // false
    console.log(a > c) // false
    console.log(a < c) // true
    // 引用类型比较大小是按照字典顺序比较，就是先比较第一项，相同在比较第二项，以此类推。
    ```

    

53. 数组的原型是什么？

    ```js
    Array.isArray(Array.prototype) // true
    // 数组的原型是数组
    // 对象的原型是对象
    // 函数的原型是函数
    ```

    

54. 谈谈JS的垃圾回收机制

55. instanceof的原理

    ```js
    A instanceof B // 判断A是不是在B的原型链上，A是实例，B是构造函数
    
    // 类型的判断
    // typeof
    console.log(typeof null) // object
    console.log(typeof undefined) // undefined
    console.log(typeof 1) // number
    console.log(typeof '1') // string
    console.log(typeof true) // boolean
    console.log(typeof new Date()) // object
    console.log(typeof /\d/) // object
    console.log(typeof []) // object
    console.log(typeof {}) // object
    console.log(typeof function() {}) // function
    // typeof只能判断除了null之外的简单数据类型，在判断复杂类型的时候，除了function之外都为object，无法正确区分
    
    //instanceof
    let num = new Number(1)
    let num2 = 1
    let reg = new RegExp(/\d/)
    let reg2 = /\d/
    let str = new String('1')
    let str2 = '1'
    console.log(num instanceof Number) // true
    console.log(num2 instanceof Number) // false
    console.log(reg instanceof RegExp) // true
    console.log(reg2 instanceof RegExp) // true
    console.log(str instanceof String) // true
    console.log(str2 instanceof String) // false
    console.log(null instanceof Object) // false
    console.log(new Date() instanceof Date) // true
    // 对于简单数据类型来说，如果声明方式不是构造函数声明的方式，那么使用instanceof判断失效
    // 对于复杂数据类型可以判断出来
    // 注意，由于原型链最后都是Object，有时候会导致判断模糊，例如下面
    // [] instanceof Object // true
    
    // 实现instanceof
    // 实现原理：如果 实例.__proto__ === 构造函数.prototype，则它们在一条原型链上
    function MyInstanceOf(left, right) {
        let leftProto = left.__proto__
        let rightPrototype = right.prototype
        while(true) {
            if (leftProto == null) {
                return false
            }
            if (leftProto === rightPrototype) {
                return true
            }
            leftProto = leftProto.__proto__
        }
    }
    
    // toString
    // 每个对象的原型上面都有一个toString方法，这是最常用的，也是最准确的
    ```

    

56. 给DOM打断点

    > 审查元素，定位到想要打断点的元素，右键，break on，有选项subtree modifications、attributes modifications，根据自己的需要勾选，当dom元素属性或者增加删除子节点的时候，会自动定位到是哪一行js代码导致的更改。

57. get请求参数长度

    - http协议没有规定get和post的长度限制
    - get的最大长度是因为浏览器和web服务器限制了url的长度
    - 不同的浏览器和web服务器限制的长度不一样
    - 要支持IE，则最大长度为2083字节，如果支持chrome，最大长度为8182字节

58. get请求和post请求在缓存方面的区别

    > 1. get请求类似于查找的过程，用户获取数据，可以不用每次都与数据库连接，所以可以使用缓存
    > 2. post不同，post做的一般都是修改和删除的事情，所以必须要与数据库交互，所以不适合使用缓存。

59. 说说前端中的事件流

    > **事件流的几个阶段**
    >
    > **事件冒泡**
    >
    > > 事件从最深的节点开始，然后逐步向上传播事件。
    > >
    > > 比如div下面有ul，ul下面有li，li下面有a，如果给a添加click事件，那么会冒泡到最上面的div上面。
    > >
    > > <mark>如何取消事件冒泡？</mark>
    > >
    > > ```js
    > > event.stopPropagation() || event.cancelBubble = true(// 兼容IE) // 只阻止事件往上冒泡
    > > return false // 不仅阻止了事件往上冒泡，而且阻止了事件本身（默认事件）
    > > ```
    > >
    > > 
    >
    > **事件捕获**
    >
    > > 从上到下执行，像石头一样沉入海底。
    > >
    > > 如何控制事件在冒泡阶段执行还是在捕获阶段执行？
    > >
    > > 使用addEventListener注册事件，第一个参数是事件名，第二个参数是回调函数，第三个参数默认为false，表示在冒泡阶段触发，如果设置为true，表示在捕获阶段触发。
    >
    > **事件委托（事件代理）**
    >
    > > 原理是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。
    > >
    > > 为什么要用事件委托？
    > >
    > > 当页面中很多个dom需要绑定同一个事件时，如果单独给每一个dom绑定事件，会很消耗性能，因为需要不断的与dom节点进行交互，访问dom的次数越多，引起浏览器重绘和回流的次数也就越多，影响页面的性能。
    > >
    > > 比如页面上ul元素下面有1000、10000个li，我们需要给li添加点击事件，获取当前li的内容，如果不采用事件为委托的方式注册事件，就得采用传统的获取到每一个li，然后单独给每一个li添加事件。
    > >
    > > 每一个函数又是一个对象，是对象就得占用内存，如果绑定的函数过多，那么占用的内存就会越多，综上，当我们需要处理一类dom的事件的时候，借助事件委托是最好的选择。
    > >
    > > ```js
    > > window.onload = function () { 
    > >     var oUl = document.getElementById("ul1"); 
    > >     oUl.onclick = function (ev) { 
    > >         var ev = ev || window.event; 
    > >         var target = ev.target || ev.srcElement; 
    > >         if (target.nodeName.toLowerCase() == 'li') { 
    > >             alert(123); 
    > >             alert(target.innerHTML); 
    > >         } 
    > >     } 
    > > }
    > > ```
    > >
    > > <mark>如果动态新增一个节点，那么这个节点还具备这个事件吗？</mark>
    > >
    > > 如果采用传统的方式，对于新增节点需要再次循环遍历绑定事件。采用事件委托则不用做处理，这样就可以大大的减少dom的操作。
    >
    > 
    >
    > **mouseover和mouseenter的区别**
    >
    > > - mouseover：当鼠标移入元素或者其子元素的时候都会触发该事件，有一个重复触发，冒泡的过程。对应的移除事件是<code>mouseout</code>
    > > - mouseenter：当鼠标移入元素本身会触发，移入到子元素的时候不会触发，也就是不会冒泡，对应的移除事件是<code>mouseleave</code>

60. js的new操作符做了哪些事情

    ```js
    // Object.create(null) // 产生的是一个空对象，没有原型链
    // 注意如果new的构造函数本身有返回值，且返回值是一个对象，则new之后拿到的结果是这个对象
    // 1、返回构造函数的一个实例对象
    // 2、内部创建了一个空对象，空对象的__proto__指向构造函数的prototype
    // 3、构造函数内部的this指向这个空对象
    // 4、给这个空对象绑定属性
    function Animal(type) {
        this.type = type;
    }
    Animal.prototype.say = function() {}
    
    function mockNew() {
        let obj = {}
        let Contructor = [].shift.call(arguments);
        obj.__proto__ = Contructor.prototype;
        let r = Contructor.apply(obj, arguments);
        return r instanceof Object ? r : obj
    }
    
    let a = mockNew(Animal, 'dog')
    console.log(a)
    ```

    

61. js中各种位置的区别

    > [点击查看](https://www.jianshu.com/p/110626e6caf4)

62. 实现js的拖拽功能

    ```js
    // 拖拽的流程
    // 1. 当鼠标在被拖拽元素上按下的时候开始拖拽
    // 2. 鼠标移动的时候，被拖拽元素随着鼠标一起移动
    // 3. 当鼠标松开的时候，被拖拽元素固定在当前位置
    
    // demo1
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style type="text/css">
        .box1 {
          height: 200px;
          width: 400px;
          border: 1px solid red;
        }
    
        .box2 {
          width: 400px;
          height: 200px;
          border: 1px solid rebeccapurple;
        }
    
        img {
          width: 200px;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div class="box1" ondragstart="dgstart1(event)" ondrop="drop(event)" ondragover="dgover(event)"></div>
      <br>
      <div class="box2" ondrop="drop2(event)" ondragover="dgover2(event)">
        <img id="img" ondragstart="dgstart(event)" draggable="true" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=117985501,3237328278&fm=26&gp=0.jpg" alt="">
      </div>
    
      <script>
        function dgstart(ev) {
          ev = ev || window.event;
          ev.dataTransfer.setData('imgId', ev.target.id);
        }
    
        function dgstart1(ev) {
          ev = ev || window.event;
          ev.dataTransfer.setData('imgId2', ev.target.id);
        }
    
        function dgover(ev) { // 这里一定要阻止默认事件，否则不会触发ondrop事件
          ev.preventDefault();
        }
    
        function dgover2(ev) {
          ev.preventDefault();
        }
    
        function drop(ev) {
          ev.preventDefault();
          const imgId = ev.dataTransfer.getData('imgId');
          document.querySelector('.box1').appendChild(document.getElementById(imgId));
        }
    
        function drop2(ev) {
          const imgId = ev.dataTransfer.getData('imgId2');
          console.log(222, imgId)
          document.querySelector('.box2').appendChild(document.getElementById(imgId));
        }
      </script>
    </body>
    </html>
    
    // demo2
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .wrapper {
          width: 600px;
          height: 400px;
          margin: auto;
          display: flex;
          justify-content: space-between;
        }
    
        .box1, .box2 {
          width: 300px;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
    
        .box1 {
          border: 1px solid red;
        }
    
        .box2 {
          border: 1px solid greenyellow;
        }
    
        .circle {
          width: 100px;
          height: 100px;
          background-color: red;
          border-radius: 50%;
        }
      </style>
    </head>
    
    <body>
      <div class="wrapper">
        <div class="box1" ondrop="drop1(event)" ondragover="dgover(event)">
          <div class="circle" id="circle1" ondragstart="dgstart(event)" draggable="true"></div>
          <div class="circle" id="circle2" ondragstart="dgstart(event)" draggable="true"></div>
          <div class="circle" id="circle3" ondragstart="dgstart(event)" draggable="true"></div>
          <div class="circle" id="circle4" ondragstart="dgstart(event)" draggable="true"></div>
          <div class="circle" id="circle5" ondragstart="dgstart(event)" draggable="true"></div>
        </div>
        <div class="box2" ondrop="drop(event)" ondragover="dgover(event)"></div>
      </div>
    
      <script>
        function dgstart(ev) {
          ev.dataTransfer.setData('circleId', ev.target.id);
        }
    
        function dgover(ev) {
          ev.preventDefault();
        }
    
        function drop(ev) {
          ev.preventDefault();
          const circleId = ev.dataTransfer.getData('circleId');
          document.querySelector('.box2').appendChild(document.getElementById(circleId));
        }
    
        function drop1(ev) {
          ev.preventDefault();
          const circleId = ev.dataTransfer.getData('circleId');
          document.querySelector('.box1').appendChild(document.getElementById(circleId));
        }
      </script>
    </body>
    
    </html>
    ```

    

63. call的原理

    ```js
    // 可以改变this指向
    // 调用函数会立即执行
    function fn1(name, age) {
        console.log(1, name, age)
    }
    function fn2() {
        console.log(2)
    }
    Function.prototype.call = function(context) {
        context = context ? Object(context) : window;
        context.fn = this;
        let args = [];
        for (let i = 1; i < arguments.length; i++) {
            args.push(`arguments[${i}]`);
        }
        const r = eval(`context.fn(${args})`)
        delete context.fn;
        return r;
    }
    fn1.call(fn2, 'xiaoming', 11);
    fn1.call.call.call(fn2);
    ```

    

64. apply的原理

    ```js
    // 可以改变this指向
    // 调用函数立即执行，参数是数组
    function fn1(name, age) {
        console.log(1, name, age)
    }
    function fn2(name) {
        console.log(2, name)
    }
    Function.prototype.apply = function(context, args) {
        context = context ? Object(context) : window;
        context.fn = this;
        if (!args) return eval(`context.fn()`);
        if (!Array.isArray(args)) {
            throw TypeError('CreateListFromArrayLike called on non-object');
        }
        let arr = []
        for (let i = 0;i < args.length; i++) {
            arr.push(`args[${i}]`);
        }
        const r = eval(`context.fn(${arr})`);
        delete context.fn;
        return r;
    }
    fn1.apply(fn2)
    fn1.apply(fn2, ['xiaoming', 11])
    fn1.apply.apply(fn2, ['xiaohua'])
    ```

    

65. bind的原理

    ```js
    // 使用bind绑定之后，并不会立即执行，而是返回一个新的方法，我们需要执行新的方法
    // 可以绑定this指向
    // bind本身就是一个高阶函数
    // bind函数第一个参数是上下文，第二个之后的参数的需要绑定传递的参数，这些参数也可以在其返回函数调用的时候传递
    // 如果绑定的函数的返回值函数被new了，当前绑定函数的this就是当前的实例
    // new出来的结果可以找到原有类(构造函数)的原型
    
    Function.prototype.bind = function(context) {
        // 保存绑定函数
        const that = this;
        // 获取bind函数的参数
        const bindArgs = [].slice.call(arguments, 1);
        function Fn() { // bind是一个高阶函数
            // 返回值函数也可以传递参数
            const args = Array.prototype.slice.call(arguments);
            // 执行绑定函数，并传入参数，如果绑定的函数的返回值函数被new了，当前绑定函数的this就是当前的实例
            return that.apply(this instanceof Fn ? this : context, bindArgs.concat(args));
        }
        // new出来的结果可以找到原有构造函数的原型
        const Tn = function() {}
        Tn.prototype = that.prototype;
        Fn.prototype = new Tn();
        // 这里避免这样写：Fn.prototype = that.prototype; 如果这样写，当在Fn的原型对象上扩展方法的时候，会污染绑定函数的原型，且构不成一个完整的原型链，采取上面这种写法，Fn的原型对象相当于是一个实例对象，在实例对象上添加属性和方法不会影响绑定函数的原型，且构成了一个原型链
        return Fn;
    }
    ```

    

66. 变量提升

67. 说说js中的词法作用域

68. ES6模块和CommonJS模块的差异

69. 给数字增加逗号分割

    ```js
    // for 循环实现
    function splitNum(num) {
        num = String(num);
        if (num.length <= 3) return Number(num);
        let result = '';
        for (let i = 1; i <= num.length; i++) {
            result += num[i - 1];
            if (i % 3 === 1) {
                result += ',';
            }
        }
        return result.slice(-1) === ',' ? result.slice(0, -1) : result;
    }
    // while 循环实现
    function splitNum(num) {
        num = String(num);
        if (num.length <= 3) return Number(num);
        let result = '', i = 1;
        while(i <= num.length) {
        	result += num[i - 1];
            if (i % 3 === 1) {
                result += ',';
            }
            i++;
        }
        return result.slice(-1) === ',' ? result.slice(0, -1) : result;
    }
    ```

    

70. 实现一个reduce方法

    ```js
    // reduce方法的第二个参数哪怕是undefined，也会当做初始化值使用
    Array.prototype.reduce = function(fn, initValue) {
        if (fn === null) throw TypeError(`null is not function`);
        if (fn === undefined) throw TypeError(`undefined is not function`);
        if (Array.prototype.toString.call(fn) !== "[object Function]") {
            if (typeof fn === 'object') {
                throw TypeError(`${Array.prototype.toString.call(fn)} is not function`);
            }
            throw TypeError(`${fn} is not function`);
        }
        let pre = 0, idx = 0;
        if (arguments.length === 1) { // 没有传递initValue，此时pre的值为数组的第1个元素，索引要从1开始
            pre = this[0];
            idx = 1;
        }
        if (arguments.length > 1) { // 说明传递了initValue，此时pre的值为initValue
            pre = initValue;
            idx = 0;
        }
        for (let i = idx; i < this.length; i++) {
            pre = fn(pre, this[i], i, this);
        }
        return pre;
    }
    ```

    

71. 手写一个Ajax

    ```js
    const ajax = {
        get: function(url, cb) {
            let xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else { // 兼容IE5、IE6
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            // xhr.open有三个参数，第三个参数表示是否异步，true表示异步，false表示同步
            xhr.open('get', url, false);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) { // 请求完成
                    if (xhr.status === 200 || xhr.status === 304) {
                        cb(xhr.responseText);
                    }
                }
            }
            xhr.send();
        },
        post: function(url, data, cb) {
            let xhr = null;
            if (XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            xhr.open('post', url, false);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 304) {
                        cb(xhr.responseText);
                    }
                }
            }
            xhr.send(data);
        }
    }
    
    // promise版
    const ajax = {
        get: function(url) {
            const promise = new Promise((resolve, reject) => {
                let xhr = null;
                if (XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.open('get', url, false);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) { // 请求完成
                        if (xhr.status === 200 || xhr.status === 304) {
                            resolve(xhr.responseText);
                        } else {
                            reject('error');
                        }
                    }
                }
                xhr.send();
            });
            return promise;
        },
        post: function(url, data) {
            const promise = new Promise((resolve, reject) => {
                let xhr = null;
                if (XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                xhr.open('post', url, false);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) { // 请求完成
                        if (xhr.status === 200 || xhr.status === 304) {
                            resolve(xhr.responseText);
                        } else {
                            reject('error');
                        }
                    }
                }
                xhr.send(data);
            });
            return promise;
        }
    }
    ```

    

72. 实现一个JSON.stringify

    > ### 概念解释
    >
    > JSON.stringify([,replacer,[,space]])方法是将一个 JavaScript 值(对象或者数组)转换为一个 JSON 字符串。此处模拟实现，不考虑可选的第二个参数 replacer 和第三个参数 space
    >
    > 转换规则如下：
    >
    > - 基本数据类型
    > - undefined 转换之后仍是 undefined(类型也是 undefined)
    > - boolean 值转换之后是字符串 "false"/"true"
    > - number 类型(除了 NaN 和 Infinity)转换之后是字符串类型的数值
    > - symbol 转换之后是 undefined
    > - null 转换之后是字符串 "null"
    > - string 转换之后是字符串 string
    > - NaN 和 Infinity 转换之后是字符串 "null"
    > - 如果是函数类型
    > - 转换之后是 undefined
    > - 如果是对象类型(非函数)
    > - 如果有 toJSON()方法，那么序列化 toJSON()的返回值
    > - 如果是一个数组，如果属性值中出现了 undefined、任意的函数以及 symbol，转换成字符串"null"
    > - 如果是 RegExp 对象，返回{}(类型是 string)
    > - 如果是 Date 对象，返回 Date 的 toJSON 字符串值
    > - 如果是普通对象
    >   - 如果属性值中出现了 undefined、任意的函数以及 symbol 值，忽略
    >   - 所有以 symbol 为属性键的属性都会被完全会忽略掉
    > - 对包含循环引用的对象(对象之间相互引用，形成无限循环)执行此方法，会抛出错误
    >
    > **代码实现**
    >
    > ```js
    > if (!window.JSON) {
    >   window.JSON = {
    >     parse: function (sJSON) {
    >       return eval("(" + sJSON + ")");
    >     },
    >     stringify: (function () {
    >       var toString = Object.prototype.toString;
    >       var isArray =
    >         Array.isArray ||
    >         function (a) {
    >           return toString.call(a) === "[object Array]";
    >         };
    >       var escMap = {
    >         '"': '\\"',
    >         "\\": "\\\\",
    >         "\b": "\\b",
    >         "\f": "\\f",
    >         "\n": "\\n",
    >         "\r": "\\r",
    >         "\t": "\\t",
    >       };
    >       var escFunc = function (m) {
    >         return (
    >           escMap[m] ||
    >           "\\u" + (m.charCodeAt(0) + 0x10000).toString(16).substr(1)
    >         );
    >       };
    >       var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
    >       return function stringify(value) {
    >         if (value == null) {
    >           return "null";
    >         } else if (typeof value === "number") {
    >           return isFinite(value) ? value.toString() : "null";
    >         } else if (typeof value === "boolean") {
    >           return value.toString();
    >         } else if (typeof value === "object") {
    >           if (typeof value.toJSON === "function") {
    >             return stringify(value.toJSON());
    >           } else if (isArray(value)) {
    >             var res = "[";
    >             for (var i = 0; i < value.length; i++)
    >               res += (i ? ", " : "") + stringify(value[i]);
    >             return res + "]";
    >           } else if (toString.call(value) === "[object Object]") {
    >             var tmp = [];
    >             for (var k in value) {
    >               if (value.hasOwnProperty(k))
    >                 tmp.push(stringify(k) + ": " + stringify(value[k]));
    >             }
    >             return "{" + tmp.join(", ") + "}";
    >           }
    >         }
    >         return '"' + value.toString().replace(escRE, escFunc) + '"';
    >       };
    >     })(),
    >   };
    > }
    > ```
    >
    > 

73. 实现一个JSON.parse

    ```js
    // 使用eval，但是此方法存在xss漏洞，需要对传入的json做校验
    function parse(json) {
        return eval('(' + json + ')')
    }
    
    // Function
    var jsonStr = '{ "age": 20, "name": "jack" }'
    // new Function(arg1, arg2, ..., functionBody) 返回一个新的函数arg1、arg2等依次作为最后一个参数函数体的形参
    var json = (new Function('return ' + jsonStr))();
    ```

    

74. forEach、for、for...of、for...in

    > - forEach、map 无法跳出循环
    > - for、while、for...of可以通过break跳出
    > - [优化地图](https://juejin.cn/post/6844903639635623949)

    

75. 冒泡排序

    ```js
    let arr = [1,2,9,73,54,9]
    
    for (let i = 0; i < arr.length - 1; i++) { // 轮数
        for (let j = 0; j < arr.length - 1 - i; j++) { // 次数
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    
    console.log(arr)
    ```

    

76. Set、Map、weakSet、weakMap

    ```js
    // Set
    // add
    // delete
    // has
    // forEach
    
    // 注意：set集合可以存放引用类型，但是不建议，根据引用类型的地址判断的
    // [...集合] 可以把集合转为数组
    
    // 字符串去重
    let str = 'hello world'
    console.log([...new Set(str)].join(''))
    
    let a = new Set([1, 2, 3]);
    let b = new Set([4, 3, 2]);
    // 并集
    console.log(new Set([...a, ...b]))
    
    // 交集
    console.log(new Set([...a].filter(x => b.has(x))))
    
    // 差集(a相对b)
    console.log(new Set([...a].filter(x => !b.has(x))))
    
    // Map
    // set
    // get
    // size
    // has
    // delete
    // forEach、for...of，forEach循环拿到的每一项是value，for...of循环拿到的每一项是[key: value]
    let map = new Map();
    
    // 面试题：console.log(['2', '3', '4'].map(parseInt)); [2, NaN, NaN]
    // map循环会给parseInt注入两个参数item, index，但是parseInt有两个参数，第一个参数表示被解析的值，第二个参数表示解析的目标进制数，所以应该修改为如下：console.log(['2', '3', '4'].map(item => parseInt(item, 10)));
    
    // weakMap、weakSet
    // 键只能是对象
    // 二者与Set、Map的区别如下：
    // 1. WeakSet中的元素和和WeakMap中的key都只能是对象类型(WeakMap的value可以是任意类型)；
    // 2. WeakSet和WeakMap都没有size属性；
    // 3. WeakSet和WeakMap都没有clear方法；
    // 4. WeakSet和WeakMap都不可以遍历所包含的元素；
    ```

    

77. window.onload和$(document).ready()区别

    > - window.onload： 用0级事件绑定·只能绑定一个函数-是在页面中包含图片在内的所有元素全部加载完成后再执行
    >
    > - $(document).ready()用2级事件绑定的 监听DOMContentLoaded事件实现的，可以绑定多个函数:页面DOM结构渲染完成后执行
    > - **因此$(document).ready()执行快于window.onload执行；**

78. 模块化

    > 发展历史
    >
    > 最原始的写法，在一个js文件很多变量，声明很多个函数，容易造成全局污染，命名冲突。
    >
    > 采用命名空间的形式，虽然可以有效避免，但是不安全，可以通过对象点属性的形式修改属性。
    >
    > IIFE（立即执行函数）
    >
    > 引入依赖

    > 为什么需要模块化？
    >
    > 减少关联性、部署方便、解耦

    > 模块化带来的问题？
    >
    > 依赖模糊、请求过多、难以维护

    > 模块化规范？
    >
    > CommonJS（node）、AMD、CMD（阿里，使用的不多）、ES6
    >
    > CommonJS：每一个文件指的是js文件
    >
    > 暴露的本质是exports，module.exports本身是一个{}
    >
    > exports与module.exports
    >
    > https://www.cnblogs.com/fayin/p/6831071.html

79. 判断对象为空

    ```js
    function judge(value) {
        return value && Object.keys(value).length && value.contructor === 'Object'
    }
    // 因为在JavaScript中有9个内置构造函数，例如，new String().length === 0 // true
    
    // 数据类型分类
    // 在最版本的JS标准中，数据类型分为了8类，包括
    // 7种基本数据类型，undefined、null、string、boolean、number、symbol(es新增)、bigint(es10新增)
    // 1种引用类型，包括function、array、date等
    ```

    

80. var let const 区别

    ```js
    // let 与 const 声明的全局变量不会挂载到顶层对象window的下面，但是var声明的全局变量会
    // let 与 const 声明的变量不存在变量提升，var声明的变量会进行变量提升
    // let 与 const 声明的变量不可重复声明，但是var声明的变量可以重复声明，但是后面的会覆盖前面的
    // let 与 var 声明变量可以不立即进行赋值，但是const声明的变量必须立即进行赋值
    
    // 临时死区（TDZ  Temporal dead zone）
    /* 
    	let 与 const声明的变量不会被提升，如果在声明之前访问这些变量会报错。
    这是因为JavaScript引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部（遇到var声明），要么将它们放在TDZ中（遇到let与const声明）。访问TDZ中的变量会触发报错。
    只有执行过变量声明的语句之后，变量才会从TDZ中移除，然后才可以访问。
    */
    
    // let在循环中会形成块级作用域
    
    // let到底有没有进行提升
    let a = 1
    {
        a = 2
        let a
    }
    // 上面的代码会报错，这也说明了let声明会进行提升，如果不会进行提升，那么a=2会将a=1修改，所以let提升了， 但是由于TDZ的存在，不能在let声明之前使用变量。
    ```

    

81. 定时器为什么是不精确的?

    ```js
    /*
    1. 首先,我们知道 setInterval 的运行机制,setInterval 属于宏任务,要等到一轮同步代码以及微任务执行完后才会走到宏任务队列,但是前面的任务到底需要多长时间,这个我们是不确定的.
    
    2. 等到宏任务执行,代码会检查 setInterval 是否到了指定时间,如果到了,就会执行 setInterval,如果不到的话,那就要等到下次 EventLoop 重新判断
    
    3. 当然,还有一部分不确定因素,比如 setInterval 的时间戳小于 10ms,那么会被调整至 10ms 执行,因为这是 setInterval 设计以及规定,当然,由于其他任务的影响,这个 10ms 也会不精确.
    
    4. 还有一些物理原因,如果用户使用的设备处于供电状态等,为了节电,浏览器会使用系统定时器,时间间隔将被调整至 16.6ms
    */
    ```

    

82. js数组对象的去重

    ```js
    // 针对数组 arr 去重
    let arr = [
        {
            code: 'test_code',
            name: '1'
        },
        {
            code: 'test_code-2'，
            name: '2'
        },
        {
            code: 'test_code',
            name: 'test1'
        }
    ]
    
    let obj = {}
    arr = arr.reduce((prev, next) => {
        obj['code'] ? '' : obj['code'] = true && prev.push(next)
        return prev
    }, [])
    ```

    

83. 说一下Taro编译原理

    > taro:buld xxx是执行编译的命令，根据不同的参数，把代码编译成h5、小程序、react native等

    > 编译步骤：
    >
    > 1. 先解析，将代码解析成抽象语法树
    > 2. 然后对AST进行遍历和替换
    > 3. 最后是生成，根据新的AST生成编译后的代码

    > 如何做到一套代码，在不同平台执行的？
    >
    > 无论h5、小程序还是RN都有一个共同的部分：
    >
    > 都可以将源代码作为纯文本解析为抽象语法树的数据结构
    >
    > 当源代码解析为AST后，根据不同的平台的语法树规则，产生对应平台的语法树，然后产生代码。
    >
    > 这样就可以做到同一套代码可以在不同平台运行。

    

84. 原生js实现图片懒加载的思路

    ```js
    // 为什么要对图片进行懒加载
    // 可以节省带宽、提升网页性能，实质是当图片进入可见区域内的时候才进行加载，否则不加载，也可以给一个默认的图片占位
    
    // 方法1 采用交叉观测器 IntersectionObserver
    // InterSectionObserver是浏览器原生提供的构造函数，用来自动观测目标元素是否出现在可见区域内
    // 该构造函数接受两个参数 callback、option
    // callback：可见性发生改变时触发的回调函数
    // option是配置对象，可选
    // 构造函数的返回值是一个观测器实例
    // 实例上的observer方法表示开始观测
    // 实例上的unobserver表示停止观测
    
    function lazyLoad(imgs) {
        // ioes 是 IntersectionObserverEntry对象，保存着目标元素的信息
        const io = new IntersectionObserver(ioes =>  {
            ioes.forEach(ioe => {
                const img = ioe.target
                const intersectionRatio = ioe.intersectionRatio
                // intersectionRatio 为0时，表示完全不可见，为1时，表示完全可见
                if (intersectionRatio > 0 && intersectionRatio <= 1) {
                    if (!img.src) {
                        img.src = img.dataset.src
                    }
                }
                img.onload = img.onerror = (img) => io.unobserver(img)
            })
        })
        imgs.forEach(img => io.observer(img))
    }
    
    const imgs = document.querySelectorAll(img)
    lazyLoad(imgs)
    
    // 提供一个定时器版本的节流函数
    function throttle(func, wait) {
        let timer = null
        return function(...args) {
            if (!timer) func(...args)
            timer = setTimeout(() => {
                timer = null
            }, wait)
        }
    }
    
    // 方法2 利用 getBoundingClientRect()
    // 这个方法用于获取某个元素相对于视口的位置集合，集合中包含了 top、right、bottom、left、width、height、x、y属性
    
    function lazyLoad2(imgs) {
        // 判断是否在视口，且img没有src属性
        function isIn(el) {
            const bound = el.getBoundingClientRect();
            const clientHeight = window.innerHeight;
            return bound.top <= clientHeight + 100;
        }
        Array.from(imgs).forEach(function (img) {
          if (isIn(img) && !img.src) {
            img.src = img.dataset.src;
          }
        });
    }
    
    window.onload = window.onscroll = function() {
        throttle(lazyLoad2, 200)(imgs)
    }
    
    // 方法3 H + S > offsetTop
    function lazyLoad1(imgs) {
        //offsetTop是元素与offsetParent的距离，循环获取直到页面顶部
        function getTop(e) {
            var T = e.offsetTop;
            while ((e = e.offsetParent)) {
                T += e.offsetTop;
            }
            return T;
        }
        var H = document.documentElement.clientHeight; //获取可视区域高度
        var S = document.documentElement.scrollTop || document.body.scrollTop;
        Array.from(imgs).forEach(function (img) {
            // +100 提前100个像素就开始加载
            // 并且只处理没有src即没有加载过的图片
            if (H + S + 100 > getTop(img) && !img.src) {
                img.src = img.dataset.src;
            }
        });
    }
    const throttleLazyLoad1 = throttle(lazyLoad1, 200);
    
    window.onload = window.onscroll = function() {
        throttleLazyLoad1(imgs)
    }
    ```

    

85. 手写实现用es6的Proxy实现`arr[-1]`的访问

    ```js
    // 什么是负索引
    // 比如 arr[-1]等价于arr[arr.length - 1]，arr[-2]等价于arr[arr.length - 2]
    
    ```

    

86. setInterval

    ```js
    // setInterval的弊端
    1. 在定时器的内部，即使程序抛错，定时器仍然不会结束，会继续执行
    2. setInterval无视网络延迟，容易造成请求堆积。在使用ajax轮询服务器是否有新数据的时候，有时候使用setInterval，但是当遇到网络比较差的时候，在上一次的请求还没有返回响应结果，下一次的请求又发送出去了，最后导致的结果就是请求堆积
    3. setInterval并不定时，当调用的代码执行时间小于定时设置的时间，会跳过执行
    
    // 使用setTimeout模拟实现setInterval
    function myInterval(fn, time) {
        let timer = null
        function interval() {
           fn()
            timer = setTimeout(interval, time)
        }
        interval()
        myInterval.clear = () => {
            clearTimeout(timer)
        }
    }
    
    // 使用setInterval模拟实现setTimeout
    function myTimeout(fn, time) {
        const timer = setInterval(() => {
            clearInterval(timer)
            fn()
        })
    }
    ```

    

87. Object.is

    ```js
    // 判断两个参数是不是同一个值
    Object.is(value1, value2) // 如果二者相同，返回true，否则返回false
    // example
    Object.is(1,1) // true
    Object.is(null,null) // true
    Object.is(undefined,undefined) // true
    Object.is({},{}) // false
    Object.is([],[]) // false
    Object.is(NaN,NaN) // true
    Object.is(+0,-0) // false
    
    
    // 实现自己的Object.is方法
    Object.is = function(arg1, arg2) {
        // 针对 Object.is 需要注意两点
        // 1. NaN和NaN相比是true，但是 使用 === 比较是 false
        // 2. +0 和 -0 相比是false，使用 === 比较是 true
        if (Number.isNaN(arg1) && Number.isNaN(arg2)) {
            return true
        }
        if (1 / arg1 === Infinity && 1 / arg2 === -Infinity) { // 利用 Infinity 和 -Infinity相比是false的原理
            return false
        }
        return arg1 === arg2
    }
    ```

    

88. isNaN和Number.isNaN函数的区别

    - isNaN接受到参数后，会尝试将参数转换为数字，如果可以转化，则返回`false`，如果不能转化或者传入的参数是字符串等，返回`true`，这种判断不准确
    - Number.isNaN函数接收到参数后，首先会判断传入的参数是否为数字，如果是数字在继续判断是否为NaN，这种判断方法会更加准确，该方法只在参数为NaN的时候才会返回true

89. 什么情况下会发生隐式强制类型值的转换

    > （1） if (..) 语句中的条件判断表达式。（2） for ( .. ; .. ; .. ) 语句中的条件判断表达式（第二个）。（3） while (..) 和 do..while(..) 循环中的条件判断表达式。（4） ? : 中的条件判断表达式。（5） 逻辑运算符 ||（逻辑或）和 &&（逻辑与）左边的操作数（作为条件判断表达式）。

90. 封装一个js的类型判断函数

    ```js
    function getType(value) {
        if (value === null) {
            return null + ''
        }
        if (typeof value === 'object') {
            let type = Object.prototype.toString.call(value) // 获取诸如 [object Date]
            type = type.split(' ')[1].split('') // 获取诸如 Date]
            type.pop() // 把最后一个 ] 去除，获取诸如 Date
            return type.join('').toLowerCase() // 结果转化为小写
        } else { // 处理基本数据类型和函数
            return typeof value
        }
    }
    
    console.log(getType(111)) // number
    console.log(getType(true)) // boolean
    console.log(getType({})) // object
    console.log(getType([])) // array
    console.log(getType(/\d/)) // regexp
    console.log(getType(new Date())) // date
    console.log(getType(function () { })) // function
    console.log(getType(null)) // null
    console.log(getType(undefined)) // undefined
    console.log(getType(Symbol())) // symbol
    ```

    

91. 什么是堆、什么是栈、他们之间的区别和联系

    > 堆和栈用来存储变量数据的
    >
    > JavaScript的数据类型分为基本数据类型和引用数据类型
    >
    > 基本数据类型包括：undefined、null、number、string、boolean、symbol
    >
    > 引用数据类型包括：function、object、date、regexp等
    >
    > 基本数据类型存储在栈中的，引用数据类型的地址存储在栈中，它们的值存储在堆内存中。
    >
    > JavaScript的代码运行的时候，都是在执行上下文中执行的
    >
    > **执行上下文**
    >
    > 每当JavaScript代码执行的时候，都是在执行上小文中执行的
    >
    > **执行上下文的类型**
    >
    > - 全局执行上下文
    >
    >   > 这是一个默认的或者说是基础的上下文，任何不在函数中的代码都在这个全局上下文中，全局上下文只有一个，全局上下文干了两件事：
    >   >
    >   > - 创建一个全局的window对象
    >   > - 让this指向这个全局的window对象
    >
    > - 函数执行上下文
    >
    >   > 当函数被调用的时候会创建一个新的函数执行上下文，函数执行上下文可以有任意多个，但是注意只有在函数被调用的时候才会创建
    >
    > - eval函数执行上下文
    >
    >   > eval函数内部的代码也会有自己的上下文
    >
    > **执行栈**
    >
    > > 执行栈也叫做调用栈
    > >
    > > 用来存储执行上下文的
    > >
    > > JS引擎在执行我们的脚本的时候，首先会创建一个全局执行上下文，并且把这个上下文压入执行栈中
    > >
    > > 后续当JS引擎遇到函数调用的时候，就会创建一个函数执行上下文，并且把这个上下文放到栈的顶部
    > >
    > > JS引擎会从栈顶依次执行上下文函数，执行完毕后，会弹出栈顶
    > >
    > > 一旦所有代码执行完毕，JS引擎从当前执行栈移除全局执行上下文
    >
    > **怎么样创建执行上下文**
    >
    > > 创建执行上下文分为两个阶段
    > >
    > > - 创建阶段
    > > - 执行阶段
    > >
    > > 创建阶段干了三件事
    > >
    > > - this指向的确定
    > > - 创建词法环境组件
    > > - 创建变量环境组件
    >
    > **2**

92. 输出结果

    ```js
    // 第一题
    var length = 10
    function f1() {
        console.log(this.length)
    }
    var obj = {
        x: 10,
        f2: function(f1) {
            f1()
            arguments[0]()
        }
    }
    obj.f2(f1,1,2,3)
    // 以上的输出结果为：100  4
    
    
    // 第二题
    function f(something) {
        console.log(this.a, something)
        return this.a + something
    }
    
    var obj = {
        a: 2
    }
    
    var f2 = function() {
        f()
        return f.apply(obj, arguments)
    }
    
    var b = f2(3)
    console.log(b)
    // 以上的输出结果为：
    undefined  undefined
    2  3
    5
    ```

    

93. 实现一个你认为不错的js继承方式

    ```js
    <script>
    // 实现一个你认为不错的 js 继承方式
    function Parent(name) {
      this.name = name;
        // console.log('name', name, this.name) // undefined undefined
        this.say = () => {
           console.log(111, this.name);
    	};
    }
    Parent.prototype.play = () => {
        console.log(222);
    };
    function Children(name) {
        Parent.call(this); // 借用构造函数继承
        this.name = name;
    }
    
    // Object.create(prototype, descriptors) 第二个参数可选
    // 创建一个 具有指定原型的 属性可选择的 对象
    // 也就是说 新创建的对象的 __proto__ 指向第一个参数原型对象
    Children.prototype = Object.create(Parent.prototype);
    // 上面这行代码一写，可以把 Children.prototype 看成一个整体 作为一个实例对象看待 而实例对象的constructor指向构造函数 但是我们
    // 并不希望它指向继承的构造函数，希望指向自己，所以才有了下面这句
    
    // console.log(Children.prototype === Parent.prototype) // false
    Children.prototype.constructor = Children;
    // console.log(Children.prototype.constructor === Parent) // true
     
    // console.log(Children.prototype.__proto__ === Parent.prototype) // true
    
    // 为什么下面这种写法，会污染Parent的原型，而采用上面这种 Object.create的写法就不会???
    // 下面这种写法，内存地址一样
    // Children.prototype = Parent.prototype
    // console.log(Children.prototype === Parent.prototype) true
    // Children.prototype.test = function() {}
    // console.log(Parent.prototype.test())
    
    
    let child = new Children("111");
    // console.log(child.constructor === Children.prototype) // false
    // console.log(child.constructor === Children) // true 实例对象的constructor指向 其构造函数
    console.log(child.name);
    child.say();
    child.play();
    
    //console.log(child instanceof Parent)
    // 以上实现了混合继承
    </script>
    ```

    

94. 实现数组扁平化

    ```js
    // 实现数组的扁平化
    let arr = [1,2,3,[5,6,7, [10,12, [100]]]]
    
    Array.prototype.mflat = function(tier) {
        let that = this, count = 1, result = []
        function fn(arr) {
            if (tier === Infinity) {
                for (let i = 0; i < arr.length; i++) {
                    if (Array.isArray(arr[i])) {
                        fn(arr[i])
                    } else {
                        result.push(arr[i])
                    }
                }
            } else {
                for (let i = 0; i < arr.length; i++) {
                    if (count <= tier) {
                        if (Array.isArray(arr[i])) {
                            count++
                            fn(arr[i])
                        } else {
                            result.push(arr[i])
                        }
                    } else {
                        result.push(arr[i])
                    }
                }
            }
        }
        fn(that)
        return result
    }
    ```

    

95. 实现自己的发布订阅

    ```js
    <script>
        // 实现自己的发布订阅
        // 提供四个方法 on（订阅）、off（取消订阅）、once（订阅一次）、emit（派发）
        class EventEmitter {
            constructor() {
                this.events = {}
            }
    
            on(type, cb) {
                if (!this.events[type]) {
                    this.events[type] = [cb]
                } else {
                    this.events[type].push(cb)
                }
            }
            once(type, cb) {
                function fn() {
                    cb()
                    this.off(type, fn)
                }
                this.on(type, fn)
            }
            off(type, cb) {
                if (!this.events[type]) return
                this.events[type] = this.events[type].filter(item => item !== cb)
            }
            emit(type, ...rest) {
                if (!this.events[type]) return
                this.events[type].forEach(item => item.apply(this, rest))
            }
        }
    
    const event = new EventEmitter();
    
    const handle = (...rest) => {
        console.log(rest);
    };
    
    event.on("click", handle);
    
    event.emit("click", 1, 2, 3, 4);
    
    event.off("click", handle);
    
    event.emit("click", 1, 2);
    
    event.once("dbClick", () => {
        console.log(123456);
    });
    event.emit("dbClick");
    event.emit("dbClick");
    </script>
    ```

    

96. 遍历dom树

    ```js
    // 遍历指定元素下所有的子元素
    
    ```

    

97. 实现一个模板字符串解析的功能

    ```js
    let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
    let data = {
      name: '姓名',
      age: 18
    }
    render(template, data); // 我是姓名，年龄18，性别undefined
    
    
    // 实现代码
    function render(template, data) {
      let computed = template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
        return data[key];
      });
      return computed;
    }
    ```

    

98. 用es5实现数组去重

    ```js
    function unique(arr) {
        let result = []
        // array 代表原始数组
        result = arr.filter((item, index, array) => {
            return array.indexOf(item) === index
        })
        return result
    }
    
    console.log(unique([1,2,1,2]))
    
    // 采用es6实现
    [...new Set([1,2,1,2])]
    ```

    

99. 解析url参数为对象

    ```js
    // 实现1
    function parseurl(url) {
        url = url || location.search
        url = url.slice(1) // 去除 ? ，name=test&age=10
        let arr = url.split('&') // [name=test, age=10]
        let result = {}
        arr.forEach(item => {
            const temp = item.split('=')
            const value = decodeURIComponent(temp[1]) // 解码
            result[temp[0]] = /^\d+$/g.test(value) ? parseFloat(value) : value
        })
        return result
    }
    
    console.log(parseUrl())
    
    // 实现2
    function getParams(name) {
        const {search} = location
        const params = new URLSearchParams(search)
        return params.get(name)
    }
    ```

    

100. 实现Object.assign

     ```js
     // 用法
     // 把可枚举属性从多个源对象上拷贝到目标对象，并返回目标对象
     // 该方法属于浅拷贝 Object() 也可以做到浅拷贝
     // target不能是null或者undefined
     Object.assign(target, ...source)
     
     // 实现
     Object._assign = function(target, ...source) {
         if (target == null) {
             throw new TypeError('target is not undefined or null')
         }
         target = Object(target) // ?...
         source.forEach(item => {
             if (item != null) {
                 for (let key in item) {
                     if (item.hasOwnProperty(key)) {
                         target[key] = item[key]
                     }
                 }
             }
         })
         return target
     }
     ```

     

101. 实现数组的原型方法

     ```js
     // 实现数组的 forEach
     // 实现数组的 map
     // 实现数组的 filter
     // 实现数组的 some
     // 实现数组的 reduce
     ```

     

102. 继承

     ```js
     // 原型链继承
     // 借用构造函数实现继承
     // 组合继承
     // 寄生式组合继承
     
     继承分为接口继承和实现继承
     js不支持接口继承，只支持实现继承，而且实现继承主要是依靠原型链实现的
     PS：接口继承只继承方法签名，实现继承则继承实际的方法
     
     // 构造函数、原型、实例的关系
     每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的指针。
     如果我们让原型对象等于另外一个实例，此时的原型对象将包含一个指向另外一个原型的指针，另外一个原型中也包含一个指向另外一个构造函数的指针，如此层层递进，就构成了原型链。
     
     JavaScript主要通过原型链实现继承，原型链的构建是通过将一个类型的实例赋值给另外一个构造函数的原型实现的。
     
     所有引用类型默认都继承了Object，这个继承也是通过原型链实现的
     所有函数的默认原型都是Object的实例，因此默认原型都有一个内部指针，指向Object.prototype，这也正是所有自定义类型都会继承toString()、valueof()等默认方法的原因
     
     确定原型和实例的关系
     1. instanceof // A instanceof B 判断A是否在B的原型链上
     2. isPrototypeOf // B.prototype.isPropertyOf(instance) 判断B的原型链是否包含instance实例
     
     通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做会重写原型链。
     
     原型链的终点：Object.prototype.__proto__ = null
     
     继承是通过将超类型的实例赋值给子类型的原型实现的
     
     // 原型链继承
     function SuperType() {
         this.property = true
     }
     SuperType.prototype.getSuperValue = function() {
         return this.property
     }
     
     function SubType() {
         this.subproperty = false
     }
     SubType.prototype.getSubValue = function() {
         return this.subproperty
     }
     
     SubType.prototype = new SuperType()
     // 原型链继承存在的问题
     // 1. 在超类型构造函数中定义一个引用类型的属性，子类型构造函数继承超类型构造函数后，如果子类型的实例1修改了超类型中实例属性值，那么也会在子类型实例2中体现出来
     // 2. 在创建子类型的实例时，不能向超类型的构造函数中传递参数
     
     // 为了解决引用类型属性的问题，引出了借用构造函数继承（也叫做经典继承）
     // 就是在子类型的构造函数中调用超类型
     function SuperType() {
         this.colors = [1,2,3]
     }
     SuperType.prototype.say = function() {
         console.log('say hello')
     }
     
     function SubType() {
         SuperType.call(this)
     }
     
     let sub1 = new SubType()
     sub1.colors.push(100)
     console.log(sub1.colors) // [1,2,3,100]
     
     let sub2 = new SubType()
     console.log(sub2.colors) // [1,2,3]
     sub2.say() // 报错
     // 借用构造函数继承的缺点：
     // 在超类型原型上定义的方法对子类型不可见
     
     // 为了兼容以上，出现了混合继承
     // 即原型链继承和借用构造函数继承
     function SuperType() {
         this.property = true
         this.colors = [1,2,3]
     }
     SuperType.prototype.say = function() {
         return 'say hello'
     }
     function SubType() {
         SuperType.call(this)
         this.subproperty = false
     }
     SubType.prototype = new SuperType()
     SubType.prototype.constructor = SubType
     
     let sub1 = new SubType()
     let sub2 = new SubType()
     
     sub1.colors.push(100)
     
     console.log(sub2.say()) // say hello
     console.log(sub1.colors) // [1,2,3,100]
     console.log(sub2.colors) // [1,2,3]
     
     // 原型式继承
     // 在函数内部，先创建了一个临时的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时类型的一个新的实例
     function object(obj) {
         function F() {}
         F.prototype = obj
         return new F()
     }
     let person = {
         name: 'xiaoming',
         friends: ['xiaohua', 'xiaoli']
     }
     
     let anotherPerson = object(person)
     anotherPerson.friends.push('xiaoguang')
     
     let yetAnotherPerson = object(person)
     yetAnotherPerson.friends.push('xiaodong')
     
     console.log(person.friends) // ['xiaohua', 'xiaoli', 'xiaoguang', 'xiaodong']
     
     // 注意，es6新增的方法 Object.create()方法规范了原型式继承，也可以用于浅拷贝
     
     // 寄生组合继承
     // 组合继承最大的问题在于不论什么时候，都会两次调用超类型构造函数，一次是在创建子类型原型的时候，一次在子类型构造函数内部
     // 寄生组合继承就是为了解决组合继承的这个问题
     function inheritPrototype(subType, superType) {
         // 第一步创建超类型原型的一个副本
         let prototype = object(superType.prototype)
         // 第二步为创建的副本添加constructor属性，从而弥补因为重写原型而失去的默认的constructor属性
         prototype.constructor = subType
         // 最后一步，将新创建的对象赋值给子类型的原型
         subType.prototype = prototype
     }
     function SuperType(name) {
         this.name = name
         this.colors = [1,2,3]
     }
     SuperType.prototype.sayName = function() {
         console.log(this.name)
     }
     function SubType(name, age) {
         SuperType.call(this, name)
         this.age = age
     }
     inheritPrototype(Subtype, SuperType)
     SubType.prototype.sayAge = function() {
         console.log(this.age)
     }
     
     // es6的继承和es5的继承有什么区别
     1. ES5的继承时通过prototype或构造函数机制来实现。ES5的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.apply(this)）。
     
     2. ES6的继承机制完全不同，实质上是先创建父类的实例对象this（所以必须先调用父类的super()方法），然后再用子类的构造函数修改this。
     
     3. 具体的：ES6通过class关键字定义类，里面有构造方法，类之间通过extends关键字实现继承。子类必须在constructor方法中调用super方法，否则新建实例报错。因为子类没有自己的this对象，而是继承了父类的this对象，然后对其进行加工。如果不调用super方法，子类得不到this对象。
     
     ps：super关键字指代父类的实例，即父类的this对象。在子类构造函数中，调用super后，才可使用this关键字，否则报错。
     ```

     

103. js为什么要用纯函数

     - 相同的输入一定产生相同的输出
     - 没有副作用（包括但不限于：进行http请求、输出到屏幕或者控制台、dom查询/操作、获取当前时间、Math.random()）
     - 不依赖外部的变量
     - 如果纯函数调用纯函数，不产生副作用满足纯函数的定义仍然是纯函数
     - 优点：没有副作用、可以减少bug的产生，方便调试，减少耦合，它的输出只与输入有关

104. js元编程的应用场景

     > 概念：可以生成代码、可以在程序运行的时候修改语言结构

105. Cookie、sessionStorage、localStorage的区别

106. Cookie如何防范XSS攻击

107. 实现let、const

     ```js
     let a; // 不报错
     const a; // 报错，const声明必须立即初始化
     
     // 实现let
     // 定义一个仅作用于该代码块的变量
     (function() { var a = 10; console.log(a); })
     console.log(a) // 报错
     
     // 实现const
     // const声明一个只读的变量，一旦声明需要立即赋值，而且值不能修改
     // 核心用到 Object.defineProperty 拦截
     var _const = function(data, value) {
         window[data] = value
         Object.definePoperty(window, data, {
           enumberable: false, // 设置为不可枚举
           configurable: false, // 不可删除
           get: function() {
               return window[data]
           },
           set: function(setValue) {
               if (setValue !== value) {
                   throw new TypeError('const不能被再次赋值')
               } else {
                   return value
               }
           }
         })
     }
     ```

     

108. 写一个方法去除字符串中的空格

     ```js
     const str = ' h lo wedd   ed '
     const POSITION = Object.freeze({
         left: Symbol(),
         right: Symbol(),
         both: Symbol(),
         center: Symbol(),
         all: Symbol()
     })
     
     function trim(str, position = POSITION.both) {
         // !! 与  ! 的区别
         // !! 常常在做类型判断的时候使用，省去了多次判断undefined、null、''的冗余代码
         if (!!POSITION[position]) throw new Error('unexpected position value')
         switch (position) {
             case (POSITION.left):
               str = str.replace(/^\s+/, '')
               break;
             case (POSITION.right):
               str = str.replace(/\s+$/, '')
               break;
             case (POSITION.both):
               str = str.replace(/^\s+/, '').replace(/\s+$/, '')
               break;
             case (POSITION.center):
               while (str.match(/\w\s+\w/)) {
                 str = str.replace(/(\w)(\s+)(\w)/, `$1$3`)
               }
               break;
             case (POSITION.all):
               str = str.replace(/\s/g, '')
               break;
             default:
           }
           return str
         }
     }
     
     const result = trim(str, POSITION.all)
     console.log(result)
     ```

     

109. Object.freeze

     ```js
     // 用来冻结一个对象
     // 一个被冻结的对象不能被修改，也不能新增属性，不能修改已有的属性值，不能删除属性
     // 不能修改对象属性的可枚举性、可配置性
     
     let person = {
         name: 'xiaoming',
         age: 10
     }
     let p = Object.freeze(person)
     
     delete p.name // 无法删除
     delete person.name // 无法删除
     
     // 实现 Object.freeze
     function _freeze(obj) {
         if (obj instanceof obj) {
             Object.seal(obj) // 封闭对象
             for (let key in obj) {
                 Object.defineProperty(obj, key, {
                     writable: false
                 })
                 _freeze(obj[key])
             }
         }
     }
     ```

     

110. Object.seal

     ```js
     // 封闭一个对象
     // 被封闭的对象不能新增属性，不能删除属性
     // 注意，当前属性的值只要原来是可写的就可以改变
     
     // demo1
     let person = {
         name: 'xiaoming',
         age: 10
     }
     
     let p = Object.seal(person)
     console.log(p === person) // true
     console.log(Object.isSealed(person)) // true
     
     delete p.name // 无效
     p.name = 'xxx' // 可修改
     
     // demo2
     let person = {
         age: 10
     }
     
     Object.defineProperty(person, 'name', {
         writable: false, // 设置不可修改
         value: 10
     })
     
     let p = Object.seal(person)
     console.log(p === person) // true
     console.log(Object.isSealed(person)) // true
     
     delete p.name // 无效
     p.name = 'xxx' // 无效
     ```

     

111. 写一个把字符串大小写切换的方法

     ```js
     function caseConvert(str) {
         return str.replace(/([a-z]*)([A-Z]*)/g, (x, $1, $2) => {
             return `${$1.toUpperCase()}${$2.toLowerCase()}`
         })
     }
     caseConvert('qinPlus13')
     ```

     

112. 写一个方法把下划线命名转成大驼峰命名

     ```js
     function strToCamel(str){
         return str.replace(/(^|_)(\w)/g,(m,$1,$2)=>$2.toUpperCase());
     }
     ```

     

113. js中delete删除对象的属性之后，会不会释放内存

     ```js
     // delete删除属性只是解除了对象和属性的绑定关系，当删除的属性值为对象时，删除时会造成内存泄露（其实还未删除）
     
     let person = {
         name: {
             firstname: 'xxx'
         }
     }
     // let p = person.name
     delete person.name // 如果对象的属性的值是一个引用类型，delete之后，如果这个属性没有被其它变量引用过，那么在适当的时候，JS引擎会GC它
     // 但是如果被其它变量引用，delete会造成内存泄露，即使设置为null也不行
     
     // 变量不能被delete
     let x = 1
     delete x
     console.log(x) // 1
     
     // 普通函数也无法delete
     function bar() {}
     delete bar
     console.log(bar) // f bar() {}
     ```

     

114. js哪些操作会引起内存泄露

     ```js
     
     ```

     

115. 如何获取html元素实际的样式值

     ```js
     function getStyle(el, name) {
         if (!!el) {
             let css = null
             css = window.getComputedStyle ? window.getComputedStyle(el) : el.currentStyle
             // currentStyle 为了兼容IE11以下的版本
     		return name ? css[name] : css
         }
     }
     console.log(getStyle(document.getElementById('box'), 'width'))
     ```

     

116. 如何对字符串版本号构成的数组进行排序

     ```js
     const arr = [
         '1.1',
         '2.3.3',
         '4.3.5',
         '0.3.1',
         '0.302.1',
         '4.20.0',
         '4.3.5.1',
         '1.2.3.4.5'
     ];
     
     // 找出版本号的最大位数
     const maxLen = (arr) => {
         return Math.max(...arr.map(item => item.split('.').length))
     }
     
     const gen = (version) => {
         // acc 起始值 current 当前正在遍历的那个元素 index 当前那个元素的索引 array 原数组
         return version.split('.').reduce((acc, current, index, array) => {
             return acc + (+current) * Math.pow(10000, maxLen - index - 1)
         }, 0)
     }
     
     arr.sort((a, b) => {
     	return gen(a) - gen(b) // 升序
     })
     // 原理就是把每一项都放大到相同倍数
     ```

     

117. 为什么Promise比setTimeout快

118. Object中的key是有序的吗

     ```js
     // 不一定是有序的
     
     // 1. 如果对象的key是number类型，则按照key的大小顺序输出
     // 2. 如果key是数字字符串，则按照key的大小顺序输出
     // 3. 如果key有number类型，有字符串类型，则先把number类型的key按照从大到小的顺序输出，其它类型的key按照定义时的顺序输出，PS：1.3 小数类型的key也当做其它类型去处理
     
     // 如何让对象按照key的顺序输出呢？
     // 如果是类整数的key，可以先把key转换成非整数类型的字符串
     // 给每个key后面加 . 转换成字符串
     let obj = {
         '-1.': 'test-1',
         '1.': 'test1',
         '0.': 'test0'
     }
     for (let key in obj) {
         console.log(~~key, obj[key]) // ~~ 表示转换成整数
     }
     
     // 如果key是由各种数据类型混合的，那就不能直接转换成整数了，可以这么做
     let obj = {
         '.a': '.a',
         '.我': '.我',
         '.1': '.1',
         '.1.3': '.1.3'
     }
     
     for (let key in obj) {
         // 从第1个字符取原始的key
         console.log(key.substring(1), obj[key]);
     }
     ```

     

119. typeof的原理是什么

     > 不同的对象在底层都表示为二进制，在JavaScript中二进制前三位都是0的话会被判断为object类型，null的二进制全部为0，自然前三位也是0，所以执行typeof时会返回object
     >
     > 在JavaScript的最初版本中，使用的是32位系统，为了性能考虑使用低位存储了变量的类型信息：
     >
     > 000：对象
     >
     > 1：整数
     >
     > 010：浮点数
     >
     > 100：字符串
     >
     > 110：布尔

120. ‘1’.toString()为什么可以调用

     ```js
     // 在运行过程中做了如下几件事
     var s = new String('1')
     s.toString()
     s = null
     ```

     

121. js中类型转换有哪几种

     > - 转换成数字
     > - 转换成布尔值
     > - 转换成字符串

122. 对象转原始类型是根据什么流程运行的

     ```js
     let obj = {
         value: 3,
         valueOf() {
             return 4
         },
         toString() {
             return '5'
         },
         [Symbol.toPrimitive]() {
             return 6
         }
     }
     console.log(obj = 1)
     
     // 如果对象内部存在 Symbol.toPrimitive() 方法，则优先调用
     // 如果不存在，则检查是否存在 valueOf()，如果存在则调用
     // 如果不存在，则检查是否存在 toString()，如果存在则调用
     
     let obj = {
         value: 1
     }
     console.log(obj + 1) // [object Object]1
     // 调用toString方法
     ```

     

123. 如何让 if (a == 1 && a == 2) 成立

     ```js
     var a = {
       value: 0,
       valueOf: function() {
         this.value++;
         return this.value;
       }
     };
     console.log(a == 1 && a == 2);//true
     ```

     

124. forEach中return有效果吗？如何终止forEach循环？

     ```js
     // 在forEach中使用return无效
     // 解决办法
     // 1. 使用try监视代码块，在需要中断的地方抛出异常
     // 2. 官方推荐：用every和some方法替换forEach，every在遇到return false的时候退出循环，some在遇到return true的时候退出循环
     ```

     

125. 箭头函数

     ```js
     箭头函数没有this，里面的this会指向当前最近的非箭头函数的this，找不到就是window（严格模式下是undefined）
     let obj = {
       a: function() {
         let do = () => {
           console.log(this);
         }
         do();
       }
     }
     obj.a(); // 找到最近的非箭头函数a，a现在绑定着obj, 因此箭头函数中的this是obj
     ```

     

126. load和DOMContentLoaded的区别

     > DOMContentLoaded只要dom加载完成就执行
     >
     > load需要等到dom、css、js、img全部执行完毕才会触发
     >
     > jQuery有三种针对文档加载的方法：
     >
     > ```js
     > $(document).ready(function() {})
     > // 等价于下面这种
     > $(function() {}) // dom加载完成触发
     > 
     > $(document).load(function() {}) // 所有的都记载完毕才执行
     > ```
     >
     > 

127. 数据是如何存储的

     > 

128. prototype和proto的区别

     > prototype是构造函数才有，指向构造函数的原型对象，是显示原型
     >
     > proto属于隐式原型，构成原型链
     >
     > proto是实例对象所有，查找一个实例对象上的属性的时候，会优先从自身查找，如果找不到沿着原型链依次向上查找，直至找到原型链的终点 Object.prototype.\__proto__
     >
     > 实例对象的proto指向其构造函数的原型对象
     >
     > Object.create(null) 创建出的对象没有proto

129. 说一下对 BigInt 的理解，在什么场景下会使用？

     > BigInt 是内置对象
     >
     > 表示大于 2^53 - 1的整数
     >
     > Number可表示的最大整数是 2^53 - 1
     >
     > BigInt 可以表示任意大的整数
     >
     > 可以在一个整数字面量后面 加 `n`来表示这是一个BigInt类型的整数，或者调用函数BigInt()
     >
     > 不能和Number实例混合计算
     >
     > 应用场景：科学计算和金融
     >
     > ```js
     > BigInt(false) // 0n
     > BigInt(true) // 1n
     > // 必选传递一个整数类型的参数
     > ```
     >
     > 

130. 浏览器的本地存储的cookie了解多少

131. 浏览器的本地存储的webStorage了解多少

132. 能不能说一说CSRF攻击

133. 能不能说一说CSS攻击

134. 一个 dom 必须要操作几百次，该如何解决，如何优化?

     > 缓存DOM对象
     >
     > 比如在循环之前就将节点获取并缓存到内存中，在循环内部直接引用，而不是重新查询
     >
     > 文档碎片
     >
     > - document.createDocumentFragment创建的文档碎片是个虚拟节点对象，对他的操作不会影响真实dom，对他进行频繁操作，操作完成在一次性的添加到真实的dom中
     > - 把需要复杂操作的元素复制一个副本cloneNode，在内存中进行操作在替换旧的
     >
     > 使用innerHtml代替高频的appendChild
     >
     > 虚拟dom：虚拟dom本质是一个js对象，dom diff之后最后在批量更新真实的dom结构
     >
     > 把可能导致重绘的操作放到requestAnimationFrame中，浏览器空闲的时候去处理

135. 说说你对懒加载的理解？

     > 懒加载也叫做延迟加载，指的是在长网页中延迟加载图像，是一种很好的优化网页性能的方式。
     >
     > 在某些情况下，还可以帮助减少服务器负载，适用于图片很多，页面很长的电商网站场景中。
     >
     > 能提升用户的体检。不妨设想下，用户打开像手机淘宝长页面的时候，如果页面上所有的图片都需要加载，由于图片数目较大，等待时间很长，用户难免会心生抱怨，这就严重影响用户体验 减少无效资源的加载，这样能明显减少服务器的压力和流量，也能够减少浏览器的负担 防止并发加载的资源过多会阻塞 js 的加载，影响网站的正常使用。
     >
     > **懒加载的原理**
     >
     > 首先将页面上的图片的src属性设置为空，图片的真实路径存在img的data-src中，当页面滚动的时候需要去监听scroll事件，在scroll的回调中，判断我们的懒加载的图片是否进入可视区域，如果图片在可视区域内就将img的data-src设置在src上，这样就可以实现懒加载。
     >
     > ```js
     > <html lang="en">
     > <head>
     >  <meta charset="UTF-8" />
     >  <title>Lazyload</title>
     >  <style>
     >    .image-item {
     >      display: block;
     >      margin-bottom: 50px;
     >      /* 一定记得设置图片高度 */
     >      height: 200px;
     >    }
     >  </style>
     > </head>
     > 
     > <body>
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/1.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/2.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/3.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/4.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/5.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/6.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/7.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/8.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/9.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/10.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/11.png"
     >  />
     >  <img
     >    src=""
     >    class="image-item"
     >    lazyload="true"
     >    data-original="images/12.png"
     >  />
     >  <script>
     >    var viewHeight = document.documentElement.clientHeight; //获取可视区高度
     >    function lazyload() {
     >      var eles = document.querySelectorAll("img[data-original][lazyload]");
     >      Array.prototype.forEach.call(eles, function (item, index) {
     >        var rect;
     >        if (item.dataset.original === "") return;
     >        rect = item.getBoundingClientRect(); // 用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
     >        if (rect.bottom >= 0 && rect.top < viewHeight) {
     >          (function () {
     >            var img = new Image();
     >            img.src = item.dataset.original;
     >            img.onload = function () {
     >              item.src = img.src;
     >            };
     >            item.removeAttribute("data-original"); //移除属性，下次不再遍历
     >            item.removeAttribute("lazyload");
     >          })();
     >        }
     >      });
     >    }
     >    lazyload(); //刚开始还没滚动屏幕时，要先触发一次函数，初始化首页的页面图片
     >    document.addEventListener("scroll", lazyload);
     >  </script>
     > </body>
     > </html>
     > ```
     >
     > 

136. 图像预加载

     > **什么是预加载**
     >
     > 资源预加载是另外一个性能优化的技术，我们可以使用该技术预先告知浏览器某些资源在未来可能会用到。
     >
     > 预加载简单来说就是将所有所需的资源提前请求加载到本地，这样后面在需要用到的时候直接从缓存中取出资源。
     >
     > **为什么要用预加载**
     >
     > 在网页全部加载之前，对一些主要内容进行加载，以提供给用户更好的体验，减少等待的事件。否则，如果一个页面的内容过于庞大，没有使用预加载技术的页面就会长时间的展现一片空白，直到所有内容加载完毕。

137. JavaScript 中如何模拟实现方法的重载?

     > JavaScript不支持重载的语法
     >
     > 它没有重载所需要的的函数签名
     >
     > 没有函数签名，函数重载是不可能做到的
     >
     > ```js
     > // 利用闭包特性 addMethod 函数接受3个参数：目标对象、目标方法名、函数体
     > // 先将目标object[name]的值存入变量old中，因此起初old的值可能不是一个函数
     > // 接着向object[name]赋值一个代理函数，并且由于变量old、fnt在代理函数中被引用，所以old、fnt常驻内存不会被回收
     > function addMethod(object, name, fnt) {
     >  let old = object[name]
     >  object[name] = function() {
     >      if (fnt.length === arguments.length) {
     >          return fnt.apply(this, arguments)
     >      } else {
     >          if (typeof old === 'function') {
     >              return old.apply(this, arguments)
     >          }
     >      }
     >  }
     > }
     > // 模拟重载 add
     > let methods = {}
     > addMethod(methods, 'add', function() {
     >  return 0
     > })
     > addMethod(methods, 'add', function(a, b) {
     >  return a + b
     > })
     > addMethod(methods, 'add', function(a, b, c) {
     >  return a + b + c
     > })
     > // 执行
     > console.log(methods.add())
     > console.log(methods.add(10, 20)) // 30
     > console.log(methods.add(10, 20, 30)) // 60
     > ```
     >
     > 

138. 说一下base64的编码方式

139. 说一下import的原理，和require的不同之处在哪里

140. 文件上传如何实现？除了input还有哪些别的方法？

     > 1. FileUpload对象
     >
     >    > <input type='file'>
     >    >
     >    > 把这个标签放在form标签内，设置form的action为服务器的目标上传地址，并点击submit按钮或通过js调用form的submit方法就可以实现简单的文件上传，但是这样的上传会刷新页面
     >
     > 2. 使用ajax实现无刷新上传
     >
     >    ```js
     >    let xhr = new XMLHttpRequest();
     >    let formData = new FormData();
     >    let fileInput = document.querySelector("#myFile");
     >    let file = fileInput.files[0];
     >    formData.append("myFile", file);
     >    xhr.open("POST", "/upload.php");
     >    xhr.onload = function () {
     >      if (this.status === 200) {
     >        // 对请求成功处理
     >      }
     >    };
     >    xhr.send(formData);
     >    xrh = null;
     >    // 如果想查看进度，可以监听 xhr.upload.onprogress
     >    ```
     >
     >    
     >
     > 3. 图片预览
     >
     >    > 常规思路是等待文件上传成功后，后台返回上传文件的url，然后把预览图片的img元素的src指向该url
     >    >
     >    > 但是还有更好的实现方式，就是使用HTML5提供的FileReader
     >    >
     >    > ```js
     >    > function handleImageFile(file){
     >    > let previewArea = document.querySelector("#previewArea");
     >    > let img = document.createElement('img');
     >    > let fileInput = document.querySelector('#myFile');
     >    > let file = fileInput.files[0];
     >    > img.file = file;
     >    > previewArea.appendChild(img);
     >    > // FileReader 用于异步读取文件
     >    > let reader = new FileReader();
     >    > reader.onload = (function(aImg){ // 文件读取成功后触发
     >    >  return function(e){
     >    >    aImg.src = e.target.result;
     >    >  }
     >    > })(img)
     >    > reader.readAsDataURL(file); // 将文件读取为dataURL
     >    > }
     >    > ```
     >    >
     >    > 
     >
     > 4. 多文件上传
     >
     >    > <input type='file' multiple>
     >
     > 5. 二进制上传
     >
     >    > ```js
     >    > // FileReader本身支持二进制上传
     >    > let reader = new FileReader();
     >    > reader.onload = function(){
     >    > xhr.sendAsBinary(this.result);
     >    > }
     >    > // 把input里读取的文件内容，放到fileReader的result字段里
     >    > reader.readAsBinaryString(file);
     >    > 
     >    > // 但是需要注意的是 ajax现在已经不支持 发送二进制数据了 需要自己实现一个
     >    > 
     >    > XMLHttpRequest.prototype.sendAsBinary = function(text){
     >    > let data = new ArrayBuffer(text.length); // 表示通用的、固定长度的二进制缓冲区
     >    > let ui8a = new Uint8Array(data,0); // 表示8位无符号整型数组，初始化为0
     >    > for(let i =0;i<text.length;i++){
     >    >  ui8a[i] = (text.charCodeAt(i) & 0xff);
     >    > }
     >    > this.send(ui8a);
     >    > }
     >    > ```

141. 前端骨架屏的原理

     > ```js
     > <div id="root"><!-- shell --></div>
     > // 占位符 将来把生成好的骨架屏结构替换这里的 <!-- shell -->
     > ```
     >
     > ```js
     > // 生成骨架屏的实现思路
     > 1. 监听打包完成的事件
     > 2. 当webpack编译完成后，我们可以启动一个服务，通过puppeteer去访问这个生成的页面，抓取骨架内容（dom结构和css），然后生成骨架屏的html插入到占位符 <!-- shell -->
     > ```
     >
     > 

142. es6代码转为es5代码的实现思路是什么?大致说一下babel的原理？

     > **babel各种包的介绍**
     >
     > babel-core：核心包，提供转译的api，用于对代码进行转译，例如babel transform
     >
     > babylon：babel的词法解析器，将原始代码逐个字母的像扫描机一样读取分析得到AST语法树
     >
     > babel-traverse：对ast进行遍历转译
     >
     > babel-generator：将新的ast语法树生成新的代码
     >
     > babel-types：用于检验、构建和改变ast树的节点

     > **babel的转译分为三个阶段**
     >
     > - 解析：将代码解析生成ast语法树，主要利用babylon包，简单来说，就是一个对象js代码的编译过程，进行了词法分析和语法分析的过程
     > - 转换：对ast进行遍历转译，主要使用babel-traverse，在此过程中进行添加、更新、移除等操作
     > - 生成：将转变后的代码在转换为js代码，使用的模块是babel-generator

     > **demo： let a = 10**
     >
     > ```js
     > {
     > "type": "Program",
     > "start": 0,
     > "end": 10,
     > "body": [
     >  {
     >    "type": "VariableDeclaration",
     >    "start": 0,
     >    "end": 10,
     >    "declarations": [
     >      {
     >        "type": "VariableDeclarator",
     >        "start": 4,
     >        "end": 10,
     >        "id": {
     >          "type": "Identifier",
     >          "start": 4,
     >          "end": 5,
     >          "name": "a"
     >        },
     >        "init": {
     >          "type": "Literal",
     >          "start": 8,
     >          "end": 10,
     >          "value": 10,
     >          "raw": "10"
     >        }
     >      }
     >    ],
     >    "kind": "let"
     >  }
     > ],
     > "sourceType": "module"
     > }
     > // 将以上 AST 语法树对象中的 ES6 语法 let 替换成 var。
     > // 再将新的语法树生成新的代码 var a = 10。
     > ```
     >
     > 

143. 用原生js实现自定义事件

     > 为什么以前js中用到的自定义事件很少，因为之前的js不是模块化开发，也很少协作。因为事件本质上是一种通信方式，是一种消息，只有存在多个对象，多个模块的情况下，才有可能需要用到事件进行通信。
     >
     > ```js
     > // 实现方式1 Event构造函数
     > let myEvent = new Event('rlei') // rlei 表示事件名称
     > document.dispatchEvent(myEvent) // 派发事件
     > // 在另外一个js文件中可以监听到事件派发
     > document.addEventListener('rlei', (event) => {
     > console.log('test', event)
     > })
     > 
     > // 实现方式2 CustomEvent构造函数 可以用来传递数据
     > let myEvent = new CustomEvent('rlei', {
     >  detail: { // detail 用来传递数据
     >      arr: [1,2,3]
     >  }
     > })
     > document.dispatchEvent(myEvent)
     > // 在另外一个js文件中可以监听到事件派发
     > document.addEventListener('rlei', (event) => {
     > console.log('获取到传递进来的数据', event.detail)
     > })
     > 
     > // 应用场景1：比如微博列表中的“关注”按钮，点击之后，个人关注数会增加，同时会推荐类似微博等
     > // 应用场景2：小王负责模块A开发，小陈负责模块B开发，模块B需要模块A正常运行之后才能执行
     > ```
     >
     > 

144. 哪些操作会导致js内存泄露

     ```js
     1. 一些意外的全局变量
     function bar() {
         bar = 'xxx' // 函数内部未定义的变量会在全局对象创建一个新变量
     }
     2. 缓存的数据量过大，sessionStorage是关闭浏览器才会清除，关闭标签是不清除的，sessionStorage是存储在内存的。localStorage存储在磁盘中。
     3. 被遗忘的计时器或回调函数
     定时器的回调函数只有在定时器停止的时候才会被回收
     4. 脱离dom的引用
     let elements = {
         button: document.getElementById('button'),
         image: document.getElementById('image'),
         text: document.getElementById('text')
     }
     // 例如执行 如下方法
     function removeButton() {
         document.body.removeChild(document.getElementById('button'))
     }
     // 此时仍旧存在一个全局的#button的引用，elements字典中button元素仍然存在内存中，不能被GC回收
     5. 闭包
     ```

     

145. 实现数组的map方法

     ```js
     Array.prototype.map = function(mapCallback) {
         let arr = this
         if (!Array.isArray(arr) || !arr.length || typeof mapCallback != 'function') {
             return
         }
         let result = []
         for (let i = 0; i < arr.length; i++) {
             result.push(mapCallback(arr[i], i, arr))
         }
         return result
     }
     let arr = [1,2,3].map(x => x * 2)
     console.log(arr)
     ```

     

146. 实现数组的filter方法

     ```js
     Array.prototype.filter = function(mapCallback) {
         let arr = this
         if (!Array.isArray(arr) || !arr.length || typeof mapCallback != 'function') {
             return
         }
         let result = []
         for (let i = 0; i < arr.length; i++) {
             if (mapCallback(arr[i], i, arr)) {
                 result.push(arr[i])
             }
         }
         return result
     }
     let arr = [1,2,3].filter(x => x * 2)
     console.log(arr)
     ```

     

147. 说说js语言

     > js是一个解释型语言
     >
     > 运行时编译、运行前编译

     > 浏览器的内核包括了js引擎和渲染引擎
     >
     > js代码的执行需要在机器上（node或浏览器）安装一个js引擎才能执行
     >
     > js早期是通过将源码编译成语法树，直接解释语法树的，但是这种方法效率不高
     >
     > js是动态弱类型脚本语言
     >
     > 解释型语言：使用专门的解释器对源代码逐行解释成特定平台的机器码并立即执行，不需要事先编译。
     >
     > 每次执行都需要解释，效率不高。
     >
     > 编译型语言，使用专门的编译器，针对特定的平台，将源代码一次性的编译成可被该平台硬件执行的机器码，如exe文件，以后再要运行的时候直接使用编译结果即可，如直接运行exe文件，因为只需要编译一次，以后运行不需要再次编译，所以编译型的语言执行效率高。

     > js也是一门编译语言，但是和传统的编译语言不一样，她不是提前编译的，编译的结果也不能进行移植。
     >
     > 任何JavaScript代码在执行前都要进行编译
     >
     > 一段源代码在执行之前会经历三个步骤，统称为“编译”：
     >
     > 分词/词法分析：将字符组成的代码字符串分解成有意义的代码块，这些代码块被称为词法单元。比如var a = 2；被分解成 var、a、=、2这些词法单元。
     >
     > 解析：根据词法单元流（数组）构建ast抽象语法树，代表了程序的语法结构
     >
     > 代码生成：将ast转换为可执行代码的过程被称为代码生成。简单来说就是有某种方法可以将var a = 2；的ast转化为一组机器指令。

148. 说说严格模式有什么特点

     > 优点：使用严格模式的好处是可以提早知道代码中存在的错误

     ```js
     // 1. 不允许创建没有声明的变量
     a = 1 // 不允许，报错，非严格模式下，声明为全局变量
     
     // 2. 不能对变量调用delete删除符
     let color = 'red'
     delete color; // 报错
     
     // 3. 不能使用关键字、保留字命名变量，否则会报错
     // 如：interface、yield、implements、static、let、var、const、package等等
     
     // 4. 如果一个对象的某一个属性的 configurable 为false，此时如果使用 delete 删除属性，会报错
     'use strict';
     let obj = {}
     Object.defineProperty(obj, 'name', {
         value: 'name',
         configurable: false
     })
     
     delete obj.name
     
     // 5. 如果给一个不可扩展属性的对象添加新的属性，在严格模式下报错
     
     // 6. 严格模式下，函数的形参名称不允许重复，否则报错，非严格模式下，不会报错，第二个会覆盖第一个
     function add(num, num) {
         console.log(num)
     }
     
     // 7. 非严格模式下，修改函数的形参值，最终会反映到形参arguments，但是在严格模式下不会，保持独立
     
     'use strict';
     function add(num) {
         num = 2
         console.log(num, arguments[0]) // 2, 1
     }
     add(1)
     
     // 8. 在严格模式下，调用arguments.callee（引用函数本身）报错
     
     // 9. 严格模式对函数名也做了限制，不允许使用关键字和保留字作为函数名
     
     // 10. 在严格模式下，eval不会在上下文中创建变量或者函数
     'use strict';
     function add(num) {
         eval('var a = 10')
         console.log(a) // 报错 读取不到 a
     }
     
     // 11. 严格模式下，抑制this，非严格模式下，调用call传入null或者undefined作为第一个参数，内部this指向window，但是在严格模式下，内部this指向undefined
     
     // 12. 严格模式下不能用with语句
     
     // 13. 严格模式下，不允许使用八进制，会报错，严格模式下 调用parseInt解析八进制字符串的时候，会把八进制字符串当做十进制去解析
     'use strict';
     let value = 010;
     console.log(value) // 报错
     console.log(parseInt('010')) // 10 非严格模式下为 8
     ```

     

149. delete运算符

     ```js
     // 删除不了变量
     let color = 'red'
     delete color
     console.log(color) // red
     ```

     

150. 如何设置一个对象不可扩展

     ```js
     let obj = {
         name: 'test'
     }
     
     Object.preventExtensions(obj) // 阻止对象可扩展
     
     obj['age'] = 10
     console.log(Object.isExtensible(obj)) // 判断对象是否可扩展，可扩展为 true
     console.log(obj) // {name: 'test'}
     ```

     

151. sessionStorage、localStorage、cookie区别

     > 都是保存在浏览器的，同源
     >
     > cookie数据是游走在浏览器和服务器之间的，会通过http请求携带到服务端
     >
     > sessionStorage、localStorage不会把数据发送给服务器，保存在本地
     >
     > 存储大小也不一样，cookie不能超过4K，而sessionStorage、localStorage可以达到5M
     >
     > sessionStorage在浏览器窗口关闭之前有效
     >
     > localStorage始终有效
     >
     > cookie只在设置的cookie过期之前有效，即使浏览器窗口关闭或者浏览器关闭
     >
     > 作用域不同：
     >
     > sessionStorage只在当前浏览器的同一个窗口有效
     >
     > localStorage在所有的同源窗口有效，cookie也是

152. 浏览器缓存

     > **浏览器缓存，它把资源存在了哪里？**
     >
     > memory cache 内存
     >
     > disk cache 磁盘
     >
     > **三级缓存原理（访问缓存优先级）**
     >
     > 1. 先在内存中查找，内存中有，直接加载
     > 2. 内存中没有，从硬盘中查找，找到了，直接加载
     > 3. 找不到，进行网络请求资源
     > 4. 把请求获取到的资源缓存到内存和硬盘中
     >
     > **浏览器缓存的分类**
     >
     > 1. 强缓存
     >
     >    > 当我们访问URL的时候，不会向服务器发送请求，直接从缓存中读取资源，但是会返回200
     >
     > 2. 协商缓存
     >
     > *浏览器向服务器请求资源时，首先判断是否命中强缓存，在判断是否命中协商缓存*
     >
     > **如何设置强缓存**
     >
     > 我们第一次进入页面，请求服务器，然后服务器进行应答，浏览器会根据response Header来判断是否对资源进行缓存，如果响应头中expires、pragma或者cache-control字段，代表这是强缓存，浏览器就会把资源缓存在memory cache 或 disk cache中。
     >
     > 第二次请求时，浏览器判断请求参数，如果符合强缓存条件就直接返回状态码200，从本地缓存中拿数据。否则把响应参数存在request header请求头中，看是否符合协商缓存，符合则返回状态码3
     >
     > 04，不符合则服务器会返回全新资源。
     >
     > ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca00bff3081e4cfd993a8f252f4fa23a~tplv-k3u1fbpfcp-watermark.image)

     **expires**

     > 是HTTP1.0控制网页缓存的字段，值为一个时间戳，准确来讲是格林尼治时间，服务器返回该请求结果缓存的到期时间，意思是，再次发送请求时，如果未超过过期时间，直接使用该缓存，如果过期了则重新请求。
     >
     > 有个缺点，就是它判断是否过期是用本地时间来判断的，本地时间是可以自己修改的。

     

     **cache-control**

     > 是HTTP1.1中控制网页缓存的字段，当Cache-Control都存在时，Cache-Control优先级更高，主要取值为：
     >
     > public：资源客户端和服务器都可以缓存。
     >
     > privite：资源只有客户端可以缓存。
     >
     > no-cache：客户端缓存资源，但是是否缓存需要经过协商缓存来验证。
     >
     > no-store：不使用缓存。
     >
     > max-age：缓存保质期。
     >
     > ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f169e913e244d52a44ff1e4185cb9ce~tplv-k3u1fbpfcp-watermark.image)
     >
     > Cache-Control使用了max-age相对时间，解决了expires的问题。

     

     **刷新对于强缓存和协商缓存的影响**

     1. ctrl+f5 直接从服务器加载，跳过强缓存和协商缓存
     2. f5，跳过强缓存，但是会检查协商缓存
     3. 浏览器地址栏输入url，回车，浏览器发现缓存中有这个文件了，不用在继续请求了，直接去缓存中拿

     **强缓存和协商缓存的区别**

     1. 强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。

     2. 大部分web服务器都默认开启协商缓存。

     **缓存方案**

     > 目前的项目大多使用这种缓存方案的：
     >
     > - HTML: 协商缓存；
     > - css、js、图片：强缓存，文件名带上hash。

     

     ## 缓存位置

     **Servie worker**

     > 一个服务器与浏览器之间的中间人角色，如果网站中注册了service worker那么它可以拦截当前网站所有的请求，进行判断（需要编写相应的判断程序），如果需要向服务器发起请求的就转给服务器，如果可以直接使用缓存的就直接返回缓存不再转给服务器。从而大大提高浏览体验。

     **memory cache**

     > 内存中的缓存，主要包含的是当前中页面中已经抓取到的资源，例如页面上已经下载的样式、脚本、图片等。读取内存中的数据肯定比磁盘快，内存缓存虽然读取高效，可是缓存持续性很短，会随着进程的释放而释放。一旦我们关闭 Tab 页面，内存中的缓存也就被释放了。

     **disk cache**

     > 存储在硬盘中的缓存，读取速度慢点，但是什么都能存储到磁盘中，比之 Memory Cache 胜在容量和存储时效性上。
     >
     > 在所有浏览器缓存中，Disk Cache 覆盖面基本是最大的。它会根据 HTTP Herder 中的字段判断哪些资源需要缓存，哪些资源可以不请求直接使用，哪些资源已经过期需要重新请求。并且即使在跨站点的情况下，相同地址的资源一旦被硬盘缓存下来，就不会再次去请求数据。绝大部分的缓存都来自 Disk Cache。
     >
     > memory cache 要比 disk cache 快的多。举个例子：从远程 web 服务器直接提取访问文件可能需要500毫秒(半秒)，那么磁盘访问可能需要10-20毫秒，而内存访问只需要100纳秒，更高级的还有 L1缓存访问(最快和最小的 CPU 缓存)只需要0.5纳秒。

     **push cache**

     > Push Cache（推送缓存）是 HTTP/2 中的内容，当以上三种缓存都没有命中时，它才会被使用。它只在会话（Session）中存在，一旦会话结束就被释放，并且缓存时间也很短暂，在Chrome浏览器中只有5分钟左右，同时它也并非严格执行HTTP头中的缓存指令。

     

     **协商缓存**

     >  协商缓存就是强缓存失效后，浏览器携带缓存标识向服务器发送请求，由服务器根据缓存标识来决定是否使用缓存的过程。
     >
     >  主要有以下两种情况：
     >
     >  1. 协商缓存生效，返回304
     >  2. 协商缓存失效，返回200和请求结果

     

     **如何设置协商缓存**

     > **Last-Modified / If-Modified-Since**
     >
     > ##### Etag / If-None-Match
     >
     > Last-Modified是服务器响应请求时，返回该资源文件在服务器最后被修改的时间。
     >
     > ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c6c3aabbfd9a43ab81c97dd519da3b9f~tplv-k3u1fbpfcp-watermark.image)
     >
     > If-Modified-Since则是客户端再次发起该请求时，携带上次请求返回的Last-Modified值，通过此字段值告诉服务器该资源上次请求返回的最后被修改时间。服务器收到该请求，发现请求头含有If-Modified-Since字段，则会根据If-Modified-Since的字段值与该资源在服务器的最后被修改时间做对比，若服务器的资源最后被修改时间大于If-Modified-Since的字段值，则重新返回资源，状态码为200；否则则返回304，代表资源无更新，可继续使用缓存文件。
     >
     > ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa2eae3bc57d48e39a871c8e659bf97d~tplv-k3u1fbpfcp-watermark.image)
     >
     > Etag是服务器响应请求时，返回当前资源文件的一个唯一标识(由服务器生成)。
     >
     > ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0da637ef7fa64aef8b1f932c3dd0297b~tplv-k3u1fbpfcp-watermark.image)
     >
     > If-None-Match是客户端再次发起该请求时，携带上次请求返回的唯一标识Etag值，通过此字段值告诉服务器该资源上次请求返回的唯一标识值。服务器收到该请求后，发现该请求头中含有If-None-Match，则会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200。
     >
     > ![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e9d32690cdf45b498e5dcabd4c12f71~tplv-k3u1fbpfcp-watermark.image)
     >
     > **Etag / If-None-Match优先级高于Last-Modified / If-Modified-Since，同时存在则只有Etag / If-None-Match生效。**

153. 说说CSS盒模型

     > 盒模型指的是每一个元素在页面中都会形成一个矩形区域，也就是盒子

     > 盒模型由以下几部分组成：内部区域（content）、内边距（padding）、边框（border）、外边距（margin）

     > box-sizing的设置使得设置的宽度和高度作用在真正内容区域上有多少
     >
     > content-box（默认）：设置在真正的内容区域的盒子上面
     >
     > border-box：设置的值包含在border、padding、content，要想获取真正的内容区域的盒子宽度和高度，需要拿设置的值减去padding、border

     > 盒模型的分类
     >
     > 块盒：display：block；可以设置宽度和高度，宽度独占一行，高度默认为0，div，p，h1-h6
     >
     > 行盒：display：inline；不能设置宽度和高度，宽度和高度随着内容的撑开而撑开，span，a
     >
     > 行块盒：display：inline-block；可以设置宽度和高度，比如input、img

     ![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/485c061aa21a4f868d367764ab5d9959~tplv-k3u1fbpfcp-watermark.image)

154. 要实现一个JS的持续动画，你有什么比较好的方法？

     ```js
     // 使用 setInterval 和 requestAnimationFrame 都可以做到
     let flag = true
     let left = 0
     let box = document.querySelector('#box')
     
     function render() {
         if (flag) {
             if (left > 100) {
                 flag = false
             }
             box.style.left = `${++left}px`
         } else {
             if (left < 0) {
                 flag = true
             }
             box.style.left = `${--left}px`
         }
     }
     // 时间间隔为什么是60帧，因为屏幕一秒钟渲染60帧
     setInterval(render, 1000 / 60)
     
     // 使用 requestAnimationFrame 实现
     let e = document.getElementById("e");
     let flag = true;
     let left = 0;
     
     function render() {
         if(flag == true){
             if(left>=100){
                 flag = false
             }
             e.style.left = ` ${left++}px`
         }else{
             if(left<=0){
                 flag = true
             }
             e.style.left = ` ${left--}px`
         }
     }
     
     (function animloop() {
         render();
         window.requestAnimationFrame(animloop); // 正常情况下 requestAnimationFrame 这个方法在一秒内执行60次
     })();
     
     // 目前大多数的设备的屏幕刷新率为1秒钟60帧
     // 卡顿：每个帧的时间大约是16毫秒
     // FPS表示每秒钟画面的更新次数，FPS越高，动画越流畅
     ```

     

155. 使用CSS3动画代替JS的动画有什么好处？

     不占用JS主线程

     可以利用硬件加速

     > 比如transform动画由GPU控制，支持硬件加速
     >
     > 浏览器接受到页面文档之后，会将文档中的标记语言解析为DOM树，DOM树和CSS结合形成浏览器构建页面的渲染树。
     >
     > 渲染树中包含了大量的渲染元素，每一个渲染元素会被分配到一个图层中，每一个图层又会被加载到GPU形成渲染纹理，而图层在GPU中transform是不会触发repaint的，最终这些使用transform的图层都由独立的合成器进行来进行处理

     浏览器可以对动画做优化（元素不可见的时候不动画，减少对FPS的影响）

156. 为什么使用JSX开发，vue不是都用template吗?

     ```js
     // 某些情况下可以简化template  render函数比模板更接近编译器，减少了调用compileToFunction(template)这一步骤
     <!--nav-tmpl.vue-->
     <template>
       <h1 v-if="level === 1">
         <slot></slot>
       </h1>
       <h2 v-else-if="level === 2">
         <slot></slot>
       </h2>
       <h3 v-else-if="level === 3">
         <slot></slot>
       </h3>
       <h4 v-else-if="level === 4">
         <slot></slot>
       </h4>
       <h5 v-else-if="level === 5">
         <slot></slot>
       </h5>
       <h6 v-else-if="level === 6">
         <slot></slot>
       </h6>
     </template>
     <script>
     export default {
       props: {
         level: {
           type: Number,
           default: 1
         }
       }
     };
     </script>
     
     // 使用jsx改写
     // nav-jsx.jsx
     export default {
       props: {
         level: {
           type: Number,
           default: 1
         }
       },
       render: function(h) {
         const Tag = `h${this.level}`;
         return <Tag>{this.$slots.default}</Tag>;
       }
     };
     
     // jsx和template的使用方式相同，引入之后，使用components注册就可以在页面中使用了
     ```

     

157. 请解释JSONP的工作原理

     > 是一种跨域解决方案，通过客户端的script标签发出
     >
     > 浏览器会进行同源检查，浏览器在接受服务端返回数据的时候，发现我们请求的是一个非同源的数据，浏览器会把响应报文丢弃掉
     >
     > 但是，通过script标签和src这种标签发出的请求不会被浏览器进行同源检查

     ```js
     // 实现步骤
     // 1. 客户端准备一个函数，用来接受服务端返回的数据
     function getdata(data) {
         console.log(111, data)
     }
     
     // 2. 客户端动态插入一个script标签并执行请求
     let script = document.createElement('script')
     script.src = "http://localhost:3456/product?callback=getdata"
     document.head.appendChild(script);
     document.head.removeChild(script);
     
     // 3. 服务端获取到客户端传递过来的函数名，将数据和函数名组合在一起成字符串返回
     app.get('/product', (req, res) => {
       let callback = req.query.callback;
       res.send(`${callback}(${JSON.stringify({name: 'name'})});`)
     })
     
     // 4. 客户端接受到响应并执行回调函数拿到数据
     ```

     > 缺点：只能用于get请求
     >
     > 动态插入的script脚本可能被注入恶意代码

     ```js
     // 实现自己的jsonp
     function myJsonp(options) {
         return new Promise((resolve, reject) => {
             let {data, url, cbname} = options;
             
             window.getdata = function(res) { // 这里注意，需要挂载到window上，否则找不到这个函数会报错
                 resolve(res);
             }
             
             function parseData() {
                 let param = ''
                 for (let key in data) {
                     param += key + '=' + encodeURIComponent(data[key]) + '&'
                 }
                 return param.substr(0, param.length - 1)
             }
             
             url = `${url}?callback=getdata&${parseData()}`
             
             let script = document.createElement('script')
             script.src = url
             document.head.appendChild(script)
     		document.head.removeChild(script)
         })
     }
     
     // 使用
     myJsonp({
         url: 'http://localhost:3456/product',
         data: {
             name: 'rlei',
             age: 18
         }
     }).then(res => {
         console.log(res)
     })
     ```

     

158. 怎么样在JavaScript中创建一个worker线程

     > 浏览器端js是以单线程的方式运行的，也就是说JavaScript和UI渲染占用同一个主线程
     >
     > 那就意味着，如果JavaScript进行高负载的数据处理，UI渲染就有可能被阻断，浏览器就会出现卡顿，降低了用户的体验
     >
     > 为此，JavaScript提供了异步操作，比如定时器、ajax、I/O，我们把高负载的任务进行异步处理，它们将会被放入到浏览器的事件任务队列中，等到JavaScript执行线程空闲的时候再去执行。
     >
     > Web Worker可以实现主 UI 线程与复杂计运算线程的分离，从而极大减轻了因计算量大而造成 UI 阻塞而出现的界面渲染卡、掉帧的情况

     > Worker是window对象的原生方法

     ```js
     let worker = new Worker('worker.js')
     // worker可以通过postMessage、onmessage进行数据通信
     // 主线程和子线程可以进行双向的数据通信
     
     // main.js
     worker.postMessage('hello world')
     worker.onmessage = function(event) {
      console.log(event.data) // 拿到worker数据子线程传递过来的消息
     }
     // 或者使用 worker.addEventListener 监听
     
     // worker会自动关闭，如果它本身没有监听任何消息的话，也可以手动关闭，调用 worker.terminate()
     
     // work.js 子线程
     addEventListener('message', function(event) {
      console.log('收到了：', event.data)
      // 子线程 发送消息告诉主线程
      self.postMessage('我收到消息了，和你说一下')
      
      // 在子线程运行结束后，为了节省系统的资源，可以手动关闭子线程
      close();
     })
     ```

     > 使用的问题
     >
     > 1. 分配给worker线程的脚本文件（worker.js），必须与主线程的脚本文件（main.js）同源，同时也不支持文件域
     >
     >    > 实际开发中，我们不会把所有的代码全部放在一个文件中让子线程加载，肯定是模块化开发，通过工具把代码合并到一个文件中，然后把子线程的代码生成一个URL
     >    >
     >    > ```js
     >    > let script = 'console.log("hello world!");'
     >    > // 将动态生成的脚本转成 Blob 对象
     >    > let workerBlob = new Blob([script], { type: "text/javascript" });
     >    > // 给这个对象创建一个 URL
     >    > let url = URL.createObjectURL(workerBlob);
     >    > // 最后将创建好的URL作为地址传给worker的构造函数
     >    > let worker = new Worker(url);
     >    > ```
     >
     > 2. Worker子线程所在的全局对象，不在是window了，而是self，它与主线程不在同一个上下文环境，无法读取主线程所在网页的DOM对象，也不能使用 `document、window、parent`等对象，可以使用console.log，debugger，可以读取部分navigator对象
     >
     > 3. Worker子线程可以使用异步

     > 使用场景：
     >
     > 1. 在Worker子线程可以进行大量的数学运算
     >
     > 2. 高频的用户交互适用于根据用户的输入习惯、历史记录以及缓存等信息来协助用户完成输入的纠错、校正功能等类似场景，用户频繁输入的响应处理同样可以考虑放在web worker中执行。例如，我们可以 做一个像Word一样的应用：当用户打字时后台在词典中进行查找，帮助用户自动纠错等等。

159. 渲染大量的数据页面如何不卡顿

     ```js
     // 合理利用 createDocumentFragment和requestAnimationFrame
     // 模拟实现
     setTimeout(() => {
         let count = 0
         let totalCount = 100000
         let pageSize = 20
         // 计算需要插入多少次
         let times = Math.ceil(totalCount / pageSize)
         let ul = document.querySelector('ul')
         
         function add() {
             // createDocumentFragment 创建虚拟节点，如果采用createElement会导致效率比较低，因为createElement每一次的插入都会引起重新渲染，DocumentFragment不属于文档树
             // 除了使用 createDocumentFragment 还可以使用innerHTML，把创建的元素写到一个字符串上，然后一次性的写到innerHTML上，但是字符串的灵活性比较差，很难符合创建各种DOM元素的需求
             const fragment = document.createDocumentFragment()
             for (let i = 0; i < pageSize; i++) {
                 let li = document.createElement('li')
                 li.innerHTML = Math.floor(Math.random() * totalCount)
                 // 文档片段存在于内存中，并不在DOM中，所以将子元素插入到文档片段并不会引起页面回流
                 fragment.appendChild(li)
             }
             ul.appendChild(fragment) // 这里的添加并不是添加片段，而是添加片段的所有子节点
             ++count
             loop()
         }
         
         function loop() {
             if (count < times) {
                 window.requestAnimationFrame(add)
             }
         }
         
         loop()
     }, 0)
     
     // createDocumentFragment和createElement方法的区别
     // 1. 文档片段存在于内存中，并不在DOM中，所以将子元素插入到文档片段并不会引起页面回流，但是使用createElement会
     // 2. 使用createElement方法创建的元素的nodeType为1，使用 createDocumentFragment 创建出来的节点的nodeType为11
     ```

     

160. zoom: 1的原理和应用

     > zoom是IE浏览器的专有属性，它可以设置或检索对象的缩放比例
     >
     > 当设置了zoom之后，所设置的元素就会自动扩大或者缩小，高度和宽度就会重新计算了，一旦改变，会发生重新渲染
     >
     > 解决的问题：IE下子元素浮动时候父元素不随着自动扩大的问题

161. 说一说XSS攻击

     > 全称是跨站脚本攻击
     >
     > XSS攻击是指浏览器中执行恶意脚本（无论是同域还是跨域的），从而拿到用户的信息进行操作
     >
     > 比如可以窃取 cookie
     >
     > 监听用户行为，比如输入账号密码后登录到客户的黑客服务器
     >
     > 修改DOM伪造登录表单
     >
     > 在页面中生成浮窗广告

     > 通常情况，XSS 攻击的实现有三种方式——**存储型**、**反射型**和**文档型**。原理都比较简单，先来一一介绍一下。

     > **存储型**
     >
     > `存储型`，顾名思义就是将恶意脚本存储了起来，确实，存储型的 XSS 将脚本存储到了服务端的数据库，然后在客户端执行这些脚本，从而达到攻击的效果。
     >
     > 常见的场景是留言评论区提交一段脚本代码，如果前后端没有做好转义的工作，那评论内容存到了数据库，在页面渲染过程中`直接执行`, 相当于执行一段未知逻辑的 JS 代码，是非常恐怖的。这就是存储型的 XSS 攻击。

     > **反射型**
     >
     > `反射型XSS`指的是恶意脚本作为**网络请求的一部分**。
     >
     > ```js
     > http://sanyuan.com?q=<script>alert("你完蛋了")</script>
     > ```
     >
     > 这样在服务器端会拿到`q`参数,然后将内容返回给浏览器端，浏览器将这些内容作为HTML的一部分解析，发现是一个脚本，直接执行，这样就被攻击了。
     >
     > 之所以叫它`反射型`, 是因为恶意脚本是通过作为网络请求的参数，经过服务器，然后再反射到HTML文档中，执行解析。和`存储型`不一样的是，服务器并不会存储这些恶意脚本。

     > **文档型**
     >
     > 文档型的 XSS 攻击并不会经过服务端，而是作为中间人的角色，在数据传输过程劫持到网络数据包，然后**修改里面的 html 文档**！
     >
     > 这样的劫持方式包括`WIFI路由器劫持`或者`本地恶意软件`等。

     > **防范措施**
     >
     > 明白了三种`XSS`攻击的原理，我们能发现一个共同点: 都是让恶意脚本直接能在浏览器中执行。
     >
     > 那么要防范它，就是要避免这些脚本代码的执行。
     >
     > 为了完成这一点，必须做到**一个信念，两个利用**。
     >
     > #### 一个信念
     >
     > 千万不要相信任何用户的输入！
     >
     > 无论是在前端和服务端，都要对用户的输入进行**转码**或者**过滤**。
     >
     > 如：
     >
     > ```js
     > <script>alert('你完蛋了')</script>
     > ```
     >
     > 转码后变为:
     >
     > ```js
     > &lt;script&gt;alert(&#39;你完蛋了&#39;)&lt;/script&gt;
     > ```
     >
     > 这样的代码在 html 解析的过程中是无法执行的。
     >
     > 当然也可以利用关键词过滤的方式，将 script 标签给删除。
     >
     > **利用 CSP**
     >
     > CSP，即浏览器中的内容安全策略，它的核心思想就是服务器决定浏览器加载哪些资源，具体来说可以完成以下功能:
     >
     > 1. 限制其他域下的资源加载。
     > 2. 禁止向其它域提交数据。
     > 3. 提供上报机制，能帮助我们及时发现 XSS 攻击。
     >
     > **利用 HttpOnly**
     >
     > 很多 XSS 攻击脚本都是用来窃取Cookie, 而设置 Cookie 的 HttpOnly 属性后，JavaScript 便无法读取 Cookie 的值。这样也能很好的防范 XSS 攻击。

     > 1. > **总结**
     >    >
     >    > `XSS` 攻击是指浏览器中执行恶意脚本, 然后拿到用户的信息进行操作。主要分为`存储型`、`反射型`和`文档型`。防范的措施包括:
     >    >
     >    > - 一个信念: 不要相信用户的输入，对输入内容转码或者过滤，让其不可执行。
     >    > - 两个利用: 利用 CSP，利用 Cookie 的 HttpOnly 属性。
     >
     > 

162. 说一说CSRF攻击

     > 跨站请求伪造
     >
     > 指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户**目前的登录状态**发起跨站请求。

     > 举个例子, 你在某个论坛点击了黑客精心挑选的小姐姐图片，你点击后，进入了一个新的页面。
     >
     > 那么恭喜你，被攻击了:）
     >
     > 你可能会比较好奇，怎么突然就被攻击了呢？接下来我们就来拆解一下当你点击了链接之后，黑客在背后做了哪些事情。
     >
     > 可能会做三样事情。列举如下：
     >
     > #### 1. 自动发 GET 请求
     >
     > 黑客网页里面可能有一段这样的代码:
     >
     > ```js
     > <img src="https://xxx.com/info?user=hhh&count=100">
     > ```
     >
     > 进入页面后自动发送 get 请求，值得注意的是，这个请求会自动带上关于 xxx.com 的 cookie 信息(这里是假定你已经在 xxx.com 中登录过)。
     >
     > 假如服务器端没有相应的验证机制，它可能认为发请求的是一个正常的用户，因为携带了相应的 cookie，然后进行相应的各种操作，可以是转账汇款以及其他的恶意操作。
     >
     > #### 2. 自动发 POST 请求
     >
     > 黑客可能自己填了一个表单，写了一段自动提交的脚本。
     >
     > ```js
     > <form id='hacker-form' action="https://xxx.com/info" method="POST">
     > <input type="hidden" name="user" value="hhh" />
     > <input type="hidden" name="count" value="100" />
     > </form>
     > <script>document.getElementById('hacker-form').submit();</script>
     > ```
     >
     > 同样也会携带相应的用户 cookie 信息，让服务器误以为是一个正常的用户在操作，让各种恶意的操作变为可能。
     >
     > #### 3. 诱导点击发送 GET 请求
     >
     > 在黑客的网站上，可能会放上一个链接，驱使你来点击:
     >
     > ```js
     > <a href="https://xxx/info?user=hhh&count=100" taget="_blank">点击进入修仙世界</a>
     > ```
     >
     > 点击后，自动发送 get 请求，接下来和`自动发 GET 请求`部分同理。
     >
     > **这就是`CSRF`攻击的原理**。和`XSS`攻击对比，CSRF 攻击并不需要将恶意代码注入用户当前页面的`html`文档中，而是跳转到新的页面，利用服务器的**验证漏洞**和**用户之前的登录状态**来模拟用户进行操作。

     > **防范措施**
     >
     > #### 1. 利用Cookie的SameSite属性
     >
     > `CSRF攻击`中重要的一环就是自动发送目标站点下的 `Cookie`,然后就是这一份 Cookie 模拟了用户的身份。因此在`Cookie`上面下文章是防范的不二之选。
     >
     > 恰好，在 Cookie 当中有一个关键的字段，可以对请求中 Cookie 的携带作一些限制，这个字段就是`SameSite`。
     >
     > ```js
     > SameSite`可以设置为三个值，`Strict`、`Lax`和`None
     > ```
     >
     > **a.** 在`Strict`模式下，浏览器完全禁止第三方请求携带Cookie。比如请求`sanyuan.com`网站只能在`sanyuan.com`域名当中请求才能携带 Cookie，在其他网站请求都不能。
     >
     > **b.** 在`Lax`模式，就宽松一点了，但是只能在 `get 方法提交表单`况或者`a 标签发送 get 请求`的情况下可以携带 Cookie，其他情况均不能。
     >
     > **c.** 在`None`模式下，也就是默认模式，请求会自动携带上 Cookie。
     >
     > #### 2. 验证来源站点
     >
     > 这就需要要用到请求头中的两个字段: **Origin**和**Referer**。
     >
     > 其中，**Origin**只包含域名信息，而**Referer**包含了`具体`的 URL 路径。
     >
     > 当然，这两者都是可以伪造的，通过 Ajax 中自定义请求头即可，安全性略差。
     >
     > #### 3. CSRF Token
     >
     > 首先，浏览器向服务器发送请求时，服务器生成一个字符串，将其植入到返回的页面中。
     >
     > 然后浏览器如果要发送请求，就必须带上这个字符串，然后服务器来验证是否合法，如果不合法则不予响应。这个字符串也就是`CSRF Token`，通常第三方站点无法拿到这个 token, 因此也就是被服务器给拒绝。

     > **总结**
     >
     > CSRF(Cross-site request forgery), 即跨站请求伪造，指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户目前的登录状态发起跨站请求。
     >
     > `CSRF`攻击一般会有三种方式:
     >
     > - 自动 GET 请求
     > - 自动 POST 请求
     > - 诱导点击发送 GET 请求。
     >
     > 防范措施: `利用 Cookie 的 SameSite 属性`、`验证来源站点`和`CSRF Token`。

163. 说说SQL注入

     > 对敏感字符串做过滤，做字符屏蔽，比如一些and exec insert select delete update等，还有一些函数如 truncate、char、declare等

164. 说一下JS原生对象和宿主对象的区别

     > ***Object、Function、Array、String、Boolean、Number、Date、RegExp、Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError、ActiveXObject(服务器方面)、Enumerator(集合遍历类)、RegExp（正则表达式）***
     >
     > 以上这些都是原生对象。
     >
     > 所有非原生对象都是宿主对象。
     >
     > **ECMAScript中的“宿主”当然就是我们网页的运行环境，即“操作系统”和“浏览器”**
     >
     > ***所有的 BOM 和 DOM 对象都是宿主对象。***
     >
     > 1. **宿主对象**：宿主对象不是引擎的原生对象，而是由宿主框架通过某种机制注册到JavaScript引擎中的对象

165. 虚拟列表是什么?说一下它的实现原理?

     > 虚拟列表是一种根据滚动容器元素的可视区域来渲染长列表数据中的某一个部分数据的技术。
     >
     > ```js
     > // 固定高度
     > <template>
     >   <div class="list-box">
     >     <!-- 滚动条 -->
     >     <div id="scrollbar"></div>
     >     <div class="wrapper">
     >       <p v-for="(item, index) in render_list" :key="index">{{ item }}</p>
     >     </div>
     >   </div>
     > </template>
     > 
     > <script>
     > export default {
     >   data() {
     >     return {
     >       list: [],
     >       render_list: [],
     >       startIndex: 0,
     >       endIndex: 18,
     >       pageSize: 18,
     >       offset: 18
     >     };
     >   },
     >   // 要解决的是什么问题
     >   // 如果要展示的信息量过大也就是数据过多，比如一次性展示十万条数据
     >   // 通常的做法是采用分页，但是用户体验不是很友好
     >   // 因为有的用户喜欢向下滚动查看内容，如果不采取措施的话，随着用户的滚动
     >   // 页面堆积的节点越来越多，最后导致页面卡顿严重
     > 
     >   // 所以需要采用虚拟列表，就是对可见区域进行渲染，非可见区域不渲染或者部分渲染，从而达到极高性能
     >   // 当滚动事件发生的时候，动态计算可见区域需要展示的数据项，对非可见区域的数据进行删除
     >   created() {
     >     let arr = [];
     > 
     >     for (let i = 0; i < 1000; i++) {
     >       arr.push(i);
     >     }
     > 
     >     this.list = arr;
     > 
     >     this.render_list = this.list.slice(this.startIndex, this.endIndex);
     >   },
     > 
     >   mounted() {
     >     let box = document.querySelector(".list-box");
     >     let scrollbar = document.getElementById("scrollbar");
     >     let wrapper = document.querySelector('.wrapper')
     > 
     >     // 根据列表的长度，设置滚动条的高度
     >     scrollbar.style.height = this.list.length * 30 + "px";
     > 
     >     box.addEventListener(
     >       "scroll",
     >       () => {
     >         // 实时获取滚动条距离顶部的距离
     >         let scrollTop = box.scrollTop;
     >         wrapper.style.top = scrollTop + 'px';
     >         this.startIndex = Math.ceil(scrollTop / 30);
     >         this.endIndex = this.startIndex + this.pageSize + this.offset;
     >         this.render_list = this.list.slice(this.startIndex, this.endIndex);
     >         console.log(scrollTop, this.startIndex, this.endIndex, this.render_list);
     >       },
     >       false
     >     );
     >   },
     > };
     > </script>
     > 
     > <style lang='scss' scoped>
     > .list-box {
     >   width: 300px;
     >   height: 500px;
     >   border: 1px solid red;
     >   margin: 20px auto;
     >   overflow: auto;
     >   position: relative;
     > 
     >   .wrapper {
     >     position: absolute;
     >     top: 0px;
     >     left: 0px;
     >     width: 100%;
     >     p {
     >       height: 30px;
     >       border-bottom: 1px solid #e6e6e6;
     >       padding: 10px 10px;
     >     }
     >   }
     > }
     > </style>
     > ```
     >
     > 

166. 说说ES6对Object类型做了哪些优化更新?

     > ```js
     > // 1. 对象属性变量式声明，特别在解构赋值的时候，体现最为明显
     > let [name, age] = ['xiaoming', 18]
     > let person = {name, age}
     > 
     > // 2. 对象的解构赋值
     > let {name, age} = {name: 'xiaoming', age: 18}
     > 
     > // 3. 扩展运算符
     > 
     > // 4. Class类新增了Super关键字
     > 
     > // 5. Es6在Object原型上新增is方法，做两个对象的比较，NaN === NaN 为true
     > 
     > // 6. Es6在Object原型上新增了assign方法，用于对象新增属性或多个对象的合并
     > ```
     >
     > 

167. JS为什么要区分微任务和宏任务?

     > 区分微任务和宏任务是为了将异步队列任务划分优先级，通俗的理解就是为了插队。
     >
     > 一个 Event Loop，Microtask 是在 Macrotask 之后调用，Microtask 会在下一个 Event Loop 之前执行调用完，并且其中会将 Microtask 执行当中新注册的 Microtask 一并调用执行完，然后才开始下一次 Event Loop，所以如果有新的 Macrotask 就需要一直等待，等到上一个 Event Loop 当中 Microtask 被清空为止。由此可见，我们可以在下一次 Event Loop 之前进行插队。
     >
     > 如果不区分 Microtask 和 Macrotask，那就无法在下一次 Event Loop 之前进行插队，其中新注册的任务得等到下一个 Macrotask 完成之后才能进行，这中间可能你需要的状态就无法在下一个 Macrotask 中得到同步。

168. 讲一下你所了解的函数式编程

     > 函数式编程的关注点在于函数，而不是过程
     >
     > 强调的是如何通过函数的组合变换去解决问题，而不是通过我写什么样的语句去解决问题

     > **特点**
     >
     > 1. 函数是一等公民
     > 2. 声明式编程
     > 3. 惰性执行
     > 4. 无状态--给定相同的输入，一定有相同的输出

     > **如何理解函数是“一等公民”？**
     >
     > 这是函数式编程实现的前提，因为我们基本上都是在操作函数。
     >
     > 这个特性意味着函数和其他数据类型一样，处于平等地位，可以赋值给其它值，可以作为参数，或者作为别的函数的返回值

     > **如何理解声明式编程？**
     >
     > 函数式编程大多时候都是在声明我需要做什么，而不是怎么做。这种编程风格称为声明式编程。
     >
     > 好处是代码的可读性高，解放了大量的人力，因为它不关心具体的实现，因此它可以把优化能力交给具体的实现。

     > **惰性执行**
     >
     > 所谓的惰性执行指的是函数只是在需要的时候执行，即不产生无意义的中间变量，从头到尾几乎都在写函数。

     > **副作用**
     >
     > 在完成函数主要功能之外，完成的其它功能。
     >
     > 比如在函数中，最主要的功能是根据输入输出结果，在函数中我们常见的副作用就是随意操纵外部变量。
     >
     > 保证函数没有副作用的好处？
     >
     > 一来能保证数据的不可变性，二来能避免很多因为共享状态带来的问题。

     > **纯函数**
     >
     > 不依赖外部状态（无状态）：函数的运行结果不依赖全局变量，this等
     >
     > 没有副作用（数据不变）：不修改全局变量，不修改入参
     >
     > 相同的输入永远会得到相同的输出。
     >
     > 好处是什么？
     >
     > 方便测试，符合TDD（测试驱动开发）的思想
     >
     > 可缓存，因为相同的输入总是可以返回相同的输出，因此，我们可以提前缓存函数的执行结果
     >
     > ```js
     > function memoize(fn) {
     >  const cache = {};
     >  return function() {
     >    const key = JSON.stringify(arguments);
     >    var value = cache[key];
     >    if(!value) {
     >      value = [fn.apply(null, arguments)];  // 放在一个数组中，方便应对 undefined，null 等异常情况
     >      cache[key] = value; 
     >    }
     >    return value[0];
     >  }
     > }
     > 
     > const fibonacci = memoize(n => n < 2 ? n: fibonacci(n - 1) + fibonacci(n - 2));
     > console.log(fibonacci(4))  // 执行后缓存了 fibonacci(2), fibonacci(3),  fibonacci(4)
     > console.log(fibonacci(10)) // fibonacci(2), fibonacci(3),  fibonacci(4) 的结果直接从缓存中取出，同时缓存其他的
     > ```
     >
     > **更少的 Bug**：使用纯函数意味着你的函数中**不存在指向不明的 this，不存在对全局变量的引用，不存在对参数的修改**，这些共享状态往往是绝大多数 bug 的源头。

169. 了解函数式编程中的compose么?

     > **函数式编程两种必不可少的操作，一个是柯里化（currying），一个是函数组合（compose）**
     >
     > **柯里化**
     >
     > 将一个多元函数变成一个依次调用的单元函数
     >
     > ```js
     > f(a,b,c) => f(a)(b)(c)
     > ```
     >
     > 写一个 `curry` 版本的 `add` 函数
     >
     > ```js
     > var add = function(x) {
     > return function(y) {
     >  return x + y;
     > }; 
     > };
     > const increment = add(1);
     > 
     > increment(10); // 11
     > ```
     >
     > **函数组合**
     >
     > 目的是将多个函数合并为一个函数。
     >
     > ```js
     > const compose = (f, g) => x => f(g(x))
     > 
     > const f = x => x + 1;
     > const g = x => x * 2;
     > const fg = compose(f, g);
     > fg(1) //3
     > 
     > ```
     >
     > 函数组合的好处显而易见，它让代码变得简单富有可读性，同时通过不同的组合方式，我们可以组合出其他常用函数。

170. 数组map的正确用法

     ```js
     // 错误使用
     const list = [...];
     // 修改 list 中的 type 和 age
     list.map(item => {
       item.type = 1;
       item.age++; // 会产生副作用
     })
     
     // 正确的写法
     const list = [...];
     // 修改 list 中的 type 和 age
     const newList = list.map(item => ({...item, type: 1, age:item.age + 1}));
     ```

     

171. script标签里defer和async的区别

     - 设置defer，脚本在执行的时候，不会影响到页面的构造，也就是说，脚本会被延迟到整个页面都解析完毕在运行，异步加载资源，等DOM渲染后再按顺序执行JS
     - 设置async，async只用于外部脚本文件，与defer不同的是，async的脚本不保证按照它们的先后顺序执行，异步加载资源，加载完资源后立即执行
     - 如果你的标签必须写在head内，可以使用defer，设置了defer的script相当于写在了body的底部
     - 同时设置async和defer表现和async一致，两个属性都指定是为了在async不支持的时候启动defer

172. es6 class和构造函数的区别

     ```js
     1. class使用的时候，需要new，构造函数不是必须需要，因为可以当做普通函数来使用
     2. class内部定义的方法都是不可枚举的，构造函数原型上定义的方法可以枚举，采用`Object.keys()`可以验证
     3. 类不存在变量提升
     4. 设置实例对象的公共方法时，写法不一样
     Person.prototype = {
         constructor: Person,
         fn1(){},
     	fn2(){}
     }
     class Person{
        constructor(name,age){
        ...
        };
        fn1(){};
        fn2(){};
     }
     5. 设置静态属性时，class需要使用static关键词声明，静态方法也是一样
     Person.prop = 'prop'
     class Person {
         static prop = 'prop'
     }
     6. 设置私有属性时的写法不一样，构造函数是在变量名前加 _ ，注意这只是开发者约定的方式，用来区分，外部依然可以访问，但是class 采用 # 来定义私有变量，只能在类的内部采用this去访问，外部无法访问
     ```

     

173. 箭头函数this

     > 当我们使用箭头函数的时候，函数体内的this对象，就是定义时函数所在的对象，而不是使用时所在的对象
     >
     > 实际原因是箭头函数根本没有自己的this，它的this是继承外面的，因此内部的this就是外层代码块的this

174. JavaScript有同步和异步任务，浏览器是如何处理的？

     > **浏览器与JavaScript**
     >
     > 首先，浏览器是多线程的，js是单线程的
     >
     > 单线程的特点是一次只能干一件事，后一个任务的执行需要等待前一个任务的执行完成，这就可能出现较长时间的等待
     >
     > js在单线程中实现异步机制主要依赖浏览器的任务队列
     >
     > 任务队列分为主任务队列和等待任务队列
     >
     > 在主任务队列自上而下执行的时候，如果遇到一个异步任务，不会立即执行而是把它放到等待任务队列中排队
     >
     > 当主任务队列完成后才会到等待任务队列中进行查找，注意，主任务队列不完成，不管等待任务队列是否达到时间，都不做处理，会继续等待主任务队列完成
     >
     > 等待任务队列中的内容，先达到条件的会被重新放到任务队列中执行，然后接着去等待任务队列中查找
     >
     > 这就是因为js是单线程的，只能处理一件事情
     >
     > 单线程即意味着所有任务需要排队，前一个任务结束，才会执行后一个任务，如果前一个任务耗时很长，后一个任务就不得不一直等待。

     > **同步和异步任务**
     >
     > 同步：在一个线程上同一个时间内只能做一件事情，当前事情完成才能做下一个任务
     >
     > 异步：在主栈中执行一个任务，但是发现这个任务是一个异步的操作，会把它移除主栈放到等到任务队列中

     > 异步编程里面又分为**宏任务、微任务**
     >
     > 宏任务有：定时器、事件绑定、ajax、回调函数、node中的fs模块
     >
     > 微任务：promise、async\await、process.nextTick
     >
     > **执行顺序**
     >
     > 先执行主任务，执行完接着执行微任务，最后执行宏任务，按照条件的顺序依次执行
     >
     > 这种循环机制叫做事件循环机制。

     ```js
     async function as1() {
       console.log("as1 start");
       await as2();
       console.log("as1 end");
     }
     
     async function as2() {
       console.log("as2");
     }
     
     console.log("script start");
     
     setTimeout(function () {
       console.log("setTimeout");
     }, 0);
     
     as1();
     
     new Promise(function (resolve) {
       console.log("prom1");
       resolve();
     }).then(function () {
       console.log("prom2");
     });
     console.log("script end");
     
     //script start => as1 start => as2 => prom1 => script end
     //=> as1 start => prom2 => setTimeout
     ```

     

175. 说一下jQuery的Ajax、axios、fetch的区别

     - Ajax是对原生XHR的封装，增加了对JSONP的支持，但是Ajax本身是针对MVC编程的，不符合现在的MVVM编程，如果单纯为了使用Ajax引入jQuery，会使得项目的体积变大
     - axios本身也是对XHR的封装，只不过它是promise的实现版本，支持promise api，提供了一些并发请求的接口
     - fetch语法简洁，支持async/await

176. websocket如何断开重连?

177. 了解websocket吗？websocket如何进行握手的？

178. 说一下进程（process）和线程（thread）的区别？

     > 计算机的核心任务是CPU，承担了所有的计算任务。
     >
     > CPU就像是一座工厂，时刻在运行。
     >
     > 单个CPU一次只能运行一个任务，demo：
     >
     > 假定工厂的电力有限，一次只能供给一个车间使用。也就是说，一个车间开工的时候，其它车间都必须停工。
     >
     > 进程就好比工厂的车间，它代表CPU所能处理的单个任务，任一时刻，CPU总是运行一个进程，其它进程处于非运行状态。
     >
     > 一个车间里，可以有很多工人，他们协同完成一个任务。
     >
     > 线程就好比车间里的工人，一个进程可以包括多个线程。
     >
     > 车间的空间是工人们共享的，比如许多房间是每个工人都可以进出的，这代表一个进程的内存空间是共享的，每个线程都可以使用这些共享内存。
     >
     > 可是，每间房间的大小不一样，有些房间最多只能容纳一人，比如厕所。里面有人的时候，其他人就不能进去，这代表一个线程使用某些共享内存时，其它线程必须等他结束，才能使用这一块内存。
     >
     > 一个防止他人进入的简单方法，就是门口加一把锁。先到的人锁上门，后到的人看到上锁，就在门口排队，等锁打开在进去，这就叫“互斥锁”，防止多个线程同时读写某一块内存区域。
     >
     > 还有些房间，可以同时容纳n个人，比如厨房。也就是说，如果人数大于n，多出来的人只能在门口等着，这就好比某些内存区域只能供给固定数目的线程使用。
     >
     > 这时的解决方法，就是在门口挂n把钥匙。进去的人就取一把钥匙，出来时再把钥匙挂回原处。后到的人发现钥匙架空了，就知道必须在门口排队等着了。这种做法叫做“信号量”，用来保证多个线程不会互相冲突。
     >
     > 操作系统的设计，可以归纳为以下几点：
     >
     > - 多进程，允许多个任务同时运行
     > - 多线程，允许单个任务拆分成不同的部分运行
     > - 提供协调机制，一方面防止进程之间和线程之间产生冲突，另外一方面允许进程和线程之间共享资源

     > 进程：指在系统中正在运行的一个应用程序，程序一旦运行就是进程；进程----资源分配的最小单元。
     >
     > 线程：进行内部独立执行的一个单元执行流，线程----程序执行的最小单位。

     > 内存
     >
     > 我们通常所理解的内存就是我们见到的（2G/4G/8G/16G）的物理内存，它为什么存在于进程中呢？
     >
     > 实际上，这里的内存指的是逻辑内存。指的是内存的寻址空间，每个进程的内存是相互独立的。
     >
     > 否则的话会出现一个问题：我们把指针的值改一改就指向其它进程的内存了，通过这样就可以看到其它进程的内存了，容易造成信息泄露。

     > 进程之间通过TCP/IP的端口来实现交互的。
     >
     > 线程的通信就比较简单，有一大块共享的内存，只要大家的指针是同一个就可以看到各自的内存。

     > 进程要分配一大部分的内存，而线程只需要分配一部分栈就可以了
     >
     > 一个程序至少有一个进程，一个进程至少有一个线程
     >
     > 进程是资源分配的最小单位，线程是程序执行的最小单位
     >
     > 一个线程可以创建和撤销另外一个线程，同一个进程中的多个线程之间可以并发执行

179. 为什么WeakMap和WeakSet的键只能使用对象？在什么情况下使用？

     ```js
     // 使用对象是为了在赋值的时候让对象的地址和赋的值关联起来，如果采用基本数据类型，不合适，因为传递的是值，而不是引用。
     
     // const a = {};
     // 在创建对象时，分配了一块内存，并把这块内存的地址传给 a
     // m.set(a, 100);
     // 执行 set 操作时，实际上是将 a 指向的内存地址和 100 关联起来
     
     const ba = "abc";
     // 由于基本数据类型在传递时，传递的是值，而不是引用。
     m.set(ba, 100);
     // 所以执行 set 操作时，实际上是将新的 'abc' 和 100 关联起来，而不是原来 a 变量指向的那个。
     // 那这样就会有问题，m 里存储的永远是没有被引用的键，随时都会被回收。
     
     WeakMap的key必须是对象，WeakSet没有key，只有value，并且value要求是对象。
     WeakMap和WeakSet都是弱引用的。
     
     弱引用：引用对象的时候，对象的引用计数器不会增加，在回收对象的时候，不会去考虑WeakMap和WeakSet是否引用了这个对象。
     ```

     ```js
     // 通过WeakMap缓存计算结果
     ```

     

180. require模式引入的查找方式是什么?

     > nodejs中的模块分为内置模块和文件模块
     >
     > 内置模块：就是nodejs原生提供的功能，比如fs、http等，这些模块在nodejs进程起来时就加载了。
     >
     > 文件模块：node_modules下面的模块都是文件模块。

     > 加载顺序
     >
     > 加载顺序是指当我们require(X)时，应该按照什么顺序去哪里找X。
     >
     > > 1. 优先加载内置模块，即使有同名文件，也会优先使用内置模块。
     > > 2. 不是内置模块，先去缓存找【加载过一次就回把这个文件进行缓存到Module._cache中】。
     > > 3. 缓存没有就去找对应路径的文件。
     > > 4. 不存在对应的文件，就将这个路径作为文件夹加载。
     > > 5. 对应的文件和文件夹都找不到就去`node_modules`下面找。
     > > 6. 还找不到就报错了。

     > 加载文件夹
     >
     > 前面提到找不到文件就找文件夹，但是不可能将整个文件夹都加载进来，加载文件夹的时候也是有一个加载顺序的：
     >
     > > 1. 先看看这个文件夹下面有没有`package.json`，如果有就找里面的`main`字段，`main`字段有值就加载对应的文件。所以如果大家在看一些第三方库源码时找不到入口就看看他`package.json`里面的`main`字段吧，比如`jquery`的`main`字段就是这样：`"main": "dist/jquery.js"`。
     > > 2. 如果没有`package.json`或者`package.json`里面没有`main`就找`index`文件。
     > > 3. 如果这两步都找不到就报错了。

     > 支持的文件类型
     >
     > require主要支持三种文件类型
     >
     > > 1. .js
     > > 2. .json
     > > 3. .node，.node文件是C++编译后的二进制文件，纯前端一般很少接触这个类型

     ```js
     // Nodejs模块加载的功能全部在Module类里面
     // require是Module类的一个实例方法
     ```

     

181. Reflect 对象创建目的是什么?

     > - 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。
     >
     > 

182. 面向对象的三要素是什么，分别是什么意思?

     > 封装
     >
     > 把客观事物封装成抽象的类，并且类可以把自己的数据和方法只让可信的类或者对象操作，对不可信的进行信息隐藏

     > 继承
     >
     > 使用现有类的所有功能并在无需重新编写原来的类的情况下对这些功能进行扩展

     > 多态
     >
     > 建立在继承的基础上的，先有继承才能有多态。
     >
     > 多态是指不同的子类在继承父类后分别都重写覆盖了父类的方法，即父类同一个方法在继承的子类中表现出不同的形式。

183. 说一下你所了解的javascript的作用域链?

     > JS中的执行环境包含全局执行环境和函数执行环境。
     >
     > 全局执行环境处在最外层，每一个函数都有一个自己的执行环境，叫做函数执行环境。
     >
     > 在web浏览器中，全局执行环境被认为是window对象，某个执行环境中的所有代码执行完毕后，该环境被销毁，保存在其中的所有的变量和函数定义也随之销毁，全局执行环境直到应用程序退出例如关闭网页或浏览器才会被销毁。

     > 当代码在一个环境中执行时，会创建变量对象的一个作用域链，作用域链的前端是当前执行的代码所在环境的变量对象。
     >
     > 如果这个环境是函数，则将其活动对象（AO）作为变量对象。
     >
     > 活动对象在最开始的时候，只包含一个对象叫做arguments。
     >
     > 作用域链的末端是全局执行环境的变量对象。

     > 通过作用域链，我们可以访问到外层环境的变量和函数。
     >
     > 当我们查找一个变量的时候，如果当前执行环境中没有找到，我们可以沿着作用域链向后查找。

184. 如何判断一个对象是否属于某个类(构造函数)?

     - 使用instanceof运算符判断构造函数的prototype属性是否出现在对象的原型链的任何位置
     - 通过constructor属性，对象的constructor属性指向对象的构造函数
     - 如果需要判断的是某个内置的引用类型的话，可以使用Object.prototype.toString.call()方法来打印对象的[[class]]属性来进行判断

185. 检测浏览器版本有哪些方式?

     ```js
     // 1. 利用 navigator.userAgent
     // 2. 利用功能检测，根据每个浏览器独有的特性进行判断，如IE下独有的ActiveXObject
     ```

     

186. 内部属性[[Class]]是什么?

     ```js
     // 所有typeof返回值为"object"的对象（比如数组）都包含一个内部属性[[Class]]，我们可以把它看做一个内部的分类，而不是传统意义上的类，这个属性无法直接访问，一般可以通过Object.prototype.toString去访问
     
     // 多数情况下，对象内部的[[Class]]属性和创建这个对象的构造函数是一致的，不过也不是总这样
     
     // 基本类型值的[[Class]]属性
     // null和undefined
     // null和undefined的构造函数并不存在，但是内部的[[Class]]属性是Null和Undefined
     console.log(Object.prototype.toString.call(null)); //[object Null]
     console.log(Object.prototype.toString.call(/\d/)); // [object RegExp]
     // 其它基本类型值得到的是其包装对象
     
     // 包装对象
     // 由于JS的基本数据类型没有.length和.toString这样的属性和方法，需要通过包装对象才能访问，此时JavaScript引擎会自动为基本类型包装一个对象
     
     // 使用valueof可以拆封
     var s = new String( "abc" );
     console.log(s.valueOf());
     ```

     

187. for...in和Object.keys的区别

     ```js
     // for...in 用来枚举对象的属性，但是它会枚举对象原型链上的所有可枚举属性，但是Object.keys不会
     // for...in在某些情况下，可能按照随机顺序遍历数组的元素
     function Parent() {
         this.parent = 'parent'
     }
     
     function Person() {
         this.name = 'name'
         this.age = 20
     }
     
     Person.prototype = new Parent();
     Person.prototype.constructor = Person;
     
     let obj = new Person()
     
     console.log(Object.keys(obj))
     
     for (let key in obj) {
         console.log(key, '---', obj[key])
     }
     
     // for...of不支持遍历普通对象
     let obj = {
         name: 'obj',
         age: 20,
         sm: Symbol()
     }
     for (let key of obj) { // 报错 obj is not iterable
         console.log(key, obj[key])
     }
     // 采用for...of遍历数组的时候，拿到的是每一项的值，而非索引
     ```

     

188. 请说出目前主流的js模块化实现的技术有哪些?他们的区别在哪儿?

     > 目前流行的JS模块化规范有CommonJS、AMD、CMD以及ES6的模块系统

     > **CommonJS**
     >
     > *CommonJS的出发点：*js没有完善的模块系统，标准库较少，缺少包管理工具，伴随着Nodejs的兴起，能让js在任何地方运行，特别是服务端，也达到了具备开发大型项目的能力，所以commonjs出现了。
     >
     > Nodejs是commonjs规范的主要实践者，有四个重要的环境变量为模块化的实现提供支持：module、exports、require、global。
     >
     > 实际使用的时候，使用module.exports定义当前模块对外输出的接口，用require加载模块。
     >
     > commonjs用同步的方式加载模块。
     >
     > 但是在浏览器端，由于网络原因的限制，更合理的是使用异步加载。
     >
     > > *CommonJS的规范*
     > >
     > > - 一个文件就是模块，拥有单独的作用域
     > > - 普通方式定义的变量、函数、模块都属于该模块的内容
     > > - 通过require加载模块
     > > - 通过exports和module.exports来暴露模块的内容
     >
     > > *注意事项*
     > >
     > > - 当exports和module.exports同时存在的时候，module.exports会覆盖exports
     > > - 当模块内全是exports时，就等同于module.exports
     > > - exports就是module.exports的子集
     > > - 所有代码都运行在模块作用域内，不会污染全局
     > > - 模块可以多次加载，但是在第一次加载的时候，会对模块进行缓存，以后在加载的时候直接读取缓存结果
     > > - 模块加载顺序：按照代码出现的顺序同步加载

     > **ES6模块化**
     >
     > ES6在语言标准的层面上，实现了模块化功能，而且实现的相当简单，主要为浏览器和服务器通用的解决方案。
     >
     > 其模块功能主要由两个命令构成：export和import，export用于规定对外暴露接口，import用于引入其它模块的功能。
     >
     > 其实ES6还提供了export default命令，为模块指定默认输出，对应的import语句不需要使用大括号，类似AMD的引用写法
     >
     > ES6的模块不是对象，import命令会被JS引擎静态分析，在编译的时候就会引入模块代码，而不是在代码运行的时候加载，所以无法实现条件加载。

     > **AMD**
     >
     > 异步加载模块。它是一个在浏览器端模块化开发的规范。
     >
     > 不是原生JS的规范，使用AMD规范进行页面的开发需要用到对应的函数库，RequireJS。
     >
     > AMD规范采用异步方式进行加载，模块的加载不影响后面的语句运行，所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
     >
     > 使用require.js实现AMD规范的模块化：
     >
     > ```js
     > require.config() // 指定引用路径
     > define() // 定义模块
     > require() // 加载模块
     > ```
     >
     > *RequireJS主要解决的问题*
     >
     > > - 文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
     > > - js加载的时候浏览器会停止页面的渲染，加载的文件越多，页面响应时间越长
     > > - 异步前置加载

     > **CMD**
     >
     > CMD是另外一种js模块化方案，与AMD很类似，不同点在于：AMD推崇依赖前置，提前执行，CMD推崇依赖就近，延迟执行，此规范其实是在sea.js【遵循CMD规范】推广过程中产生的。
     >
     > ```js
     > //定义没有依赖的模块
     > define(function(require,exports,module){
     >     export.xxx=val
     >     module.exports=val
     > })
     > //定义有依赖的模块
     > define(function(require,exports,module){
     >     //同步引入模块
     >     var module1=reuqire('./module1.js')
     >     //异步引入模块
     >     require.async('./module2.js',function(val){
     >         //代码逻辑
     >     })
     >     exports.xxx=value 
     > })
     > //引入模块
     > define(function(require){
     >     const val1=require('./module1.js')
     >     val1.show()
     > })
     > ```

     > **UMD**
     >
     > 一种整合CommonJS和AMD规范的方法，希望解决跨平台模块方案。
     >
     > ```js
     > (function (window,factory){
     >     if(typeof exports === 'Object'{
     >         module.exports=factory();
     >     }else if(typeof define === 'function' && define.amd){
     >         define(factory);
     >     }else{
     >         window.eventUtil=factory()
     >     })
     > })(this,function(){
     >     //执行代码
     > })
     > // 不支持的话 typeof define就等于undefined
     > ```

     > **总结**
     >
     > - CommonJS是同步加载的。主要是在nodejs也就是服务端应用的模块化机制，通过`module.export`导出声明，通过`require()`加载。每一个文件都是一个模块。它有自己的作用域，文件内的变量，属性函数等不能被外界访问。node会将模块缓存，第二次加载会直接在缓存中获取
     > - AMD是异步加载的。主要应用在浏览器环境下。requireJS是遵循AMD规范化的模块化工具。它是通过`define()`定义声明，通过`require(['a','b'],function(a,b){})`加载
     > - ES6的模块的运行机制与Common不一样，js引擎对脚本静态分析的时候，遇到模块加载指令后会生成一个只读引用，等到脚本真正执行的时候才会通过去模块中获取值，在引用到执行的过程中模块中的值发生了变化，导入的这里也会跟着变化，ES6模块是动态引用，并不会缓存值，模块里总是绑定其所在的模块。

     

189. 三种事件模型是什么？

     > 现代浏览器一共有三种事件模型
     >
     > - DOM0级事件模型，第一种事件模型是最早的DOM0级模型，这种模型不会传播，所以没有事件流的概念，但是现在有的浏览器支持以冒泡的方式实现，它可以在网页中直接定义监听函数，也可以通过js属性来指定监听函数，这种方式是所有浏览器都兼容的。
     >
     >   ```js
     >   // 浏览器会把一些常用事件挂载到元素对象的私有属性上，让我们可以实现DOM0事件绑定。
     >   // DOM0级事件绑定通常有两种方式，一种是直接将事件处理程序作为html元素的属性值：
     >   // 示例一
     >   <div onclick="alert('点了我一下')">点击一下</div>
     >   // 或
     >   <div onclick="clickFn()">点击一下</div>
     >   <script>
     >     function clickFn(){
     >       alert('点了我一下');
     >     }
     >   </script>
     >   
     >   // 另一种是，通过js将事件处理程序添加到元素属性上：
     >   // 示例二
     >   <div>点击一下</div>
     >   <script>
     >     document.querySelector('div').onclick = clickFn;
     >     function clickFn(){
     >        alert('点了我一下');
     >     }
     >   </script>
     >   
     >   // DOM0级的事件监听，移除时只需将其属性设置为null即可。
     >   // 需要注意的是：DOM0级的事件监听，只能为其指定一个事件处理函数，当指定了多个，后者会把前面的覆盖。
     >   // 示例三
     >   <button>点击一下</button>
     >   <script>
     >     document.querySelector('button').onclick = clickFn1; 
     >     document.querySelector('button').onclick = clickFn2; 
     >     function clickFn1(){
     >       console.log('第一个')
     >     };
     >     function clickFn2(){
     >       console.log('第二个')
     >     }
     >   </script>
     >   ```
     >
     >   
     >
     > - IE事件模型 在该事件模型中，一次事件共有两个过程，事件处理阶段，和事件冒泡阶段。事件处理阶段会首先执行目标元素绑定的监听事件。然后是事件冒泡阶段，冒泡指的是事件从目标元素冒泡到 document，依次检查经过的节点是否绑定了事件监听函数，果有则执行。这种模型通过 attachEvent 来添加监听函数，可以添加多个监听函数，会按顺序依次执行。
     >
     >   ```js
     >   // IE的事件机制没有捕获阶段，事件流是非标准的，只有目标阶段和冒泡阶段。
     >   
     >   // 事件注册方式
     >   <button id="btn">点我</button>
     >   <script type="text/javascript">
     >   
     >   var target = document.getElementById("btn");
     >   
     >   target.attachEvent('onclick',function(){
     >           alert("我是button");
     >   });
     >   
     >   </script>
     >   // 与之对应的也有事件的移除函数 ：detachEvent() ；
     >   // 同样也有阻止事件冒泡的方法：首先获得event对象，e = window.event（可见IE中的event对象是个全局属性)，然后设置event的cancelBubble属性为true即可e.cancelBubble = true;
     >   // 阻止默认事件发生：先也是获得event对象，设置returnValue属性为false即可，e.returnValue = false;
     >   ```
     >
     >   
     >
     > - DOM2 级事件模型 在该事件模型中，一次事件共有三个过程，第一个过程是事件捕获阶段。捕获指的是事件 document 一直向下传播到目标元素，依次检查经过的节点是否绑定了事件监听函数，如果有则执行。后面两个阶段和 IE 事件模型的两个阶段相同。这种事件模型，事件绑定的函数是 addEventListener，其中第三个参数可以指定事件是否在捕获阶段执行。
     >
     >   ```js
     >   // DOM2级事件模型分为三个阶段：
     >   // 1. 捕获阶段：事件从Document对象沿着文档树向下传播给节点。如果目标的任何一个祖先专门注册了事件监听函数，那么在事件传播的过程中就会运行这些函数。（0级DOM事件模型处理没有捕获阶段）
     >   // 2. 目标阶段：下一个阶段发生在目标节点自身，直接注册在目标上的适合的事件监听函数将运行。（一般将此阶段看作冒泡阶段的一部分）
     >   // 3. 冒泡阶段：这个阶段事件将从目标元素向上传播回Document对象（与捕获相反的阶段）。虽然所有事件都受捕获阶段的支配，但并不是所有类型的事件都冒泡。
     >   
     >   // DOM2级事件绑定是使用addEventListener方法（IE使用attachEvent方法）：
     >   // 浏览器会给当前元素的某个事件行为开辟一个事件池（事件队列）【浏览器有一个统一的事件池，每个元素绑定的行为都放在这里，通过相关标志区分】，当我们通过addEventListener/attachEvent进行事件绑定的时候，会把绑定的方法放在事件池中；当元素的某一行为被触发，浏览器回到对应事件池中，把当前放在事件池的所有方法按序依次执行；
     >   
     >   // 示例四
     >   <div>
     >     <button>点击一下</button>
     >   </div>
     >   <script>
     >     document.querySelector('button').addEventListener('click',clickBtn);
     >     document.querySelector('div').addEventListener('click', bubbleDiv)
     >     document.body.addEventListener('click', bubbleBody)
     >     document.querySelector('div').addEventListener('click', captureDiv, true)
     >     document.body.addEventListener('click', captureBody, true)
     >     function clickBtn(){ console.log('click button'); }
     >     function bubbleDiv(){ console.log('bubble div'); }
     >     function bubbleBody(){ console.log('bubble body'); }
     >     function captureDiv(){ console.log('capture div'); }
     >     function captureBody(){ console.log('capture body'); }
     >   </script>
     >   // 使用addEventListener添加的事件监听，移除时需使用removeEventListener方法，且其参数需与addEventListener的参数完全一致！
     >   // 与DOM0级不同的是，使用addEvenListener可以为当前元素的某一事件行为绑定多个不同方法，同样的，可以使用removeEventListener移除当前元素的某一事件行为的多个不同方法。
     >   // 需要注意的是，事件处理函数若是匿名函数，则无法被移除！
     >   ```
     >
     >   
     >
     > - ***注意，没有DOM1级事件模型，因为DOM1级标准中没有定义事件相关的内容***

190. 描述下JS中Prototype的概念？

     > 每一个函数就是一个对象，函数对象有一个子对象叫prototype对象，prototype表示函数的原型。
     >
     > 构造函数创造的实例对象内部有一个内部属性`__proto__`,作为一个指针，指向构造函数原型所指的对象，所有的实例共享原型对象上的属性和方法。

191. 说下JS继承的原理？

     > 在`oop`中，通过类的继承来实现代码的复用，通过实例化一个类可以创建许多对象，在js中继承是通过原型来实现的。

     ```js
     Object.prototype.__proto__ === null
     Object.__proto__ === Function.prototype
     Function.prototype.__proto__ === Object.prototype
     Function.__proto__ === Object.prototype
     ```

     

192. 请用JS代码实现事件代理

     > 什么是事件代理
     >
     > 事件委托或事件代理：根据红宝书来说：就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。举例：dom需要事件处理程序，我们都会直接给它设置事件处理程序。但是在ul中1000个li全部需要添加事件处理程序，其具有相同的点击事件，那么可以根据for来进行遍历，也可以在ul上来进行添加。在性能的角度上来看，在ul建立事件会减少dom的交互次数，提高性能。

     > 事件代理的原理
     >
     > 事件委托就是利用事件的冒泡原理来实现的，就是事件从最深的节点开始，然后逐步向上传播事件。
     >
     > 举例：页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div,有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul、li、a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件

     ```js
     // 实现ul中li的事件代理
     window.onload=function(){
         var oBtn=document.getElementById('btn');
         var oUl=document.getElementById('ul1');
         var aLi=oUl.getElementsByTagName('li');
         var num=4;
         //事件委托，添加的子元素也有事件
         oUl.onmouseover=function(e){
             var e=e||window.event;
             var target=e.target||e.srcElement;
             if(target.nodeName.toLowerCase()==='li'){
                 target.style.background="red";
             }
         };
         oUl.onmouseout=function(e){
             var e=e||window.event;
             var target=e.target||e.srcElement;
             if(target.nodeName.toLowerCase()==='li'){
                 target.style.background="blue"
             }
         };
         //添加新节点
         oBtn.onclick=function(){
             num++;
             var oLi=document.createElement('li');
             oLi.innerHTML=111*num;
             oUl.appendChild(oLi)
         };
     }
     ```

     ```js
     // 简单封装一个事件代理的通用代码
     // ! 代表是匿名函数自执行
     !function (root, doc) {
         class Delegator {
             constructor(selector) {
                 this.selector = selector;
                 // 委托给谁进行代理
                 this.root = document.querySelector(this.selector);//父级dom
                 this.delegatorEvents = {}//代理元素及事件
     
                 //代理逻辑
                 this.delegator = (e) => {
                     let currentNode = e.target//目标节点
                     const targetEventList = this.delegatorEvents[e.type];
                     //如果当前目标节点等于事件目前所在的节点，不再往上冒泡
                     while (currentNode !== e.currentTarget) {
                         targetEventList.forEach(target => {
                             if (currentNode.matches(target.matcher)) {
                                 //开始委托并把当前目标节点的event对象传过去
                                 target.callback.call(currentNode, e)
                             }
                         })
                         currentNode = currentNode.parentNode;
                     }
                 }
     
             }
     
             //绑定事件  event---绑定事件类型  selector---需要被代理的选择器  fn---触发函数
             on = (event, selector, fn) => {
                 //相同事件只能添加一次，如果存在，则在对应的代理事件里添加
                 if (!this.delegatorEvents[event]) {
                     this.delegatorEvents[event] = [{
                         matcher: selector,
                         callback: fn
                     }]
                     this.root.addEventListener(event, this.delegator)
                 } else {
                     this.delegatorEvents[event].push({
                         matcher: seletor,
                         callback: fn
                     })
                 }
                 return this;
             }
     
             // 移除事件
             destory = () => {
                 Object.keys(this.delegatorEvents).forEach(eventName => {
                     this.root.removeEventListener(eventName, this.delegator)
                 })
             }
     
     }
     
     
     root.Delegator = Delegator;
     }(window, document);
     
     console.log(window)
     let delegator = new Delegator('#ul1');
     
     delegator.on('mouseover', 'li', (e) => {
         var e = e || window.event;
         var target = e.target || e.srcElement;
         if (target.nodeName.toLowerCase() === 'li') {
             target.style.background = "red";
         }
     });
     
     delegator.on('mouseout', 'li', e => {
         var e = e || window.event;
         var target = e.target || e.srcElement;
         if (target.nodeName.toLowerCase() === 'li') {
             target.style.background = "blue"
         }
     });
     
     btn.onclick = function () {
         var oLi = document.createElement('li');
         oLi.innerHTML = 111;
         delegator.root.appendChild(oLi)
     };
     ```

     

193. 说一下栈和堆的区别，垃圾回收时栈和堆的区别？（**涉及到垃圾回收机制**）

     > `栈：`其操作系统自动分配释放，存放函数的参数值和局部变量的值等。其操作方式类似于数据结构中的栈。简单的理解就是当定义一个变量的时候，计算机会在内存中开辟一块存储空间来存放这个变量的值，这块空间叫做栈，然而栈中一般存放的是基本数据类型，栈的特点就是先进后出(或者后进先出)
     >
     > `堆：`一般由程序员分配释放，若程序员不释放，程序结束时可能由OS回收，分配方式倒是类似于链表。其实在堆中一般存放变量的是一些对象类型
     >
     > - \>1.存储大小
     >
     > 栈内存的存储大小是固定的，申请时由系统自动分配内存空间，运行的效率比较快，但是因为存储的大小固定，所以容易存储的大小超过存储的大小，导致溢栈。
     >
     > 堆内存的存储的值是大小不定，是由程序员自己申请并指明大小。因为堆内存是new分配的内存，所以运行的效率会比较低
     >
     > - \>2.存储对象
     >
     > 栈内存存储的是基础数据类型，并且是按值访问的，因为栈是一块连续的内存区域，以`后进先出`的原则存储调用的，所以是连续存储的
     >
     > 堆内存是向高地址扩展的数据结构，是不连续的内存区域，系统也是用链表来存储空闲的内存地址，所以是不连续的。因为是记录的内存地址，所以获取是通过引用，存储的是对象居多
     >
     > - \>3.回收
     >
     > 栈的回收是系统控制实现的
     >
     > 堆内存的回收是人为控制的，当程序结束后，系统会自动回收

     > 栈内存的数据只要结束，则直接回收
     >
     > 堆内存中的对象回收标准是否可达，在V8中对象先分配到新生代的From中，如果不可达直接释放，如果可达，就复制到TO中，然后将TO和From互换。当多次复制后依然没有回收，则放入老生代中，进行标记回收。之后将内存碎片进行整合放到一端。

194. 介绍js全部数据类型，基本数据类型和引用数据类型的区别

     > 内置类型
     >
     > null、undefined、boolean、number、string、object、symbol、bigint

     > 基本数据类型
     >
     > undefined、null、number、boolean、string、symbol
     >
     > 基本数据类型是按值访问的，就是说我们可以操作保存在变量中的实际的值
     >
     > 基本数据类型是存放在栈区的
     >
     > 基本数据类型的比较是值的比较

     > 除了基本数据类型之外，剩下的就是引用类型了，也可以说是对象
     >
     > 比如，object、array、function、regext、date
     >
     > 引用类型是同时存在栈区和堆区的
     >
     > 引用类型可以添加属性和方法

     > 基本数据类型和引用数据类型的区别
     >
     > - 声明变量时不同的内存分配
     >
     >   > `原始值：`存储在栈(stack)中的简单数据段，也就是说，它们的值直接存储在变量访问的位置。是因为这些原始类型占据的空间是固定的，所以可以将它们存储在较小的内存区域---栈中，这样存储便于迅速查询变量的值.
     >   >
     >   > `引用值：`存储在堆(heap)中的对象。也就是说，存储在变量处的值是一个指针(point)，指向存储对象的内存地址。是因为引用值的大小会改变，所以不能把它放在栈中，否则会降低变量查询的速度。相反，放在变量的栈空间中的值是该对象存储在堆中的地址。地址的大小是固定的，所以把它存储在栈中对变量性能无任何负面影响。
     >
     > - 不同的内存分配机制也带来了不同的访问机制
     >
     >   > 在js中是不允许直接访问保存在堆内存中的对象的，所以在访问一个对象时，首先得到的是这个对象在堆内存中的地址，然后再按照这个地址去获得这个对象中的值，这就是传说中的按引用访问。而原始类型的值是可以直接访问到的。
     >
     > - 复制变量时的不同
     >
     >   > `原始值：`在将一个保存着原始值的变量复制给另一个变量时，会将原始值的副本赋值给新变量，此后这两个变量是完全独立的，它们只是拥有相同的value而已.
     >   >
     >   > `引用值：`在将一个保存着对象内存地址的变量复制给另一个变量时，会把这个内存地址赋值给新变量，也就是说这两个变量都指向了堆内存中同一个对象，他们中任何一个做出的改变都会反映在另一个身上。(需要理解的一点是：复制对象时并不会在堆内存中新生成一个一模一样的对象，只是多了一个保存指向这个对象指针的变量罢了)
     >
     > - 参数传递的不同(把实参复制给形参的过程)
     >
     >   > 首先我们应该明确的一点是：ESCMAScript中所有函数的参数都是按值来传递的。 但是为什么涉及到原始类型与引用类型的值时仍然有区别呢？这就是因为内存分配时的差别。
     >   >
     >   > `原始值：`只是把变量里的值传递给参数，之后参数和这个变量互不影响
     >   >
     >   > `引用值：`对象变量里面的值是这个对象在堆内存中的内存地址，这一点很重要！因此它传递的值也就是这个内存地址，这也就是为什么函数内部对这个参数的修改会体现在外部的原因，因为它们都指向同一个对象。

195. 关于DOM，dom2和dom3，dom的版本区别，dom的节点类型，获取dom的方法

     > **dom2和dom3**
     >
     > dom2和dom3的目的在于扩展DOM API，以满足操作XML的所有需求，同时提供更好的错误处理和特性检测能力。
     >
     > dom0就是直接通过onclick写在html里面的事件。
     >
     > DOM2是通过addEventListener绑定的事件, 还有IE下的DOM2事件通过attachEvent绑定; DOM3是一些新的事件。

     > **dom的节点类型**
     >
     > 根据nodeType判断
     >
     > - 元素节点--1
     > - 文本节点--3
     > - 注释节点--8

     > **获取dom的方法**
     >
     > 通过id--getElementById
     >
     > 通过class--getElementsByClassName
     >
     > 通过tagName--getElementsByTagName

196. 词法作用域

     > 词法作用域是作用域的一种工作模型。
     >
     > 由此可以看出，没有作用域就没有词法作用域。
     >
     > “词法作用域是作用域的一种工作模型”，作用域有两种工作模型，在JavaScript中的词法作用域是比较主流的一种，另一种动态作用域（比较少的语言在用）。

     > 作用域就是一套规则，确定如何查找变量（标识符）。
     >
     > 在查找的时候，先在自己所处的作用域中查找，没有找到，再去全局作用域中查找，有一个往外层查找的过程，我们好像是顺着一条链条从下到上查找变量，这条链条就是作用域链。

     > 作用域嵌套。
     >
     > 在还没有接触到es6的let、const之前，只有函数作用域和全局作用域，函数作用域包含在全局作用域里面，而函数作用域又可以继续嵌套函数作用域。

     > 在代码执行之前从上到下的进行编译，当遇到某个用var声明的变量的时候，先检查在当前作用域下是否存在了该变量。如果存在，则忽略这个声明；如果不存在，则在当前作用域中声明该变量。

     > 词法作用域
     >
     > 是静态的作用域，在你写代码的时候就已经确定了。
     >
     > **注1**：eval()和with可以通过其特殊性用来“欺骗”词法作用域，不过正常情况下都不建议使用，会产生性能问题。
     >
     > **注2**：ES6中有了let、const就有了块级作用域，后面会专门介绍。
     >
     > 词法作用域是定义在词法阶段的作用域，js在编译过程中在词法分析的阶段会形成抽象语法树，在同一时间还会根据相应的分析生成对应的作用域。根据这种工作机制我们不难知道，某个标识符属于哪个作用域、作用域的嵌套关系（作用域链）其实在书写时已经决定了。
     >
     > ```js
     > var a = 'global'
     > 
     > function foo() {
     >   console.log(a);
     > }
     > 
     > function bar() {
     >   var a = 'bar'
     >   foo()
     > }
     > 
     > bar()  // global
     > // 这个简单的例子有些人可能会觉得打印的结果为 bar，但事实上并不是。需要我们注意的是 JavaScript 应用的是词法作用域模型，所以 函数的作用域取决于它声明的位置与实际调用位置无关 ，上述例子的作用域嵌套关系如下图所示：
     > ```
     >
     > ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cf756e5740a449cb018be427fefb6ba~tplv-k3u1fbpfcp-watermark.image)
     >
     > 按照上图所示的嵌套关系，我们知道在 `foo` 函数执行的时候需要 `a` 变量，但是在当前作用域当中查找不到，引擎就会顺着作用域链向外层寻找，此时全局作用域当中正好有名为 `a` 的变量所以打印的结果是 global。

     > 欺骗词法作用域
     >
     > 因为 JavaScript 使用的是词法作用域模型，所以作用域在书写时已经确定，那我们有没有能够在运行时动态改变作用域的方法呢？
     >
     > 当然有，接下来我们就来看看 eval 和 with 它们是如何动态改变作用域的。
     >
     > `eval(...)` 函数会接受一个字符串作为参数，并且将这句字符串视为在书写时就存在的代码一样去执行，通过这个函数就可以实现欺骗词法作用域的效果，请看以下例子：
     >
     > ```js
     > var a = 'global'
     > 
     > function foo(str) {
     >   eval(str)
     >   console.log(a)
     > }
     > 
     > foo('var a = "eval"') // eval
     > // 如果我们遵照词法作用域模型来分析上述的代码，在词法阶段应该只有全局作用域当中存在值为 global 的变量 a。但是在 foo 函数运行时 eval（...） 函数会将 var a = "eval" 字符串当作本身就书写在这里的代码一样执行。这时 foo 函数作用域内部就生成了一个值为 eval 的变量 a ，因为同名变量的遮蔽作用所以最终打印出了 eval 。
     > 
     > ```
     >
     > `with` 关键字可能大家都很陌生，我们先来看一段代码再来解释 `with` 的工作机制。
     >
     > ```js
     > function foo(obj) {
     >   with (obj) {
     >     a = 2
     >   }
     > }
     > 
     > var o = {
     >   a: 3
     > }
     > 
     > foo(o)
     > 
     > console.log(o.a) // 2
     > // 上述代码中，with 使得 o 对象上的属性 a 被重新赋值了，其实 with 会利用传入的对象开辟一个新的作用域，并且将对象上的属性作为当前作用域内的变量，这个作用域在词法阶段其实并不存在。
     > ```
     >
     > `with` 能够创建一个新的作用域，在这个作用域当中查找变量仍然遵循一般的规则，所以我们需要避免因为 `with` 导致的误生成全局变量的行为，将上面的例子修改一下：
     >
     > ```js
     > function foo(obj) {
     >   with (obj) {
     >     a = 2
     >   }
     > }
     > 
     > var o = {
     >   b: 3
     > }
     > 
     > foo(o)
     > 
     > console.log(o.a, a) // undefined 2
     > // with 当中需要对 a 变量进行赋值操作，所以引擎会使用 LHS 查询方式查找变量 a。从 with 生成的作用域出发直到查询到全局作用域都无法找到变量 a ，此时引擎就会在全局作用域当中创建新变量并执行对它的赋值操作。
     > 
     > // LHS，可以理解为赋值
     > // RHS，理解为查询值
     > console.log(name); // 输出undefined
     > var name = 'iceman'; 
     > // 输出变量的值的时候的查找类型是RHS，找到变量为其赋值的查找类型是LHS。
     > ```
     >
     > 

197. IntersectionObserver，交叉观察器

     - 网页开发时，常常需要了解某个元素是否进入了“视口”，也就是用户能不能看到它
     - 由于可见的本质是：目标元素和视口产生一个交叉区，所以这个API叫做“交叉观察器”
     - 浏览器原生提供的构造函数
     - 这是一个异步的API，不随着模板元素的滚动同步触发，这个观察器的优先级非常低，只在其它任务执行完，浏览器有了空闲才会执行

     ```js
     // 用法
     // callback:可见性发生变化时的回调函数
     // option：可选参数，配置对象
     // 返回值io是一个观察器实例，实例上有个方法叫做 observer 方法可以指定观察哪个DOM节点
     option = {
         threshold // 属性决定了什么时候触发回调函数。它是一个数组，每个成员都是一个门槛值，默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数。
         // 用户可以自定义这个数组。比如，[0, 0.25, 0.5, 0.75, 1]就表示当目标元素 0%、25%、50%、75%、100% 可见时，会触发回调函数。
     }
     var io = new IntersectionObserver(callback, option = {
         threshold: [0, 0.25, 0.5, 0.75, 1]
     });
     
     // 实例上的常用方法
     io.observe(document.getElementById('example')); // 开始观察
     io.unobserve(element); // 停止观察
     io.disconnect(); // 关闭观察器
     
     // 注意observer的参数是一个DOM节点对象，如果要观察多个节点，就要多次调用这个方法
     
     // 一般而言，callback回调函数会触发两次，一次是刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）
     
     var io = new IntersectionObserver(
       // entries是一个数组，每一个成员代表的是被观察的对象
       entries => {
         console.log(entries);
       }
     );
     
     // 应用场景：惰性加载
     // 有时，我们希望某些静态资源（比如图片），只有用户向下滚动，它们进入视口时才加载，这样可以节省带宽，提高网页性能。这就叫做"惰性加载"。
     ```

     

198. 在平时写项目时遇到了哪些错

