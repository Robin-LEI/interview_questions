插件机制基于 tapable 来实现的。

 

webpack插件机制分为：

```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable');
```



创建：webpack在内部对象创建各种钩子，比如SyncHook、SyncLoopHook等

注册：插件将自己的方法注册到对应的钩子上

调用：调用call，触发钩子