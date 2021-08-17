1. call

   ```js
   1. 改变函数内部this指向
   2. 绑定call会让函数立即执行
   3. 自定义一个call函数，接收一个context上下文参数，给参数绑定一个fn属性用来保存自定义call函数的this，拿到参数，借助eval执行调用context.fn，拿到执行结果，返回
   
   Function.prototype.call = function(context) {
       context = context ? context : window
       context.fn = this
       const args = []
       for (let i = 1; i < arguments.length; i++) {
           args.push(`arguments[${i}]`)
       }
       const r = eval(`context.fn(${args})`)
       delete context.fn
       return r
   }
   ```

   

2. apply

   ```js
   1. 改变函数内部的this指向
   2. apply函数接收数组作为参数
   3. 调用apply的函数会立即执行
   
   Function.prototype.apply = function(context, arr) {
       context = context ? context : window
       context.fn = this
       if (!arr) {
           return eval(`context.fn()`)
       }
       if (!Array.isArray(arr)) {
           throw TypeError('arr must be a array')
       }
       const args = []
       for (let i = 1; i < arguments.length; i++) {
           args.push(`arguments([${i}])`)
       }
       const r = eval(`context.fn(${args})`)
       delete context.fn
       return r
   }
   ```

   

3. bind