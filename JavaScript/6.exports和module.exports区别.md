# module.exports和exports区别

1. exports是module.exports的引用，指向module.exports
2. module.exports是一个对象，commonjs规范规定，每个模块内部都有一个module变量，这个变量是一个对象，它的exports是对外的接口，加载某个模块，其实是加载这个模块的module.exports属性
3. require引入模块的时候，只能是module.exports上的属性和方法，不会是exports的
4. module.exports可以导出一个匿名函数，但是exports不可以，因为这会切断exports和module.exports的联系
5. **这是commonjs规范**



# export和export default区别

1. export和export default都可以导出文件、函数、变量、常量
2. 在一个文件中，export和import可以有多个，但是export default只能有一个
3. 通过export导出，导入时候需要加 {} ，export default 不需要
4. export可以直接导出变量表达式，但是export default不可以
5. **这是es6规范**

