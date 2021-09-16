Object.setPropertyOf(obj, proto) 设置指定对象的新的原型对象，返回这个新的对象。



```js
Object.setPropertyOf = function(obj, proto) {
    if (obj.__proto__) {
        obj.__proto__ = proto;
    } else {
        function F() {}
        F.prototype = proto
        return new F;
    }
}
```

