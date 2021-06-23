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
13. 所有模块的getters默认都会放到一个对象上，除非加入namespaced
14. 插件，如果同时存在持久化插件vue-persist和logger，那么先走持久化插件，在commit方法里面会走logger插件，插件默认会先执行一次
15. replaceState重新设置状态，替换老状态，A.replaceState(B)，用B的state更新A的state
16. devtool可以监控到同步的mutation，但是新版的也可以监控到异步的mutation



# 相关面试题

1. 什么是vuex

   > vuex负责管理项目用到的数据的，vuex提供了一个容器，里面存放的数据可以供所有的页面共享
   >
   > vuex是vue的一个状态管理插件，修改状态的唯一方法是通过mutation更改

2. vuex解决了什么问题

   > 深层次嵌套组件传值繁琐的问题
   >
   > 解决了兄弟组件的传值问题
   >
   > 多组件依赖于同一个状态

3. 什么时候用vuex

   > 项目比较大，数据比较复杂
   >
   > 项目中涉及到多个组件共享同一状态

4. 说一说vuex的几个核心属性

   > mutations
   >
   > actions
   >
   > getters
   >
   > state
   >
   > modules

5. 怎么在组件中批量使用vuex中的状态

   > 借助于mapState辅助函数，利用对象展开运算符将state混入到当前组件的computed中
   >
   > ```js
   > import {mapState} from 'vuex'
   > export default {
   >     computed: {
   >         ...mapState(['state1', 'state2'])
   >     }
   > }
   > ```
   >
   > 

6. vuex中如何从state状态派生出一些状态

   > 借助于getters，派生的状态依赖于原生的状态
   >
   > getters接受两个参数，一个是state，一个是getters用来访问其他派生状态

7. 如何在vuex中批量使用getters属性

   > 借助于mapGetters辅助函数，利用对象展开运算符将其混入到当前的computed对象中
   >
   > ```js
   > import {mapGetters} from 'vuex'
   > export default {
   >     computed: {
   >         ...mapGetters(['state1', 'state2'])
   >     }
   > }
   > ```
   >
   > 

8. 在同一个组件中多次提交mutation，如何写比较方便

   > 借助于辅助函数mapMutations
   >
   > ```js
   > import {mapMutations} from 'vuex'
   > export default {
   >     methods: {
   >         ...mapMutations({
   >             alias: 'changeName'
   >         })
   >     }
   > }
   > // 使用
   > this.alias(10) // 等价于 this.$store.commit('changeName', 10)
   > ```
   >
   > 

9. vuex中action和mutation有什么区别

   > action用来处理异步操作，mutation用来处理同步操作
   >
   > action提交的是mutation，通过mutation简介修改状态，但是mutation可以直接修改状态
   >
   > 提交的方式不一样，一个是通过dispatch、一个是通过commit
   >
   > 接受参数不一样，action第一个参数接受的是store上下文，mutation接受的是state

10. vuex中的action通常是异步的，如何知道什么时候结束呢

    > 在action中返回一个Promise
    >
    > dispatch的时候通过.then获取到结果
    >
    > ```js
    > actions:{
    >     SET_NUMBER_A({commit},data){
    >         return new Promise((resolve,reject) =>{
    >             setTimeout(() =>{
    >                 commit('SET_NUMBER',10);
    >                 resolve();
    >             },2000)
    >         })
    >     }
    > }
    > this.$store.dispatch('SET_NUMBER_A').then(() => {
    >   // ...
    > })
    > 
    > ```
    >
    > 

11. vuex中有两个action，分别是actionA、actionB，内部都是异步操作，在actionB内部需要提交actionA，然后再actionA结束之后在做其他事情

    ```js
    actions:{
        async actionA({commit}){
            //...
        },
        async actionB({dispatch}){
            await dispatch ('actionA')//等待actionA完成
            // ... 
        }
    }
    // 利用es6的async、await
    ```

    

12. 为什么模块需要使用命名空间

    > 默认情况下，模块内部的action、mutation、getters都会注册在全局上，这样存在覆盖的风险
    >
    > 所以，通常在使用的时候需要设置namespaced: true，减少了模块之间数据的耦合

13. 怎么在带有命名空间的模块内部提交全局的mutation和action

    > 借助于 {root: true}
    >
    > this.$store.dispatch('actionA', null, { root: true })
    > this.$store.commit('mutationA', null, { root: true })

14. 怎么使用mapState、mapGetters、mapMutation、mapAction函数绑定带命名空间的模块

    > 借助于 createNamespacedHelpers 创建基于命名空间模块的辅助函数

15. 如何开启vuex中的严格模式，严格模式有什么用

    > 设置strict：true
    >
    > 在严格模式下，状态的改变如果不是由mutation完成的就会报错
    >
    > 这么做的目的是为了保证所有状态的改变都可以被调式工具跟踪到

16. 在v-model上怎么用vuex中state的值

    > 需要通过computed属性来转换
    >
    > ```js
    > <input v-model="message">
    > // ...
    > computed: {
    >     message: {
    >         get () {
    >             return this.$store.state.message
    >         },
    >         set (value) {
    >             this.$store.commit('updateMessage', value)
    >         }
    >     }
    > }
    > ```
    >
    > 

17. 在vuex中插件是如何监听组件中提交mutation和action的

    > - 用Vuex.Store的实例方法`subscribe`监听组件中提交mutation
    >
    > - 用Vuex.Store的实例方法`subscribeAction`监听组件中提交action 在store/plugin.js文件中写入
    >
    >   ```js
    >   export default function createPlugin(param) {
    >       return store => {
    >           store.subscribe((mutation, state) => {
    >               console.log(mutation.type)//是那个mutation
    >               console.log(mutation.payload)
    >               console.log(state)
    >           })
    >           store.subscribeAction({
    >               before: (action, state) => {//提交action之前
    >                   console.log(`before action ${action.type}`)
    >               },
    >               after: (action, state) => {//提交action之后
    >                   console.log(`after action ${action.type}`)
    >               }
    >           })
    >       }
    >   }
    >   
    >   // 使用
    >   import createPlugin from './plugin.js'
    >   const myPlugin = createPlugin()
    >   const store = new Vuex.Store({
    >     // ...
    >     plugins: [myPlugin]
    >   })
    >   ```
    >
    >   

18. 