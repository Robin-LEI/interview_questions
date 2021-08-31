CSS选择器优先级

加上! important > 行内style > id > class > 标签选择器 > 通配符选择器 * > 浏览器继承



CSS有哪些选择符？

id、class、通配符、属性选择器



```html
div > p

控制div下面所有的p
```



```html
div + p
控制第一个和div处在同一个级别的p
```



```html
p ~ ul
控制所有位于p之后ul元素，可以跨级
```



```html
[title ~= flower]
title属性中包含flower单词的元素
```



```html
[lang |= en]
lang属性值以“en”开头的元素
```

