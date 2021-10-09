1. 数据的响应式不采用 Object.defineProperty，而是采用 Proxy
2. nextTick内部没有做兼容性的处理，采用 Promise 保证异步执行，vue2采用Promise+定时器等保证异步
3. template模板中，可以不写根标签