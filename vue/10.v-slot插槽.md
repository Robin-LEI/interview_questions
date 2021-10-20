**vue中的插槽分为具名插槽和作用域插槽。**

其中具名插槽，如果不写name，默认是default。

具名插槽的使用场景：对应一个layout组件，常常有多个部分组成，比如header、主体、footer。

v-slot只能加在template标签上

v-slot可以简写成 #

插槽的场景：封装组件的时候，不想让组件内部的结构写死，可以使用插槽实现。

```js
// 具名插槽
// 应用场景：有时候我们需要有多个插槽，例如对于一个layout组件，需要包含头部、主体、底部
<div class="container">
  <header>
    <!-- 我们希望把页头放这里 -->
  </header>
  <main>
    <!-- 我们希望把主要内容放这里 -->
  </main>
  <footer>
    <!-- 我们希望把页脚放这里 -->
  </footer>
</div>

// 利用slot元素有一个name属性解决
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
// 即使不写name，默认也是存在的，即是default

// 在向具名插槽提供内容的时候，我们可以在一个template元素上使用v-slot指令传递slot的name
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
// 注意，任何没有被包裹在带有v-slot的template中的内容都会被视为默认插槽的内容
// 当然也可以这么写
<template v-slot:default>
    <p>A paragraph for the main content.</p>
    <p>And another one.</p>
</template>
// 注意，v-slot只能加在template上

// 具名插槽可以缩写，把v-slot缩写为#
<template #footer>
    <p>Here's some contact info</p>
</template>
```



作用域插槽：

应用场景：让父级插槽可以拿到子组件的数据，做业务逻辑处理。

把子组件的数据作为v-slot的属性绑定上去

```js
// 作用域插槽
// 应用场景：有时候需要让父级插槽内容能够访问子组件的数据
// 这个时候可以把子组件的数据作为slot的属性绑定上去，绑定在slot元素上的属性被称为插槽的prop

// 子组件
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
// 父组件
<current-user>
  <template v-slot:default="slotProps"> // slotProps 插槽prop的名字，可以随意起
    {{ slotProps.user.firstName }}
  </template>
</current-user>
// 父组件还可以这么写
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
// 父组件也可以这么写
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>

// 注意：如果出现多个插槽，只能这么写
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>

  <template v-slot:other="otherSlotProps">
    ...
  </template>
</current-user>


// 解构插槽prop
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
// 解构重命名
<current-user v-slot="{ user: person }">
  {{ person.firstName }}
</current-user>
// 定义后背内容prop
<current-user v-slot="{ user = { firstName: 'Guest' } }">
  {{ user.firstName }}
</current-user>
```



插槽的名称支持动态插槽名

```js
<base-layout>
  <template v-slot:[dynamicSlotName]>
...
  </template>
</base-layout>
```

