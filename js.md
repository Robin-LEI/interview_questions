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

       

     

     

     

     

     

