1. 介绍防抖节流原理、区别以及应用，并用JavaScript进行实现

   1. 防抖

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

   - 类数组是一个拥有length属性，并且它的属性为非负整数的普通对象，类数组不能直接调用数组的方法

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

11. 原生实现ES5的Object.create() 方法

    ```js
    // Object.create(proto[, propertiesObject])
    // 此方法使用指定的原型对象和其属性创建了一个新的对象
    // 第二个参数表示属性描述符，如果是null或非原始包装对象，则抛出一个TypeError异常
    // 如果不指定对应的属性描述符，默认都是false
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
    // 判断一个值不是对象或者非原始包装对象：value === Object(value) 则是对象，反之不是
    // 模拟实现
    Object.create = function(prototype, properties) {
        if (typeof prototype !== 'object') {
            throw TypeError();
        }
        function Ctor() {}
        Ctor.prototype = prototype;
        let o = new Ctor();
        if (prototype) {
            o.constructor = Ctor;
        }
        if (properties != undefined) {
            if (properties !== Object(properties)) {
                throw TypeError();
            }
            Object.defineProperties(o, properties);
        }
        return o;
    }
    ```

    

12. 请列出至少5个JavaScript常用的内置对象，说明其用途

    - 常用的五种内置对象
      - encodeURI() 对统一资源标识符（URI）进行编码
      - eval() 函数将传入的字符串当做JavaScript代码进行执行
      - isFinite() 判断传入的参数是否为一个有限的数值
      - isNaN() 判断一个值是否为NaN
      - parseInt(string, radix) 将一个字符串string转换为radix进制的整数，radix为介于2-36之间的数
    - 这里的术语“全局对象”（或标准内置对象）不应该与global对象混淆，这里的“全局对象”指的是处在全局作用域里面的多个对象。
    - global对象在全局作用域下可以通过this访问到（非严格模式下，严格模式下得到undefined）
    - 基本对象（包括一般对象、函数对象、错误对象）
      - Object、Function、Boolean、Symbol（一般对象）
      - Error、TypeError、SyntaxError、ReferenceError、RangeError（错误对象）

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
      return num.toLocaleString('en-US'); // 返回这个数字在特定语言环境下的表示字符串
    }
    
    // 实现3
    function formatNumber(num) {
        // Intl对象是ECMAScript国际化API的一个命名空间，它提供了精确的字符串对比，数字格式化，日期和时间格式化
        return new Intl.NumberFormat().format(num);
    }
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

    - 伪代码模拟实现(以setTimeout模拟请求、clearTimeout取消请求)

      ```js
      
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
      > <!-- 注意：一下情况不属于尾调用 -->
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
        function Fibonacci(n, prev = 1, current = 1) {
            if (n <= 1) {
                return current;
            }
            return Fibonacci(n - 1, prev, prev + current);
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
