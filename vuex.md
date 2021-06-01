# vuex

1. vuex不建议直接通过state去修改属性值，建议通过mutation间接修改
2. state相当于vue中的data，getters相当于vue中的计算属性computed
3. mutation中的方法不能直接调用，需要通过commit间接触发，而且通常在mutation中的做的都是同步操作
4. actions中的方法不能直接调用，需要通过dispatch触发，通常在actions中做一些异步操作，在actions中触发mutation中的方法修改属性值
5. new Vue会把data中的数据代理到vm实例上，但是对$开头的属性不会进行代理
6. vue中计算属性也会被放到vm实例上，计算属性具备缓存，不支持异步
7. vuex中计算属性不能修改