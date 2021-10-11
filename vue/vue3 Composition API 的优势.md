传统 options api的缺点是，新增或者修改一个功能，需要分别在 data、computed、methods里修改，如果文件代码量比较大，不容易找，后期代码维护比较困难。



但是 vue3 的composition api，把 data、methods、computed、生命周期钩子函数等都写在了 setup 函数内部，后期增加或修改功能只需要到 setup 中查找即可。