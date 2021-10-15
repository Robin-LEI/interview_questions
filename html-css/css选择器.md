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


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div + p {
      color: red;
    }
  </style>
</head>
<body>
  <div>
    <p>111</p>
    <div>
      <p>222</p>
      <p>333</p>
    </div>
    <p>444</p> // 只有这个会变色
    <p>555</p>
  </div>
</body>
</html>
```



```html
div ~ p
控制所有在 div 之后且是一个级别的 所有的 p

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div ~ p {
      color: red;
    }
  </style>
</head>
<body>
  <div>
    <p>111</p>
    <div>
      <p>222</p>
      <p>333</p>
    </div>
    <p>444</p>
    <p>555</p>
    <div>
      <p>666</p>
    </div>
    <p>777</p>
  </div>
</body>
</html>
```



```html
[title ~= flower]
title属性中包含flower单词的元素
```



```html
[lang |= en]
lang属性值以“en”开头的元素
```

