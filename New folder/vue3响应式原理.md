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





==========================================================================

vue2

递归、内存消耗

数据变了，更新视图

Object.defineProperty 重新定义属性，给属性增加get、set方法

先观察数据 observer(data) 只能观测对象，如果target是数组，target.\__proto__ =  proto

【object.setprototypeOf(target, proto)】 拦截数组，对数组方法进行重写

defineReactive（target，key，target[key]），用 Object.defineProperty 重新定义属性，调用observer（value）递归观测

取值的时候，走get，设置值的时候，get会进行依赖收集，走set，更新视图，设置的时候也需要observer（newValue）



需要对数组的七个方法进行重写，因为他们7个可以改变原数组

push、pop、shift、unshift、reverse、sort、slice

先拿到数组的原型，oldArrayPrototype = Array.prototype

proto = Object.create(oldArrayPrototype ) // 继承

proto[method] = function() {

// 函数劫持，把函数进行重写，内部继续调用老的方法

// 更新视图 AOP 

updateView()

​	oldArrayPrototype[method].call(this, ...arguments) // 内部还是调老的，数据劫持，函数劫持

}



数据层级太深，性能不好，递归占内存

如果属性不存在，新增的属性不是响应式的，这是一个问题

通过数组下标修改数组项，也不是响应式的



==============================================

reactive（{name: 'zf'}），返回一个代理对象

createReactiveObject(target)

不是对象，不需要劫持

let proxy = toProxy.get(target) // 如果已经代理过了，返回结果

if () {return proxy}

if (toRaw(target)) { // 被代理后的对象

​	return target

}

let observed = new Proxy（target， {

​	// receiver：代理后的对象proxy

​	get(target，key，receiver) {

​		// proxy一般不会这么写，会和reflect结合

​		// return target[key]

​		// 收集依赖 把当前的key 和 这个 effect 对应起来

​		track（target，key）

​		return Reflect.get(target，key, receiver)

​		// 判断是否需要递归代理 是对象，需要递归

​	},

​	set(target，key，value，receiver) {

​		// 不合适，如果设置没成功 如果这个对象不可以被更改

​		//  target[key] = value	

​			// 好处是有返回值

​			let flag = Reflect.set(target, key, value, receiver)

​			return flag

​	},

​	deleteProperty(target，key) {

​		let res = Reflect.deleteProperty(target，key)

​		return res

​	}

}）

toProxy .set（target，observed）

toRaw.set（observed，target）

return observed



proxy 支持数组

reflect 好处

Object.getpropertyOf(1)

reflect.getPropertyOf(1)

reflect 后期要替代Object，替代品

好处是：不会报错，有返回值，会替代掉Object

set 方法必须要有返回值，否则会报错，用Reflect可以拿到返回值，直接解决

proxy 不是一开始就递归，是在取值的时候，看是否需要递归

如果取值是对象，递归，否则直接返回，vue2上来直接递归

即多层代理，通过 get 方法来判断



如果这个对象代理过了，就不要在代理了，如何实现？

对源对象屏蔽，对代理后的对象也需要屏蔽

内部使用 hash表  映射表

let toProxy  = new WeakMap() // 弱引用映射表，放置的是 源对象：代理过得对象

let toRaw = new WeakMap() // 被代理过的对象：源对象



proxy 缺点？

兼容性差，IE11也不兼容

弱引用防止对象不能被回收



arr.push

下标、改length

共触发两次set



依赖收集【发布订阅】



let targetsMap = new WeakMap()

function track（target，key）{ // 动态创建依赖关系

​	// 如果这个target中的key变化了，就执行数组里面的方法

​	let effect = activeEffectStacks [activeEffectStacks .length - 1] // 看有没有

​	if（effect） {

​		// 有对应关系 才创建关联

// 		{target：{key： [fn, fn] }}

​		let depsMap = targetsMap.get(target)

​		if (!depsMap) {

​			targetsMap.set(target, depsMap = new Map())

​		}

​		let deps = depsMap.get(key)

​		if (!deps) {

​			depsMap.set(key, deps = new Set())

​		}

​		if (!deps.has(effect)) {

​			deps.add(effect)

​		}

​	}

​	// 什么都不做

}



let activeEffectStacks = [] // 存储 effect {name：[effect]}

function effect（fn） {

​	// 需要把fn这个函数变成响应式的函数

​	let effect = createReactiveEffect（fn）

​	effect（）// 默认先执行

}



function createReactiveEffect（fn）{

​	let effect = function（）{ // 这个就是创建的响应式 effect

​		return run（effect， fn）// 运行 让fn 执行，把这个effect 存储到栈中

​	}

​	return effect

}



function run（effect，fn）{

​	try {

​	activeEffectStacks.push(effect)

​	fn()

​	} finally {

​	activeEffectStacks.pop（）

​	}



​	

}

effect 会执行两次，默认会先执行一次，之后依赖的数据变化了，会再次执行

effect(() => {

​	console.log(obj.name) // 会调用 get 方法

})

