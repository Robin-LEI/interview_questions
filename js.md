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

     

