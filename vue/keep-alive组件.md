keep-alive组件针对的是组件缓存。

如果需要在组件切换的时候，保存组件的状态，防止多次重新渲染，就可以使用keep-alive组件包裹。

keep-alive组件有两个特殊的生命周期钩子函数，activated【渲染的时候执行】、deactivated【切换的时候执行】。