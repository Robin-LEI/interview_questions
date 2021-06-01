# Vue Router

1. Vue-router history 模式部署的时候要注意什么?server 端用 nginx 和 node 时候分别怎么处理?

   > hash的特点：丑、兼容性好，使用`window.location.hash`修改hash值，使用`window.addEventListener('hashchange')`监视hash值的变化，目前对于高版本的浏览器也支持使用popstate监视hash值的变化
   >
   > history的特点：好看、兼容性差，使用`window.history.pushState({},null, path)`修改history的路由值，使用`window.addEventListener('popstate')`监视history模式的路由值的变化

   > 采用hash部署，不需要后端配合，因为如果你刷新访问`http:localhost:8080/page`，这个时候浏览器会默认把url修改为`http://localhost:8080/page/#/`进行访问
   >
   > 采用history模式部署，需要后端的配合，因为刷新页面会发送http请求，就会找不到页面路径，返回404，通常在开发模式下，webpack使用history-fallback-api在内部帮助我们处理了

   > nginx配置如下
   >
   > ```nginx
   > location / {
   >     try_files $uri $uri/ /index.html
   > }
   > # 找指定路径下的文件，如果不存在转发给index.html
   > ```

   > node配置如下
   >
   > 借助与 `connect-history-api-fallback`这个中间件
   >
   > 首先需要执行 `npm i connect-history-api-fallback --save-dev` 去安装
   >
   > 然后再app.js中使用
   >
   > ```js
   > const history = require('connect-history-api-fallback')
   > const connect = require('connet') // 中间件
   > const app = connect().use(history()).listen(3000)
   > 
   > // 或者借助与express
   > const express = require('express')
   > const app = express()
   > app.use(history())
   > ```
   >
   > 

2. 介绍下 vue-router 中的导航钩子函数

   > vue-router中导航钩子函数的核心思想就是把所有的钩子存入到一个数组中，然后依次执行
   >
   > 目前常用的全局钩子有beforeEach、afterEach
   >
   > 组件级的钩子有beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave，直接在组件内部定义的

   > beforeEach在执行transitionTo跳转之前执行，有三个参数，to，from，next
   >
   > to：表示要进入的路由对象
   >
   > from：表示要离开的路由对象
   >
   > next：是一个必须要执行的函数，不传入参数，调用下一个钩子，传入false停止调用，传入一个path，导航到对应的path页面

3. 能说下 vue-router 中常用的 hash 和 history 路由模式实现原理吗？

   > hash的实现原理
   >
   > 早期的前端路由就是通过`location.hash`来实现的。
   >
   > url#后面的字符串就是hash值，当刷新页面的时候，hash值是不会发送给服务端的。hash值的改变，只会在浏览器的历史记录中增加一个访问记录，所以我们可以通过浏览器的前进后退控制hash的切换。
   >
   > 可以通过a标签的href属性或者使用js修改hash值的改变。
   >
   > 可以通过hashchange事件监听hash值的变化，跳转到对应的页面（渲染）。

   > history的实现原理
   >
   > HTML5提供了history api来控制url的变化。
   >
   > 其中最主要的api有连个 `pushState`和`replaceState`
   >
   > 这两个api都可以实现在url变化的时候不刷新页面，pushState是在浏览器的访问记录中增加一条记录，replaceState替换当前的访问记录。
   >
   > 使用popstate事件来监视url的变化。
   >
   > 但是需要注意的是，pushState和replaceState不会触发popstate，我们需要手动触发进行页面跳转。但是前进后退会触发popstate

4. 说一下vue-router的原理是什么?

   > vue-router是基于vue的。
   >
   > 路由的核心原理：就是根据路径 返回对应的组件，也就是重新渲染页面而不会发生页面的刷新
   >
   > VueRouter是一个类，new VueRouter产生一个router的实例，并且把这个实例挂载到根实例Vue上进行路由的初始化。
   >
   > 根据传入的参数mode不同，可以分为两种模式的路由，一种是hash模式，一种是history模式。
   >
   > 在Vue项目中使用VueRouter的时候，首先调用vue-router的install方法
   >
   > 在install方法中做三件事， <mark>第一件事</mark>将当前根实例提供的router属性共享给所有的子组件，采用`Vue.mixin`混入生命周期`beforeCreate`的方式
   >
   > ```js
   > // 如何将当前根实例提供的router属性共享给所有的子组件
   > 使用Vue.mixin注入beforeCreate生命周期钩子函数，这样能保证vue中每个组件都会混入执行beforeCreate
   > 在beforeCreate中进行判断，如果this.$options.router存在，说明当前组件是根实例
   > 把根实例（也就是this）赋值给this._routerRoot
   > 同时把router实例赋值给this._router
   > 如果当前是根实例，还需要调用VueRouter的init方法进行初始化
   > 如果是普通组件（实例），执行 this._routerRoot = this.$parent && this.$parent._routerRoot
   > 这样能保证每个组件都可以获取router的属性和方法
   > Vue.mixin({
   >     beforeCreate() {
   >         if (this.$options.router) {
   >             this._routerRoot = this;
   >             this._router = this.$options.router;
   >             this._router.init(this)
   >         } else {
   >             this._routerRoot = this.$parent && this.$parent._routerRoot
   >         }
   >     }
   > })
   > ```
   >
   > 
   >
   > <mark>第二件事</mark>使用`Object.defineProperty`给`Vue.prototype`上定义两个属性，分别是$route和$router，当用户调用this.$route的时候，返回this.\_routerRoot._route
   >
   > 当用户调用$router的时候，返回this.\_routerRoot._router
   >
   > ```js
   > Object.defineProperty(Vue.prototype,'$route',{
   >     get(){
   >         return this._routerRoot._route
   >     }
   > });
   > Object.defineProperty(Vue.prototype,'$router',{
   >     get(){
   >         return this._routerRoot._router;
   >     }
   > });
   > ```
   >
   > <mark>第三件事</mark>使用Vue.component注册全局组件router-link和router-view

   > VueRouter的init方法初始化的具体细节
   >
   > 在init方法里，根据用户传入的mode值获取不同的history实例，调用transitionTo默认做一次跳转，也就是根据当前路由跳转到指定页面，并且调用`setupListener`开启路由监听

   > new VueRouter发生了什么
   >
   > 根据用户传入的routes调用`createMatcher(options.routes || [])`创建匹配器，这个方法返回的是一个对象，包含了match和addRoutes方法
   >
   > 根据当前的mode创建不同的history管理实例
   >
   > 在`createMatcher`内部调用`createRouteMap`传入routes，根据用户的配置创建一个映射表，即一个path对应一个record
   >
   > addRoutes方法用户动态添加路由，内部调用createRouteMap传入两个参数routes、oldPathMap，修改映射表
   >
   > match方法，根据一个path，可以匹配路由，返回一个对象，一个path可能匹配到多个matched，如果这个path存在parent，会把parent对象追加到matched数组前面，渲染的时候从父到子渲染
   >
   > 

5. 如何配置动态路由，以及如何获取传递过来的动态参数？

   > 用户调用router实例的addRoutes方法，传入符合规则的routes，更新映射表
   >
   > ```js
   > 在一个路径后面设置冒号作为参数标记，当匹配到一个路由时，参数值会被设置到this.$route.params上，可以在每个组件内使用。
   > ```
   >
   > 

6. active-class是哪个组件的属性？active-class的使用方法？

   ```js
   // 是router-link组件的属性，当标签被点击时会应用这个class修改样式
   // 全局设置active-calss
   new VueRouter({
       linkActiveClass: 'active', // 链接被非精确匹配时候使使用的
       linkExactActiveClass: 'active' // 链接被精确匹配的时候使用的
   })
   // linkActiveClass使用的时候会不精确，当从一个被点击的router-link切换到另外一个router-link点击的时候，上一个router-link的active-calss仍然存在，而且还存在一个问题，点击子组件的router-link父级的router-link也会添加active-class
   
   // linkExactActiveClass，精确匹配，只有当当前点击到这个router-link的时候，这个router-link才会被赋予active-calss，其它的兄弟组件或者父级组件的router-link的active-calss全部消失
   ```

   

7. $route和$router的区别

   ```js
   $route 返回的是 this._routerRoot._route ，内部存放的是current对象，保存的都是属性，比如path、matched
   
   $router 返回的是 this._routerRoot._router，上面挂载的是方法，比如addRoutes、match
   ```

8. vue-router实现路由懒加载

   > 当打包构建应用的时候，js包会变得非常大，影响页面加载，如果可以把不同的路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应的组件，这样就更加高效了。
   >
   > 首先，将异步组件定义为返回一个promise的工厂函数
   >
   > ```js
   > const Foo = () => {
   >     Promise.resolve('组件本身')
   > }
   > ```
   >
   > 然后在webpack2中，可以使用动态import语法定义代码分快点
   >
   > ```js
   > import('Foo.vue')
   > ```
   >
   > 结合这两者，这就是如何定义一个能够被webpack自动代码分割的异步组件
   >
   > ```js
   > const Foo = () => import('./Foo.vue')
   > const router = new VueRouter({
   >     routes: [
   >         {
   >             path: '/foo',
   >             component: Foo
   >         }
   >     ]
   > })
   > ```
   >
   > 

9. $node和_node的区别

   - $node表示的是组件本身
   - \_node表示组件里面的内容

10. Vue.use

    ```js
    Vue.use = function(plugin, options) {
        plugin.install(options)
    }
    // Vue.use是一个方法，接受两个参数，一个参数是plugin插件，另外一个插件是options可选配置项，在执行Vue.use的时候，默认会调用插件内部的install方法，同时传入options配置项，这样做的好处是，我们开发的插件内部不用在依赖Vue，而是依赖于项目本身的Vue，这样就能保证插件内部使用的Vue版本和项目使用的Vue版本一致。
    ```

    