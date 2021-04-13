1. Css伪类与伪元素的区别？

   - 伪类
     - 核心就是用来选择DOM树之外的信息，不能够被普通选择器选择的文档之外的元素，用来添加一些选择器的特殊效果。
     - 比如，:hover; :active; :visited; :link; :first-child; :focus; :lang.
     - 它是基于文档之外的抽象，所以叫做伪类
   - 伪元素
     - DOM树没有定义的虚拟元素
     - 核心就是需要创建通常不存在于文档中的元素
     - 比如，::before，::after，它选择的是元素指定内容，表示选择元素内容的之前内容或之后的内容
     - 伪元素控制的内容和元素是没有差别的，但是它本身只是基于元素的抽象，并不存在于文档中，所以称为伪元素。
   - 伪类与伪元素之间的差别
     - 表示方法
       + CSS2中伪类与伪元素都是以单冒号表示
       + CSS2.1后规定伪类用单冒号表示，伪元素用双冒号表示
     - 定义不同
       - 伪类即假的类，可以添加类来达到效果
       - 伪元素即假元素，需要通过添加元素才能达到效果
   - 总结
     - 伪类和伪元素都是用来表示文档树以外的”元素”
     - 伪类和伪元素分别用单冒号和双冒号来表示
     - 伪类和伪元素的区别，关键点在于如果没有伪元素（或伪类），是否需要添加元素才能达到效果，如果是则是伪元素，反之则是伪类。 

2. flex: 1; 的完整写法是什么？分别是什么意思？

   - flex: 1; 可以实现不同内容的div平分空间

   - flex属性是 <mark>flex-grow</mark>、<mark>flex-shrink</mark>、<mark>flex-basis</mark>的简写，默认值为<b>0</b>、<b>1</b>、<b>auto</b>

     - flex-grow，定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
     - flex-shrink，定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
     - flex-basis，给上面两个属性分配多余的空间之前，计算项目是否有多余空间，默认值为auto，即项目本身的大小

   - flex: 1完整写法是

     ```css
     flex-grow: 1;
     flex-shrink: 1;
     flex-basis: 0%;
     ```

   - flex的其它赋值情况

     ```css
     <!-- flex: none;等价于 -->
     flex-grow: 0;
     flex-shrink: 0;
     flex-basis: auto;
     
     <!-- flex: auto;等价于 -->
     flex-grow: 1;
     flex-shrink: 1;
     flex-basis: auto;
     ```

   - flex取单个非负数字的时候，这个值表示flex-basis的值，其它两个值为1

   - flex取两个非负数字的时候，分别为flex-grow和flex-shrink的值，flex-basis的值为0%

3. link和@import的区别

   - link

     - 在head头部引入，这种引入方式具有良好的可维护性，所有的css代码只存在于css文件，css文件在第一次加载时引入，以后切换页面时只需加载html文件即可。

   - @import

     ```css
     <style>
     	@import url(style.css);
     </style>
     或者
     @import url(style.css);
     .class {}
     ```

   - 区别

     - link是XHTML标签，除了加载css外，还可以定义RSS等其它事务；@import属于css范畴，只能加载css
     - link引用css时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。所以会出现一开始没有css样式，闪烁一下出现样式后的页面（在网速慢的情况下）。
     - link是XHTML标签，没有兼容性问题；@import是css2.1提出的，低版本浏览器不支持。
     - link支持使用JavaScript控制DOM去改变样式；而@import不支持。

4. 屏幕之间有个元素A，元素A中有文字A，随着屏幕宽度的增加，始终需要满足如下条件

   ```html
   <!-- 
       A元素垂直居中于屏幕中央
       A元素距离屏幕左右边距各10px
       A元素里面的文字A的font-size:20px；水平垂直居中
       A元素的高度始终是A元素宽度的50%；(如果搞不定可以实现为A元素的高度固定为200px)
       请用html及css实现
   -->
   <!-- 方法1 -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>居中</title>
   
     <style>
       html,
       body {
         padding: 0;
         margin: 0;
         height: 100%;
       }
   
       body {
         display: flex;
         align-items: center;
       }
   
       .A {
         flex: 1;
         margin: 0 10px;
         /* 当padding-top值为%的时候，定义基于父元素宽度的百分比内边距，但是在不同版本的浏览器中可能
         会存在兼容性
          */
         padding-top: 50%;
         position: relative;
         background: #999;
       }
   
       .A::after {
         content: 'A';
         display: block;
         font-size: 20px;
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
       }
     </style>
   </head>
   
   <body>
     <div class="A"></div>
   </body>
   
   </html>
   
   <!-- 方法2 -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>居中</title>
   </head>
   
   <body>
     <style>
       * {
         padding: 0;
         margin: 0;
       }
   
       .A {
         margin: 0 10px;
         text-align: center;
         font-size: 20px;
         position: absolute;
         top: 50%;
         transform: translateY(-50%);
         width: calc(100vw - 20px);
         height: calc(50vw - 10px);
         line-height: calc(50vw - 10px);
         background-color: aquamarine;
       }
     </style>
     <div class="A">
       A
     </div>
   </body>
   
   </html>
   ```

   

5. Css实现一个半圆

   ```html
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Document</title>
     <style>
       .box {
         width: 200px;
         height: 100px;
         background-color: pink;
       }
       .box2 {
         width: 100px;
         height: 200px;
         background-color: beige;
       }
       /* border-radius 顺序：左上、右上、右下、左下 */
       /* 上半圆 */
       .semi-circle1 {
         border-radius: 100px 100px 0 0;
       }
   
       /* 下半圆 */
       .semi-circle2 {
         border-radius: 0 0 100px 100px;
       }
       
   
       /* 左半圆 */
       .semi-circle3 {
         border-radius: 100px 0 0 100px;
       }
       
   
       /* 右半圆 */
       .semi-circle4 {
         border-radius: 0 100px 100px 0;
       }
       
     </style>
   </head>
   
   <body>
     <div class="box semi-circle1"></div>
     <div class="box semi-circle2"></div>
     <div class="box2 semi-circle3"></div>
     <div class="box2 semi-circle4"></div>
   </body>
   
   </html>
   ```

   

6. 