v-model可以看成是value+input的语法糖。

可以自定义v-model到底是什么属性、什么事件

```js
// 给组件内部绑定model属性
model: {
    prop: 'check',
    event: 'change'
}
```

原生dom标签绑定v-model之后，内部会被解析出value+input+指令，对于组件的v-model，只会被解析出value+input

