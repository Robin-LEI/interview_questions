# 说说你对with的认识

with的初衷是为了避免冗余对象的调用，简化多次编写同一个对象的工作，暂时改变作用域链。

with的代码块中定义的变量是一个局部变量，如果内部找不到，就会去with包裹的对象上去查找。

```js
var _hostname, _href, _search;
// 避免冗余的对象调用，简化多次编写同一个对象的工作，暂时改变作用域链
with(location) {
    // with包裹的代码块中，每个变量首先被认为是一个局部变量
    // 如果内部找不到这个变量，就会去包裹的对象本身身上去找
    _hostname = hostname;
    _href = href;
    _search = search;
}
if (true) {
    var a = 111
    }
// with会带来结果的不可预测性，改变了作用域链
// 被废弃的真正原因是强行混乱了上下文使得程序的解析和预测变得十分困难
console.log(_hostname, _href, _search, a);
```



with被废弃的真正原因是with强行混乱了上下文导致程序的解析和执行变得不可预测。