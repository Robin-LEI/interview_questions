原理就是 递归查找原型链 判断 实例.\__proto__ 是否等于 构造函数.prototype

```js
function myInstanceof(left, right) {
    let leftProto = left.__proto__;
    let rightCtor = right.prototype;
    while(true) {
        if (leftProto == null) {
            return false;
        }
        if (leftProto === rightCtor) {
            return true;
        }
        leftProto = leftProto.__proto__;
    }
}
```

