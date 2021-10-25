GPU 加速（硬件加速）

GPU 图形处理单元，显卡的核心部件

GPU的处理复杂运算的能力比CPU强，因为CPU包含了 Control 控制器，ALU算术逻辑单元，Cache内部缓存，DRAM内存

，GPU芯片比较纯净，ALU占比比CPU高得多。



GPU具有多个处理器核，在一个时刻可以并行处理多个数据，真正意义上实现了高并行。

GPU加速其实原理就是利用了GPU的高并行计算能力，比如在前端中利用GPU来处理复合图层（像素密集型）进行"加速"。



为什么要开启？

为了提升用户体验



浏览器在处理下面的css的时候，会使用GPU加速

\1. transform

\2. opacity

\3. filter

\4. will-change

GPU硬件加速是需要新建图层的，把该元素移动到新建图层是个耗时操作，界面可能会闪动一下，

所以最好提前做。will-change就是提前告诉浏览器在一开始就把元素放到新的图层，方便后面使用

GPU渲染的时候，不需要做图层的新建。

will-change: transform;

或者

transform: transform3d(0,0,0)



GPU加速可以减轻CPU压力，使得渲染流畅，但是也会增加内存的占用，对于transform、opacity、filter默认会开启，

其余情况，建议只在有必要的情况下使用。



https://juejin.cn/post/7001634685927292936



https://juejin.cn/post/6965810210283716644

