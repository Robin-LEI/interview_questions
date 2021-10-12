**vue3-ts-vite**

**vue3 特点**

1. 打包速度快

2. 打包体积减少

3. vue3兼容vue2的配置项写法，data、methods

4. 在vue2的配置中能不能读取vue3的数据和方法?? 可以拿到，反之不行



** vue/cli 创建vue3项目**

1. vue-cli版本必须在4.5.0以上

2. vue create xxx



**使用 vite 创建vue3项目**

1. 新一代前端构建工具

2. 不仅仅针对vue

3. 按需编译

4. 无需打包，冷启动速度快（之前npm run serve得先进行打包操作）

5. 热重载速度快

6. npm init vite-app project-name



**差异**

1. 入口文件引入的不在是 Vue构造函数了，而引入的是一个createApp的工厂函数，传入 App 组件 创建一个应用实例，类似之前的 vm

2. vue3组件中的模板结构可以没有根标签



**关闭语法检查**

```js
// vue.config.js

module.exports = {
 lintOnSave: false
}
```



** 常用 composition api**

1. setup

> 返回一个对象，里面的属性、方法可以直接在模板中使用、返回一个render函数（可以自定义返回的内容），return () => h('h1', '测试')

> setup前面不支持写async，因为一个函数一旦被async包裹之后，它的返回值就被Promise包裹了

> this是undefined

> 接收参数，props, context[上下文对象，最主要是 attrs, slots, emit]



2. ref

- 把普通的数据变成 响应式的

- ref(19)，返回一个对象， {value: 19, ...}，是 RefImpl 的实例对象，reference implement

- ref也可以把一个对象变成响应式，但是不推荐，建议使用 reactive

- ref 处理基本数据类型，使用的是 Object.defineProperty，处理对象，调用 reactive，使用 Proxy



3. reactive

- 定义对象类型的响应式数据

- 不能处理基本数据类型

- 借助 Proxy



**ref 和 reactive 的区别?**

- ref用来把基本数据类型（也可以把对象，但是不推荐）变成响应式
- reactive用来把对象或数组类型变成响应式
- ref通过 Object.defineProperty 的 get 和 set 方法来实现响应式
- reactive 通过Proxy来实现响应式，并通过Reflect反射来操作源对象的内部数据
- ref定义的数据，操作数据需要 .value，在模板中读取的时候不需要加 .value，因为vue已经默认帮助我们加了
- reactive定义的数据，不管读取还是操作都不需要加 .value



4. computed

```js
let fullName = computed({

 get() {},

 set() {}

})
```



5. watch

vue3中可以使用 vue2的watch

```js
// vue3 ref
watch('sum', (newValue, oldValue) => {})

// 简写 这个时候 newValue oldValue 变成了一个数组
watch(['sum', 'msg'], (newValue, oldValue) => {})

// 立即执行
watch('sum', () => {}, {
    immediate: true
})
```



watch监视 reactive 定义的数据

此处无法正确获得  oldValue

强制开启了深度监视，不用 deep: false 还可以监听

监视某一个属性：

watch(() => person.name, () => {})

监视对象中的某些属性：

```js
watch([() => person.name, () => person.age], () => {})
```



```js
person = {
    name,
    age,
    job: {
        a: {
            salary
        }
    }
}
// job 嵌套过深，需要加 deep: true
watch(() => person.job, () => {}, {deep: true})
```

watch(() => person.value, () => {})

watch(() => person, () => {}, {deep: true})



5. watchEffect

它不说它监视谁

```js
watchEffect(() => {
    // 这里面用到了哪个属性 就监视谁
})
// 默认开启了 immediate

watchEffect有点像 computed
但是computed注重的是计算出来的值，所以必须要写返回值
watcherEffect更注重的是过程，所以不用写返回值
```



5. 自定义hook

- hook本质上是一个函数，文件的命名一般是 use 开头，比如 usePoint
- 作用是把setup中的用到的 composition api 进行了封装
- 方便代码的复用
- 让setup中代码更加简洁，更容易维护





在vue2中，如果不写 props 接受传递过来的属性，则需要写 $attrs 进行接收



6. toRef

- 不能直接采用 ref ，会导致数据分家了

- toRef 创建一个ref对象，它的value值指向另外一个对象的某个属性
- 语法：`const name = toRef(person, 'name')`
- 应用场景就是 将响应式对象的某个属性单独暴露给外部使用，方便用户的操作



7. toRefs

- 批量处理

- 方便了第一层
- 语法：`toRefs(person)`



8. shallowReactive

- 只处理对象的第一层，变成响应式

- 可以做性能上的优化



9. shallowRef

- shallowRef 和 ref 如果都传入基本数据类型的时候，没有区别
- 传入对象的时候，shallowRef 不会去处理变成响应式
- 可以做性能上的优化，后续功能不会修改 obj 中的属性



10. readonly 和 shallowReadonly

- 语法：`readonly(person)`，数据不让改
- shallowReadonly，只有第一层不让改
- 二者接受的参数是 响应式的数据，也就是经过 ref 和 reactive 加工过的
- 二者处理 基本数据类型 的时候没有区别



11. toRaw

- toRaw 还原回原始数据，只能处理 reactive 加工过的响应式数据，拿到对应的普通对象，对这个普通对象的操作不会引起页面的更新



12. markRaw

- 经过 markRaw 处理的对象数据，永远不会变成响应式
- 应用场景：有些值不应该变成响应式的，比如复杂的第三方类库，如axios，当渲染具有不可变数据源的大列表时候，跳过响应式的转换可以提高性能



13. customRef



14. provide \ inject



Fragment组件

- 在vue2中组件必须有一个根标签

- 在vue3中，组件可以没有根标签，在内部会给它包裹一个 fragment 虚拟元素

- 好处是，减少标签嵌套层级，减少内存占用



Teleport组件

- 可以把我们的组件 HTML结构 移动到指定位置

- 比如我们有一个组件包含子组件、孙子组件，孙子组件有一个弹窗，这时如果想要控制它垂直居中在页面上，需要相对父级定位，因为嵌套过深，父级过多，所以样式不好控制，这个时候可以使用 teleport 组件把弹窗组件移动到 body 下面，这样写样式就很方便了。



Suspense 组件

- 配合 defineAsyncComponent 定义一个异步组件api，配合 import 动态引入

- 网速慢的时候，用户体验效果更好

- 静态引入存在一个问题，当网速慢的时候，必须要等到所有组件都加载完成，页面才会显示

```js
<Suspense>
 <template v-slot:default>
  <Child />
 </template>
 <template v-slot:fallback>
  加载中...
 </template>
</Suspense>
```