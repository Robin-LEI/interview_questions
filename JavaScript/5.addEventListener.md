onclick会发生覆盖，如果给同一个dom绑定多个相同事件。

addEventListener同时绑定多个相同事件，不会发生覆盖，都会执行。



onclick只能绑定点击事件，但是addEventListener可以绑定多种类型的事件。



addEventListener可以控制事件触发的阶段，默认第三个参数为false，表示冒泡阶段触发，设置为true表示捕获阶段触发。