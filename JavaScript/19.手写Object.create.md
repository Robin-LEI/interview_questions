Object.create 可以创建一个实例对象，指定其原型。

接受两个参数，第一个参数是原型对象，第二个参数是指定创建出来实例的自身属性。

借助Object.create可以实现继承。

和new的区别是，new出来的实例对象默认指向其构造函数。

同时new的效率比Object.create效率高。



```js
// 内部原理是：创建一个空的构造函数，修改构造函数的原型对象使其指向新的对象，返回构造函数的实例
Object.create = function(proto, properties) {
    function F() {}
    F.prototype = proto
    let f = new F()
    Object.defineProperties(f, properties)
    return f
}
```

