# vue2生命周期

beforeCreate

created

beforeMount

mounted

beforeUpdate

updated

beforeDestroy

destroyed



# vue3生命周期



vue2不写el，会走 beforeCreate、created，vue3如果不传el挂载对象，不会走钩子函数。

vue3中beforeDestroy、destroyed不生效，因为已经改名为 beforeUnmount、unmounted了



八个生命周期钩子可以像vue2中一样写，但是如果在vue3中想要写入 setup中，需要改名字。



vue3提供了composition api形式的钩子，与vue2中钩子对应的关系如下：

beforeCreate===setup

created===setup

beforeMount===onBeforeMount

mounted===onMounted

beforeUpdate===onBeforeUpdate

updated===onUpdated

beforeUnmount===onBeforeUnmount

unmounted===onUnmounted



通过配置项的形式写的时候，setup优先beforeCreate执行。