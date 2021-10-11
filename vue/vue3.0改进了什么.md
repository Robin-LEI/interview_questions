1. 数据的响应式不采用 Object.defineProperty，而是采用 Proxy
2. nextTick内部没有做兼容性的处理，采用 Promise 保证异步执行，vue2采用Promise+定时器等保证异步
3. template模板中，可以不写根标签
4. 采用 Composition API 替代了 传统的 Options API
5. vue2中一些全局api绑定在 Vue 身上的，vue3 把他们迁移到了 app（app = createApp()） 实例身上，移除了 productionTip
6. vue3中data始终是一个函数
7. vue3移除了过滤器，filter，可以使用计算属性或调用方法去实现
8. 移除了 v-on.native 事件修饰符，父组件给子组件绑定的事件，如果在子组件中的 emits 没有声明的，就默认为是原生事件，声明了，就认为是自定义事件
9. 移除了 keyCode 作为 v-on 的修饰符，因为兼容性不好