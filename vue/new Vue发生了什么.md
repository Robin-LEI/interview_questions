vue2无法劫持到不存在的属性，新增不存在的属性不会更新视图

可以通过 $set



value.\__ob__ = this;

如果value上存在 \__ob__ 说明被观测过了



1. 默认会调用 _init 方法将用户的参数挂载到 $options 选项中
2. vue会根据用户的参数进行数据的初始化，比如 props、computed、watch
3. 对数据进行递归观测，使用 Object.defineProperty 给数据属性增加 get、set 方法，劫持到用户的操作，比如用户修改了数据，在set方法中可以监测到数据，然后更新视图
4. 将数据代理到 vm 对象上，方便用户操作
5. 判断用户是否传入了 el 属性，内部会调用 $mount 方法，此方法也可以用户自己调用
6. 对模板的优先级进行处理，render > template > outerHTML
7. 将模板编译成函数，调用parserHTML 解析模板得到 ast 语法树，调用 generate 方法，根据ast语法树生成 code，使用 new Function + with 把code包装成 render 函数
8. 通过render 方法产生 虚拟dom
9. 虚拟dom + 真实data 数据得到 真实 dom