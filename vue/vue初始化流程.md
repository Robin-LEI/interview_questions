双向绑定：

页面修改，数据也修改。

数据修改，页面也修改。



单向数据流指的是 数据变了，视图改变。



vue默认只是做视图的，并不是 mvvm。

所谓的mvvm指的是 只能试图更改数据，只能通过数据修改视图。

但是vue中可以通过 ref 操作数据、视图。



响应式数据原理

通过 Object.defineProperty 将对象中的原有属性，增加对应的get和set

的属性，这样当修改数据的时候，会触发 set 方法，更新视图。



new Vue发生了啥？

1. 调用 _init 方法，实现vue的初始化功能
   - initState 初始化状态，data初始化、computed、watch、methods等
2. 把用户的选项放到 vm 上，这样在其他方法中就可以获取到 options 了
3. 判断当前vm上是否存在el，就说明要将数据挂载到 页面上。



用类对数据进行观测，观测的时候需要判断，如果已经被观测了，就不要

观测了，观测过就增加一个标识。

递归观测，vue2应用了defineProperty需要一加载的时候，就进行递归

操作，所以耗性能，如果层次过深也会浪费性能。

优化原则：

1. 不要把所有的数据都放在data中，因为所有的数据都会增加get和set方法
2. 不要写数据的时候，层次过深
3. 不要频繁获取数据，因为会走get方法
4. 如果数据不需要响应式，可以使用 Object.freeze 冻结属性



数组不采用 Object.defineProperty，但是它是支持数组的，

但是会给数组的每一项都增加get、set方法，很耗费性能。

因为我们很少使用 arr[999] = 100; 修改数组的一项值。

对于 数组 修改索引或者修改 length，均不会触发视图更新。

vue3为了兼容proxy，内部对数组用的就是 Object.defineProperty。



可以改变原数组：

push、pop、splice、shift、unshift、reverse、sort。

在观测数据的时候，进行判断，针对数组特殊处理。





