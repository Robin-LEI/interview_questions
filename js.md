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

10. 


