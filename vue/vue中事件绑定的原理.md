vue中事件绑定分为两种，一种是原生dom的绑定，一种是组件的事件绑定。

原生dom就是给dom本身通过addEventListener注册一个事件。

组件的事件绑定借助于发布订阅模式，把事件绑定到内部target的$on属性上，监听组件内部通过$emit派发的事件。

组件的事件绑定时如果和.native属性配合使用，会把事件绑定到nativeOn属性上，就相当于原生绑定。

```js
<test @click.native="() => {}" @click="() => {}"></test>
<div @click="() => {}"></div>
```

