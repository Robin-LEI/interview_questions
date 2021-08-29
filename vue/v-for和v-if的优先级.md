在使用`vue-template-compiler`这个包将模板编译为render函数之后，发现v-for比v-if具有更高的优先级，这也就意味着，在v-for执行遍历的时候，每一次都需要在内部判断是否满足条件，影响性能。

可以使用computed计算属性，替代处理。

```js
const VueTemplateCompiler = require('vue-template-compiler');
let r1 = VueTemplateCompiler.compile(`<div v-if="false" v-for="i in
3">hello</div>`);
/**
with(this) {
    return _l((3), function (i) {
    	return (false) ? _c('div', [_v("hello")]) : _e()
    })
}
*/
console.log(r1.render);
```

