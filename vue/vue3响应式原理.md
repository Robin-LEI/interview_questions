vue2响应式存在的问题：

1. 新增属性、删除属性，界面不会更新
2. 直接通过下标修改数组，界面不会自动更新



vue3解决了上面问题。



```js
new Proxy(obj, {
    get(target, propName) {},
    set(target, propName, value) {}, // 新增、修改都会走
    deleteProperty(target, propName) {}
})
```

