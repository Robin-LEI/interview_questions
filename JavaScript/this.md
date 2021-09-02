解析器（浏览器）每次在调用一个函数的时候，都会向这个函数传递一个隐藏的参数，

这个隐藏的参数就是this，this指向的是一个对象，

这个对象称为函数执行的上下文对象。

根据函数的调用方式不同，this指向不同的对象。

1. 以函数的形式调用的时候，this永远都是window
2. 以方法的形式调用的时候，this就是调用方法的那个对象



箭头函数不能new，不能当做构造函数使用，没有constructor属性，没有arguments

箭头函数的this在书写时已经被定义好了，指向箭头函数外部的this。



箭头函数的this指向window（这是错误的说法）。

箭头函数中的this指向调用这个函数对象的外层对象。

```js
function person(name) {
    let obj = {}
    obj.name = name
    obj.getName = () => {
        console.log(this) // 这里箭头函数的this并不指向window
    }
    return obj
}
let p = new person('lisi')
p.getName() // person {}
```



**箭头函数缺点：**

1. 没有arguments对象

2. 在原型链上不能使用箭头函数

   ```js
   function Person(name) {
       this.name = name
   }
   
   Person.prototype.say = function() {
       console.log(this.name, this); // 张三 Person {name: '张三'}
   }
   
   Person.prototype.say = () => {
       console.log(this.name, this); // '' window
   }
   
   let p = new Person('张三')
   p.say()
   ```

   

3. 在构造函数中不能使用箭头函数

   ```js
   let Person = (name, age) => {
       this.name = name
       this.age = age
   }
   let p = new Person('李四', 19) // 报错
   ```

4. 箭头函数 call apply bind 不能改变this指向

   ```js
   let obj = {
       name: '李四',
       say: () => {
           console.log(this)
       }
   }
   
   let obj2 = {
       name: '张三'
   }
   
   obj.say.call(obj2) // window
   ```

   