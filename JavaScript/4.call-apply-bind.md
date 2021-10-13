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

   ```js
   1. 函数调用bind函数之后，并不会立即执行
   2. 而是返回一个新的函数
   3. 应用场景：改变this指向，把返回的函数作为构造函数使用
   
   Function.prototype.bind = function(context) {
       context = context || window
       const that = this
       
       if (typeof that !== 'function') {
           throw TypeError('caller must be a function')
       }
       
       const bindArgs = [].slice.call(arguments, 1)
       
       function Fn() {
           const args = Array.prototype.slice.call(arguments)
           // 判断返回值函数是否被new
           return this instanceof Fn ? that.apply(this, bindArgs.concat(args)) : that.apply(context, bindArgs.concat(args))
       }
       
       // 维护原型链
       // 如果不维护，new bind返回的新函数实例找不到绑定函数的原型
       if (that.prototype) {
           Fn.prototype = Object.create(that.prototype)
       }
       
       return Fn
   }
   
   // 测试用例
   function fn(name) {
       console.log(this, name)
   }
   
   fn.prototype.test = function() {
       console.log(1)
   }
   
   let obj = {
       name: 'xiaoming',
       age: 10
   }
   
   let r = fn.bind(obj, 'hello')
   let o = new r()
   o.test()
   ```

   