# vuex

1. vuex不建议直接通过state去修改属性值，建议通过mutation间接修改
2. state相当于vue中的data，getters相当于vue中的计算属性computed
3. mutation中的方法不能直接调用，需要通过commit间接触发，而且通常在mutation中的做的都是同步操作
4. actions中的方法不能直接调用，需要通过dispatch触发，通常在actions中做一些异步操作，在actions中触发mutation中的方法修改属性值
5. new Vue会把data中的数据代理到vm实例上，但是对$开头的属性不会进行代理
6. vue中计算属性也会被放到vm实例上，计算属性具备缓存，不支持异步
7. vuex中计算属性不能修改
8. Vue.set可以动态设置不存在的属性为响应式
9. 所有模块的getters默认都会合并到一个对象上，除非你设置namespaced
10. commit时，传入的payload参数只能是一个基本值或者对象，也就是说只能传递一个
11. 既然有localstorage，为什么还需要`vuex-persist`数据持久化插件？答：localstorage存储的数据变了会改变视图吗？肯定不会
12. watch(oldValue, newValue)，在什么情况下，oldValue和newValue是一样的？答：当二者都是对象的时候