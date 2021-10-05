1. 在 new vue 进行初始化的时候，如果用户传入了 data 选项，调用 initData 方法。递归观测数据，如果数据是 对象，采用 Object.defineProperty 给data数据增加对应的get和set方法，如果数据是数组，重写数组原型的 七个方法（push、pop、unshift、shift、reverse、sort、splice），让当前value的 \__proto__ 指向一个新的实例对象，这个对象已经指向了 Array.prototype。



2. 数组不会采用 defineProperty 方法，因为很少有用户会通过 数组 索引的方式去修改数据，而且如果数据量太大，比较的耗费性能，因为要给数组索引的每一项增加 get和set方法。



3. vue3 采用了 proxy （proxy观测的是整个对象，而不是单个属性）观非数组数据，采用了 defineProperty 观测数组，为了解决 proxy 的兼容性。



