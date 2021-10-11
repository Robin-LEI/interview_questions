vue2响应式存在的问题：

1. 新增属性、删除属性，界面不会更新
2. 直接通过下标修改数组，界面不会自动更新



vue3解决了上面问题。

Vue3的响应式原理采用了 Proxy代理和 Reflect 反射共同来完成。

ECMA正在尝试着把 Object 上面的属性和方法 移植到 Reflect 身上。

Reflect 更健壮，比 Object.defineProperty，重复定义属性时后者会报错，但是 Reflect 不会报错，兼容性更好。



```js
new Proxy(obj, {
    get(target, propName) {
        return Reflect.get(target, propName)
    },
    set(target, propName, value) {}, // 新增、修改都会走
    deleteProperty(target, propName) {
        return Reflect.deleteProperty(target, propName)
    }
})
```



Reflect.get(obj, 'a')

Reflect.set()

Reflect.deleteProperty(obj, 'a')









