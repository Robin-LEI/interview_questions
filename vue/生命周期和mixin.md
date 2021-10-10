给所有的组件，都增加一些生命周期。



vue的生命周期是怎么实现的？

vue的生命周期钩子函数的原理是，把用户传入的 options 和 Vue.mixin 中绑定的钩子函数，进行合并，在组件挂载的时候依次执行。

Vue.mixin的优先级高于用户传入的。

调用 mergeOptions 方法，判断用户传入的钩子函数在 Vue.mixin 中是否已经存在，如果存在把他们合并为一个数组，如果不存在，把它存在一个数组里面，合并完成之后，把它们绑定在 Vue的实例 $options 上。

生命周期钩子函数中的this指向 vm 实例。



其实就是一个钩子方法（回调）。

```js
Vue.mixin({ // 全局的
    beforeCreate() {
        
    }
})

new Vue({
    beforeCreate: { // 局部的
        function() {},
        function() {}
    }
})
```

 

```js

let strats = {};

let lifeCycle = [
  'beforeCreate',
  'created'
];

lifeCycle.forEach(hook => {
  strats[hook] = function(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        if (Array.isArray(parentVal)) {
          return parentVal.concat(childVal);
        } else {
          return [parentVal].concat(childVal);
        }
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }
})

// 合并对象的时候，需要确定以谁为准，一般来说是以儿子为准
function mergeOptions(parentVal, childVal) {
  const options = {};

  for (let key in parentVal) {
    mergeField(key);
  }

  for (let key in childVal) {
    if (!parentVal.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    let strat = strats[key];
    if (strat) {
      options[key] = strat(parentVal[key], childVal[key]);
    } else {
      options[key] = childVal[key] || parentVal[key];
    }
  }

  return options;
}

console.log(mergeOptions({a: 1, c: 3, beforeCreate: function() {}}, {a: 2, b: 1, beforeCreate: function() {}, created: function() {}}));

```

