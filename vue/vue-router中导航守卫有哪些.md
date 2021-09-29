**vue router 全局有三个导航守卫**

1. router.beforeEach，进入路由之前

2. router.beforeResolve，在beforeRouteEnter调用之后调用

3. router.afterEach，进入路由之后

   

**导航分别有三个参数**

to，from，next

to表示将要进入的路由对象

from表示将要离开的路由对象

next必须要调用，否则不会进入路由页面



**路由独享守卫：**

如果不想配置全局路由守卫，也可以为每一个路由单独配置守卫



**路由组件守卫：**

1. beforeRouteEnter  进入路由前
2. beforeRouteUpdate 路由复用同一个组件时
3. beforeRouteLeave 离开当前路由时



**路由钩子函数的错误捕获：**

router.onError

