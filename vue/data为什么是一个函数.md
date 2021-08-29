组件中的data必须得是一个函数，如果不是函数，会报错。
这么做的目的是为了防止组件间的data数据被共用。

vue是通过一个组件创建一个构造函数，每个实例是通过new这个构造函数产生的，组件上的data属性会被绑定到构造函数的原型上的$options属性上，如果data不是一个函数，是一个普通对象，那么多个实例对象之间就可以共享一份data数据，容易出现问题，数据来源不明确。

```js
function VueComponent() {}
VueComponent.prototype.$options = {
    data: {},
    data: () => {}
}
let vc1 = new VueComponent()
let vc2 = new VueComponent()
```

