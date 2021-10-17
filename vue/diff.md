第一次渲染，根据虚拟节点，生成真实节点，替换掉原来的节点。

如果是第二次，拿新的虚拟节点和老的虚拟节点进行比对。

patch(oldNode, vnode)
看oldNode上面是否存在nodeType，如果存在，说明是第一次渲染，如果不存在，说明是更新操作。

vue简化版初始化流程：
```js
let vm = new Vue({
	data() {
		return {
			name: 'hello'
		}
	}
})
let render = compileToFunction(`<div>{{name}}</div>`)
let oldVnode = render.call(vm)
let el = createElm(oldVnode)
document.body.appendChild(el)

```

diff算法用的是同层比对。
比较两个虚拟节点的差异，更新需要更新的地方。

相同节点：
标签名和key如果都一样，则是相同节点，否则是不同节点。
相同节点才复用。
如果不写key，则默认是undefined

vue2有一个性能问题---递归比对
vue3利用了标记，提高了性能，只比较改变了的节点

key不一定只能在 v-for 中加，为了防止复用，在普通节点上也可以添加

```js
// 如果新旧节点不是同一个，删除老的，使用新的替换
if (!isSameVnode) {

} else { // 相同节点，复用节点，再更新不一样的地方

}

// 文本
if (!oldVnode.tag) {

}
```

父节点都不一样，子节点不用比了，直接用新的替换掉旧的

文本需要特殊处理，文本没有标签名

是相同节点，复用节点，再更新不一样的地方，比如属性

情况1：老的有儿子，新的没有，老的直接情况

情况2：老的没有，新的有，新的循环，拿到每一个虚拟节点，变成真实节点，放到父亲下面

情况3：新的和老的都有儿子，

如果发现头和头不一样，则尾和尾比，如果还不一样，考虑使用头和尾比（比完之后需要移动指针），如果还不一样，考虑尾和头比较，采用双指针比对，指针交叉的时候，就结束了

```js
while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 递归比较子节点，同时比对这两个人的差异
        patch(oldStartVnode, newStartVnode); 
        // 指针后移
        ++oldStartIndex;
        ++newStartIndex;
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 尾节点开始比较
        --oldEndIndex;
        --newEndIndex;
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        // 老的头向后移动
        // 新的尾向前移动
    } else if (isSameVnode(oldEndVnode, newStartVnode)) { // 尾和头
        
    } else { // 之前的情况属于特殊情况 但是有非特殊的，乱序排列
        
    }
}
// 最终剩下的插入到父节点  新的多，就将其多的插入进去
if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i < newEndIndex; i++) {
        // 看一下当前尾节点的下一个元素节点是否有值，如果存在，则是插入到下一个元素的前面
        // 如果下一个是null，就是appendChild
        el.appendChild(newChildren[i]);
    }
}
// 说明老的多
if (oldStartIndex <= oldEndIndex) {
    // 把这些剩下的老的删除
    for (let i = oldStartIndex; i< oldEndIndex; i++) {
        let child = oldChildren[i];
        el.removeChild(child);
    }
}
```



