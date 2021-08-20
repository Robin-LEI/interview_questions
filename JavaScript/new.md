new 干了几件事

1. 创建一个空对象
2. 修改空对象的原型链，使得它的 \__proto__指向构造函数的prototype
3. 调用apply，获取返回结果，判断如果是对象则返回，否则返回内部创建的空对象

```js
function MyNew() {
      const obj = {}
      const Constructor = [].shift.call(arguments)
      obj.__proto__ = Constructor.prototype
      const r = Constructor.apply(obj, arguments);
      return r instanceof Object ? r : obj;
}
```



字面量创建对象、new出来的对象和Object.create(null)有什么区别

前面两个创建之后有原型链，Object.create(null)创建出来的对象没有原型链