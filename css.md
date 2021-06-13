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

   

6. 上下固定，中间滚动布局如何实现

   ```html
   <!-- flex布局 -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>flex</title>
     <style>
       html,
       body {
         padding: 0;
         margin: 0;
         height: 100%;
       }
   
       .wrap {
         display: flex;
         height: 100%;
         flex-direction: column;
       }
   
       .header,
       .footer {
         height: 40px;
         line-height: 40px;
         text-align: center;
         background-color: cadetblue;
       }
   
       .main {
         flex: 1;
         background-color: chocolate;
         /* 内容过多，自动出现滚动条 */
         overflow: auto;
         text-align: center;
       }
     </style>
   </head>
   
   <body>
     <div class="wrap">
       <div class="header">header</div>
       <div class="main">main</div>
       <div class="footer">footer</div>
     </div>
   </body>
   
   </html>
   
   <!-- 定位 -->
   <!DOCTYPE html>
   <html lang="en">
   
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>position</title>
     <style>
       html,
       body {
         padding: 0;
         margin: 0;
         height: 100%;
       }
   
       .header,
       .footer {
         position: absolute;
         width: 100%;
         height: 40px;
         line-height: 40px;
         text-align: center;
         background-color: chocolate;
       }
   
       .header {
         top: 0;
         left: 0;
       }
   
       .footer {
         bottom: 0;
         left: 0;
       }
   
       .main {
         width: 100%;
         position: absolute;
         top: 40px;
         left: 0;
         bottom: 40px;
         right: 0;
         background-color: cadetblue;
         overflow: auto;
         text-align: center;
       }
     </style>
   </head>
   
   <body>
     <div class="wrap">
       <div class="header">header</div>
       <div class="main">
         main
         <div style="height:2000px;"></div>
       </div>
       <div class="footer">footer</div>
     </div>
   </body>
   
   </html>
   ```

   

7. 一个标签的class样式的渲染顺序，id、class、标签、伪类的优先级

   > 依次递增的顺序为，类型选择器（例如h1）和伪元素（例如::before）
   >
   > 类选择器（例如 .example），属性选择器（例如，[type='radio']）、伪类（例如，:hover）
   >
   > id选择器（例如，#example）

8. 介绍Css3中的position: sticky

   > 粘性定位
   >
   > 设置了sticky的元素，在屏幕范围内时该元素的位置并不受到定位的影响（设置top、left等属性无效），当该元素的位置将要移出偏移位置时，定位又会变成fixed，根据设置的left、top等属性成固定定位的效果。
   >
   > 1. 该元素并不脱离文档流，仍然保留元素原本在文档流中的位置
   > 2. 但是这个属性的兼容性需要注意一下，因为是一个全新的属性

9. em、px、rem之间的区别

   - em相对长度单位

     - 浏览器的默认字体都是16px，那么1em=16px，以此类推计算12px=0.75em，10px=0.625em，2em=32px
     - 以上这种使用方式很复杂，计算比较麻烦
     - 为了简化font-size换算，我们在body中写入一行代码，<code>body {font-size: 62.5%;}// 公式16px * 62.5%=10</code>，这样页面中1em=10px，1.2em=12px

     - 缺点：
       - em的值并不是固定的
       - em会继承父级元素的字体大小（参考物是父级元素的font-size）
       - em中所有的字体都是相对于父元素的大小决定的，所以如果一个设置了font-size: 1.2em的元素在另外一个设置了 font-size: 1.2em的元素里，那么最后的计算结果是1.2*1.2=1.44em

   - px绝对长度单位

     - 相对于显示器屏幕的分辨率而言的

   - rem相对长度单位

     - 浏览器的默认字体都是16px，那么1rem=16px，以此类推计算12px=0.75rem，10px=0.625rem，2rem=32px
     - 以上这种使用方式很复杂，计算比较麻烦
     - 为了简化font-size换算，我们在body中写入一行代码，<code>body {font-size: 62.5%;}// 公式16px * 62.5%=10</code>，这样页面中1rem=10px，1.2rem=12px
     - 特点：
       - rem单位可谓集相对大小和绝对大小的优点于一身
       - 和em不同的是rem总是相对于根元素
     - 注意：rem支持IE9+，但是对于IE8、Safari4或iOS3.2中不支持rem单位

   - 总结

     1. px在缩放页面时无法调整那些使用它作为单位的字体、按钮等的大小
     2. em的值并不是固定的，会继承父级元素的字体大小，代表倍数
     3. rem的值并不是固定的，始终是基于根元素的，也代表倍数

10. nth-child和nth-type-of有什么区别？

    - 二者都是Css3中的伪类选择器

      ```css
      <section>
          <p>第一个标签</p>
          <p>第二个标签</p>
      </section>
      <style>
      p:nth-child(2){color:red};
      p:nth-of-type(2){color:red};
      </style>
      结果：两个选择器的效果是一致的，都是第二个p标签的文字变为了红色
      
      <section>
          <h1>标题</h1>
          <p>第一个标签</p>
          <p>第二个标签</p>
      </section>
      <style>
      p:nth-child(2){color:red};
      p:nth-of-type(2){color:green};
      </style>
      <!-- 结果：第一个标签字体颜色变红，第二个标签字体颜色变绿 -->
      nth-child：选择父元素section的第二个子元素
      nth-of-type：选择父元素section的第二个p元素，注意是第二个p元素
      
      <section>
          <h1>标题</h1>
          <h2>副标题</h2>
          <p>第一个标签</p>
          <p>第二个标签</p>
      </section>
      <style>
      p:nth-child(2){color:red};
      p:nth-of-type(2){color:green};
      </style>
      结果：第二个p标签字体变绿，第一个p标签字体不变
      因为p:nth-child(2)不会匹配任何元素，因为此时section的第二个元素并不是p标签
      但是nth-of-type(2)仍然可以正常工作，因为它始终选择的是section的第二个p元素
      ```

    - 总结

      > 选择器：nth-child(n)先根据后面的数字选中父元素的第n个子元素，再判断这个子元素是否是前面的选择器，如果是则样式生效，否咋无效；
      >
      > 选择器nth-of-type(n)先在父元素中找出所有符合前面选择器的子元素，再从这些子元素中选择第n个子元素；
      >
      > 如果父元素所有子元素的类型都是相同的，那么这两个选择器是没有区别的。

    - 

11. 把一个方形头像变为圆形头像

    > 一个方形头像长度和宽度相等，均为32px
    >
    > 通过设置border-radius可以实现，那么把border-radius设置为20px或者24px均可以达到效果，那么请问到底把border-radius设置为多大才最合适呢？为什么？
    >
    > 把border-radius设置为16px最合适，因为当长度和宽度相同的时候，把border-radius的值设置为长度（宽度）的一半是最合适的

12. Css超出省略怎么写，三行超出省略怎么写

    ```css
    <!-- 单行 -->
    .single-ellipsis {
        width: 500px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    <!-- 多行 -->
    .multiple-ellipsis {
        将对象作为弹性伸缩盒子模型显示
        display: -webkit-box;
        word-break: break-all;
        设置或检索伸缩盒子对象的子元素的排列方式
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    -webkit-line-clamp: 是一个不规范的属性，他没有出现在css规范草案中。
    [工作中使用的是vue-clamp](https://www.npmjs.com/package/vue-clamp)
    ```

    

13. Css绘制一个三角形

    ```css
    <!-- 上三角 -->
    .triangle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 25px 40px 25px;
        border-color: transparent transparent red transparent;
    }
    <!-- 下三角 -->
    .triangle-reverse {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 40px 25px 0 25px;
        border-color: red transparent transparent transparent;
    }
    ```

14. 说一下CSS预处理器，less带来的好处？

    > css预处理器：为css增加<strong>编程特性</strong>的扩展语言，可以使用变量、简单的逻辑判断、函数等基本编程技巧
    >
    > css预处理器输出的还是标准的css样式
    >
    > less、sass都是动态的样式语言，是css预处理器。
    >
    > less的变量符号是@，sass的变量符号是$

    - 解决的问题

      - css语法不够强大，因为无法嵌套导致有很多重复的选择器
      - 没有变量和合理的样式的复用机制，难以维护

    - less、sass常用语法

      > 变量、嵌套语法、混入、@import、运算、函数、继承等

    - css预处理器带来的好处

      - 代码更加整洁，更易维护，代码量少
      - 基础颜色使用变量，一处动，处处动
      - 常用代码使用代码块，节省大量代码
      - 代码嵌套减少了大量的重复选择器，避免了一些低级错误
      - 变量、混入大大提升了样式的复用性

    - 缺点

      - 编译需要一定的时间

15. 使用CSS实现一个水波纹效果

    ```css
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    	<meta charset="UTF-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<title>Document</title>
    	<style>
    		.wave-content {
    			height: 300px;
    			width: 300px;
    			left: 255px;
    			top: 139px;
    			position: relative;
    		}
    
    		.wave {
    			position: absolute;
    			left: 0px;
    			top: 0px;
    			height: 100%;
    			width: 100%;
    			/* transform-origin: x-axis y-axis z-axis; */
    			/* transform-origin: 50% 50% 0; */
    			transform-origin: center center;
    			background-color: transparent;
    			border: 1px solid #979797;
    			animation-duration: 7s;
    			animation-name: wv;
    			animation-timing-function: linear;
    			animation-iteration-count: infinite;
    			border-radius: 50%;
    			opacity: 0;
    		}
    
    		.wave1 {
    			animation-delay: 0s;
    		}
    
    		.wave2 {
    			animation-delay: 1.5s;
    		}
    
    		.wave3 {
    			animation-delay: 3s;
    		}
    
    		.wave4 {
    			animation-delay: 4.5s;
    		}
    
    		@keyframes wv {
    			0% {
    				opacity: 0;
    				transform: scale(0.5);
    			}
    
    			30% {
    				opacity: 0.7;
    				transform: scale(0.65);
    			}
    
    			70% {
    				opacity: 0.1;
    				transform: scale(0.85);
    			}
    
    			100% {
    				opacity: -0.2;
    				transform: scale(1);
    			}
    		}
    	</style>
    </head>
    
    <body>
    	<div class="wave-content">
    		<div class="wave wave1 "></div>
    		<div class="wave wave2 "></div>
    		<div class="wave wave3 "></div>
    		<div class="wave wave4"></div>
    	</div>
    </body>
    
    </html>
    ```

    

16. position定位都有什么属性

    - 常用的

      - static

        > 默认值。一般不设置position属性时，元素会按照正常的文档流进行排列。

      - relative

        > 它是相对它原本的位置进行便宜的，需要注意的是，相对定位不会脱离文档流，原来的位置仍然保留。

      - absolute

        > 它是相对不是static的最近一级父元素来进行定位的，如果没有这样的元素，那么就相对body元素来进行定位，被定位的元素会脱离文档流，可以通过left，right，top，bottom来调整元素的位置。

      - fixed

        > 固定定位是最好理解的，它是相对于浏览器的窗口进行定位并脱离文档流的

    - 不常用的

      - inherit

        > 继承父元素的position属性，但是需要注意的是IE8以及往前的版本都不支持inherit属性。

      - initial

        > initial关键字用于设置css属性为它的默认值，可作用于任何的css样式（IE不支持该关键字）。

      - sticky

        > 粘性定位。
        >
        > 设置了sticky的元素，在屏幕范围内时该元素的位置并不受到定位影响（设置top、left等属性无效），当该元素的位置将要移出视口范围时，定位又会变成fixed。
        >
        > 该元素并不脱离文档流，仍然保留元素原本在文档流中的位置。
        >
        > 元素固定的相对偏移是相对于离他最近的具有滚动框的祖先元素，如果祖先元素都不可以滚动，那么是相对于viewpoint来计算元素的偏移量。
        >
        > 但是这个属性的兼容性还不是很好，需要注意一下。

17. justify-content: space-between和justify-content: around有什么区别

    > space-between，使得每个块之间产生相同大小的间隔，但是不会在容器和块之间产生。
    >
    > around，会在每个块的两边产生一个相同大小的间隔

18. 按照要求实现如下要求

    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    	<meta charset="UTF-8">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<meta http-equiv="X-UA-Compatible" content="ie=edge">
    	<title>Document</title>
    	<style>
    		* {
    			margin: 0;
    			padding: 0;
    		}
    
    		html,
    		body,
    		#app {
    			margin: 0;
    			padding: 0;
    			height: 100%;
    		}
    
    		#header,
    		#footer {
    			height: 50px;
    			line-height: 50px;
    			text-align: center;
    			background: #555;
    			color: #fff;
    		}
    
    		#side {
    			width: 200px;
    			background: #eee;
    		}
    
    		/* css here */
    		#header {
    			position: fixed;
    			top: 0;
    			left: 0;
    			width: 100%;
    		}
    
    		#footer {
    			position: fixed;
    			bottom: 0;
    			left: 0;
    			width: 100%;
    		}
    
    		#side {
    			position: fixed;
    			height: calc(100% - 100px);
    			top: 50px;
    		}
    
    		#main {
    			padding-top: 50px;
    			padding-bottom: 50px;
    			padding-left: 200px;
    		}
    
    		#main ul {
    			list-style: none;
    		}
    
    		#main ul li {
    			float: left;
    			position: relative;
    		}
    
    		#main ul li:nth-of-type(2n)::after {
    			position: absolute;
    			display: block;
    			content: "|";
    			right: 0px;
    			top: 2px;
    			width: 1px;
    			height: 10px;
    		}
    	</style>
    </head>
    
    <body>
    	<div id="app">
    		<header id="header">header</header>
    		<aside id="side">side</aside>
    		<div id="main">
    			<ul>
    				<li><a href="https://www.bilibili.com/1">Link1</a></li>
    				<li><a href="https://www.bilibili.com/1">Link2</a></li>
    				<li><a href="https://www.bilibili.com/1">Link3</a></li>
    				<br>
    				<li><a href="https://www.bilibili.com/1">Link4</a></li>
    				<li><a href="https://www.bilibili.com/1">Link5</a></li>
    			</ul>
    		</div>
    		<footer id="footer">footer</footer>
    	</div>
    	<script>
    		// JS here
    		/**
    		 * 不考虑兼容性且不能更改dom结构，需求如下：
    		完成经典的上 header ，下 footer ，左边是侧边栏，右边是内容。
    		去掉列表前面的 · ，列表项水平排列，注意里面的br标签需要换行，同时每两个li后有一条竖线。
    		点击列表项不跳转，弹出href内的内容。
    		*/
    		// let alist = document.querySelectorAll('#main ul li a');
    		// for (let i = 0; i < alist.length; i++) {
    		// 	alist[i].addEventListener('click', function (e) {
    		// 		e.preventDefault();
    		// 		alert(e.target);
    		// 	}, true)
    		// }
    
    		let ul = document.querySelector('#main ul');
    		ul.addEventListener('click', function (e) {
    			e = e || window.event;
    			if (e.target.tagName === 'A') {
    				e.preventDefault();
    				alert(e.target);
    			}
    		})
    	</script>
    </body>
    
    </html>
    ```

    

19. 输入URL到页面展示的过程

    > 1. DNS解析
    >
    >    **解析过程**
    >
    >    在浏览器中输入url之后，操作系统会先在hosts文件中检查是否存在这个网址的映射关系，如果存在，返回ip，停止解析
    >
    >    如果没有，则会在本地的DNS服务器中查找，如果找到了，返回ip，完成ip的解析
    >
    >    如果本地DNS服务器也没有查找到，则继续向上查找，直至查找到根域名服务器，如果始终没有找到则浏览器界面展示一个信息，站点不存在，如果找到则返回ip。
    >
    > 2. 建立tcp连接
    >
    >    - tcp协议是用于两台机器在网络上通信上用的
    >    - 如何保证数据传输之前两台机器都具备通信能力呢？需要两台机器之间先进行三次握手后，才能确定两台机器是否具备通信能力
    >    - 第一次握手：目的是为了确认客户端可以发送信息。建立连接，客户端发送连接请求报文段，将SYN设置为1，Seq设置为X，然后客户端进入SYN_SEND状态，等待服务端的确认
    >    - 第二次握手：目的是为了确认服务端可以接受信息。服务端收到SYN报文段，需要对报文段进行确认，设置ACK  = X + 1，同时自己还要发送SYN = 1，Seq = Y，服务器端将上述所有信息放到一个报文段（也就是SYN+ACK报文段）进行发送到客户端，此时，服务器进入SYN_RECV状态。
    >    - 第三次握手：目的是为了确认服务端可以发送信息。客户端收到服务端发来的SYN+ACK报文段，然后将ACK设置为Y+1，向服务器发送ACK报文，这个报文段发送完毕之后，服务器和客户端都进入ESTABLISHED状态。
    >
    > ```sequence
    > 客户端 -> 服务端: SYN = 1 Seq = X
    > 服务端 -> 客户端: SYN = 1 ACK = X + 1 Seq = Y
    > 客户端 -> 服务端: ACk = Y + 1 Seq = Z
    > ```
    >
    > 3. 发送http请求，服务器处理请求，返回响应结果
    >
    >    - tcp连接建立之后，浏览器可以通过http/https协议向服务器发送请求了，服务器处理请求，响应结果（备注：服务器解析请求，如果头部有缓存相关信息，if-none-match和if-modified-since，则验证缓存是否有效，如果有效，返回304，如果无效，返回资源，响应200）
    >
    > 4. 关闭tcp连接，四次挥手
    >
    >    - 四次挥手的目的是为了在一次通讯结束之后，关闭无用连接释放掉服务器资源。
    >    - 因为tcp是一种全双工通讯协议，要想达到上述目的的标志是客户端和服务端都关闭了接受数据和发送数据的接口
    >    - 第一次挥手，主机1（可以是客户端也可以是服务端，这里的主机1，主机2也可以说是主动方和被动方）设置ACK和Seq，向主机2发送一个FIN报文段，此时主机1进入FIN_WAIT_1状态，这表明主机1没有数据要发送给主机2了
    >    - 第二次挥手，主机2收到了主机1发送来的FIN报文段，向主机1返回一个ACK报文段，主机1进入FIN_WAIT_2状态，主机2告诉主机1，我同意你的关闭请求
    >    - 第三次挥手，主机2向主机1发送FIN报文段，请求关闭连接，同时主机2进入LAST_ACK状态
    >    - 第四次挥手，主机1收到主机2发送的FIN报文段，向主机2发送ACK报文段，然后主机1进入TIME_WAIT状态；主机2收到主机1的ACK报文段以后，就关闭连接；此时，主机1等待2MSL后依然没有收到回复，则证明Server端已正常关闭，那好，主机1也可以关闭连接了。
    >
    >    ```sequence
    >    主机1 -> 主机2: Fin = 1 Ack = Z Seq = X
    >    主机2 -> 主机1: Ack= X + 1 Seq = Z
    >    主机2 -> 主机1: Fin = 1 Ack = X Seq = Y
    >    主机1 -> 主机2: Ack = Y Seq = X
    >    ```
    >
    >    
    >
    > 5. 浏览器渲染
    >
    >    ```mermaid
    >    graph LR
    >    A[构建DOM树] --> B(样式计算) --> C(页面布局) --> D(生成分层树) --> E(栅格化)
    >    ```
    >
    >    - 构建DOM树
    >
    >      > 浏览器从网络或硬盘中获得HTML字节数据后会经过一个流程将字节解析为DOM树,先将HTML的原始字节数据转换为文件指定编码的字符,然后浏览器会根据HTML规范来将字符串转换成各种令牌标签，如html、body等。最终解析成一个树状的对象模型，就是dom树。
    >      >
    >      > 具体步骤：
    >      >
    >      > 1. 转码（Bytes -> Characters）—— 读取接收到的 HTML 二进制数据，按指定编码格式将字节转换为 HTML 字符串
    >      > 2. Tokens 化（Characters -> Tokens）—— 解析 HTML，将 HTML 字符串转换为结构清晰的 Tokens，每个 Token 都有特殊的含义同时有自己的一套规则
    >      > 3. 构建 Nodes（Tokens -> Nodes）—— 每个 Node 都添加特定的属性（或属性访问器），通过指针能够确定 Node 的父、子、兄弟关系和所属 treeScope（例如：iframe 的 treeScope 与外层页面的 treeScope 不同）
    >      > 4. 构建 DOM 树（Nodes -> DOM Tree）—— 最重要的工作是建立起每个结点的父子兄弟关系
    >
    >    - 样式计算
    >
    >      > 渲染引擎将 CSS 样式表转化为浏览器可以理解的 styleSheets，计算出 DOM 节点的样式。
    >      >
    >      > CSS 样式来源主要有 3 种，分别是`通过 link 引用的外部 CSS 文件、style标签内的 CSS、元素的 style 属性内嵌的 CSS。`,其样式计算过程主要为：
    >      >
    >      > ```css
    >      > body { font-size: 2em; }
    >      > p { color: blue; }
    >      > span { display: none; }
    >      > div { font-weight: bold; }
    >      > ```
    >      >
    >      > 可以看到上面的 CSS 文本中有很多属性值，如 2em、blue、bold，这些类型数值不容易被渲染引擎理解，所以需要将所有值转换为渲染引擎容易理解的、标准化的计算值，这个过程就是属性值标准化。处理完成后再处理样式的继承和层叠，有些文章将这个过程称为CSSOM的构建过程。
    >
    >    - 页面布局
    >
    >      > 布局过程，即排除 `script、meta` 等功能化、非视觉节点，排除 `display: none` 的节点，计算元素的位置信息，确定元素的位置，构建一棵只包含可见元素布局树。如图：
    >      >
    >      > ![](https://i.bmp.ovh/imgs/2021/04/a8cb48dc13bce454.png)
    >
    >    - 生成分层树
    >
    >      > 页面中有很多复杂的效果，如一些复杂的 3D 变换、页面滚动，或者使用 z-indexing 做 z 轴排序等，为了更加方便地实现这些效果，渲染引擎还需要为特定的节点生成专用的图层，并生成一棵对应的图层树。
    >
    >    - 栅格化
    >
    >      > 合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图。如图：
    >      >
    >      > ![](https://ftp.bmp.ovh/imgs/2021/04/cb363fbeca14384c.png)
    >      >
    >      > 通常一个页面可能很大，但是用户只能看到其中的一部分，我们把用户可以看到的这个部分叫做视口（viewport）。在有些情况下，有的图层可以很大，比如有的页面你使用滚动条要滚动好久才能滚动到底部，但是通过视口，用户只能看到页面的很小一部分，所以在这种情况下，要绘制出所有图层内容的话，就会产生太大的开销，而且也没有必要。
    >      >
    >      > [参考掘金文章](https://juejin.cn/post/6844904054074654728#heading-5)

20. title与alt的区别是什么

    - `alt`是为了在图片未能正常显示时（屏幕阅读器）给予文字说明。且长度必须少于100个英文字符或者用户必须保证替换文字尽可能的短。
    - title对链接起注释作用

21. iframe的优缺点

22. 浏览器乱码的原因是什么？如何解决？

    > 编码不一致。
    >
    > 网页源代码使用gbk，但是其中的中文使用utf-8，这样在浏览器渲染的时候就会造成页面乱码，反之也会乱码。
    >
    > 使用软件编辑html的内容使其编码统一。
    >
    > 如果浏览器浏览的时候出现了乱码，在浏览器中找到转换编码的菜单进行转换。

23. html5中details标签

    - details标签，详细信息展现元素，默认关闭，添加open属性，默认打开信息展示

      ```html
      <details open>
          <summary>Copyright 2011.</summary>
          <p>All pages and graphics on this web site are the property of W3School.</p>
      </details>
      ```

      

24. base url

    > 当页面有大量的锚点或链接跳转时，这些跳转或者域名都在统一的域名下进行，我们就可以通过base标签来简化处理，把公共部分提取出来。
    >
    > ```html
    > <!DOCTYPE html>
    > <html lang="en">
    > 
    > <head>
    > 	<meta charset="UTF-8">
    > 	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    > 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    > 	<title>Document</title>
    > 	<base href="https://www.weibo.com/" target="_blank">
    > </head>
    > 
    > <body>
    > 	<a href="jackiechan">成龙</a>
    > 	<a href="kukoujialing">贾玲</a>
    > </body>
    > 
    > </html>
    > ```
    >
    > 

25. 什么是重绘、重排，哪些操作会导致重绘、重排？

    - 网页生成过程

      - HTML被HTML解析器解析为DOM树
      - CSS被css解析器解析为CSSOM树
      - 结合dom树和cssom树生成一颗render树
      - 生成布局（flow），即将所有渲染树的所有节点进行平面合成
      - 将布局绘制（paint）在屏幕上
      - 最后两步最费时，这两步就是我们通常所说的渲染

      ![](https://ftp.bmp.ovh/imgs/2021/04/b143f0562d6f88c5.png)

    - 渲染

      - 网页生成的时候，至少会渲染一次
      - 在用户访问的过程中，还会不断的重新渲染
      - 注意，重新渲染会重新执行上面的第四步和第五步或者只有第五步

    - 重排、重绘

      - 重排：重新生成布局，重新排列元素
      - 重绘：某些元素的外观被改变，例如颜色，字体大小
      - 重排一定重绘，但是重绘不一定重排

    - 重排（reflow）

      > **概念：**当dom的变化影响了元素的几何位置（<b>dom对象的位置和尺寸大小</b>），浏览器需要重新计算元素的几何属性，将其安放在界面的正确位置，这个过程叫做重排。
      >
      > 重排也叫作回流。
      >
      > 常见引起重排的属性和方法：
      >
      > <u>任何会改变元素几何信息（元素的位置和尺寸大小）的操作，都会引起重排</u>
      >
      > 1. 新增或删除dom
      > 2. 元素的尺寸改变，width、height、border的改变
      > 3. 内容变化，比如在input中输入内容
      > 4. 浏览器窗口尺寸改变，也就是resize事件被触发
      > 5. 计算offsetWidth、offsetHeight属性
      >
      > 重排影响的范围：
      >
      > *由于浏览器渲染界面是基于流式布局模型的，所以触发重排时会对周围的dom重新排列，影响的范围有两种：*
      >
      > 1. 全局范围：从根节点`html`开始对整个渲染树进行重新布局。
      > 2. 局部范围：对渲染树的某部分或某一个渲染对象进行重新布局
      >
      > 重排需要更新渲染树，性能花销很大。

      

    - 重绘（repaint）

      > **概念：**当一个元素的外观发生变化，但是没有改变布局，重新把元素外观绘制出来的过程叫做重绘。
      >
      > 常见的引起重绘的属性：
      >
      > `color`、`border-style`、`visibility`、`background`、`text-decoration`、`background-image`、`background-position`、`outline`、`border-radius`、`box-shadow`

    - 浏览器渲染队列

      > **浏览器的渲染队列机制**：当我们修改了元素的几何属性，导致浏览器触发重排或重绘时。它会把该操作放进渲染队列，等到队列中的操作到了**一定的数量或者到了一定的时间间隔**时，浏览器就会批量执行这些操作。
      >
      > **强制刷新队列：**
      >
      > ```js
      > div.style.left = '10px';
      > console.log(div.offsetLeft);
      > div.style.top = '10px';
      > console.log(div.offsetTop);
      > div.style.width = '20px';
      > console.log(div.offsetWidth);
      > div.style.height = '20px';
      > console.log(div.offsetHeight);
      > // 这段代码会触发4次重排+重绘，因为在console中你请求的这几个样式信息，无论何时浏览器都会立即执行渲染队列的任务，即使该值与你操作中修改的值没关联。
      > // 因为队列中，可能会有影响到这些值的操作，为了给我们最精确的值，浏览器会立即重排+重绘。
      > ```

    - 重排优化建议

      - 分离读写操作

        ```js
        div.style.left = '10px';
        div.style.top = '10px';
        div.style.width = '20px';
        div.style.height = '20px';
        console.log(div.offsetLeft);
        console.log(div.offsetTop);
        console.log(div.offsetWidth);
        console.log(div.offsetHeight);
        // 只触发了一次重排
        // 在第一个console的时候，浏览器把之前上面四个写操作的渲染队列都给清空了。剩下的console，因为渲染队列本来就是空的，所以并没有触发重排，仅仅拿值而已。
        ```

        

      - 样式集中改变

        ```js
        // 建议通过改变class或者csstext属性集中改变样式
        // bad
        var left = 10;
        var top = 10;
        el.style.left = left + "px";
        el.style.top  = top  + "px";
        // good 
        el.className += " theclassname";
        // good
        el.style.cssText += "; left: " + left + "px; top: " + top + "px;";
        ```

        

      - 缓存布局信息

        ```js
        // bad 强制刷新 触发两次重排
        div.style.left = div.offsetLeft + 1 + 'px';
        div.style.top = div.offsetTop + 1 + 'px';
        
        // good 缓存布局信息 相当于读写分离
        var curLeft = div.offsetLeft;
        var curTop = div.offsetTop;
        div.style.left = curLeft + 1 + 'px';
        div.style.top = curTop + 1 + 'px';
        ```

        

      - 离线改变dom

        > 1. 隐藏要操作的dom
        >
        >    ```js
        >    // 在要操作dom之前，通过display隐藏dom，当操作完成之后，才将元素的display属性为可见，因为不可见的元素不会触发重排和重绘。
        >    dom.display = 'none'
        >    // 修改dom样式
        >    dom.display = 'block'
        >    ```
        >
        >    
        >
        > 2. 通过使用[DocumentFragment](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)创建一个`dom`碎片,在它上面批量操作dom，操作完成之后，再添加到文档中，这样只会触发一次重排。
        >
        > 3. 复制节点，在副本上工作，然后替换它！

      - position属性为absolute或fixed

        > position属性为absolute或fixed的元素，重排开销比较小，不用考虑它对其他元素的影响

      - 优化动画

        > 1. 可以把动画效果应用到position属性为absolute或fixed的元素上，这样对其他元素影响较小
        >
        > 2. 启用GPPU加速
        >
        >    ```js
        >    // GPU 硬件加速是指应用 GPU 的图形性能对浏览器中的一些图形操作交给 GPU 来完成，因为 GPU 是专门为处理图形而设计，所以它在速度和能耗上更有效率。
        >    // GPU 加速通常包括以下几个部分：Canvas2D，布局合成, CSS3转换（transitions），CSS3 3D变换（transforms），WebGL和视频(video)。
        >    /*
        >     * 根据上面的结论
        >     * 将 2d transform 换成 3d
        >     * 就可以强制开启 GPU 加速
        >     * 提高动画性能
        >     */
        >    div {
        >      transform: translate3d(10px, 10px, 0);
        >    }
        >    ```

26. flex布局，如何实现把八个元素分两行摆放

    ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
    	<meta charset="UTF-8">
    	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    	<meta name="viewport" content="width=device-width, initial-scale=1.0">
    	<title>Document</title>
    </head>
    
    <body>
    	<style>
    		.parent {
    			width: 100%;
    			height: 150px;
    			display: flex;
    			/* flex-flow: flex-direction flex-wrap */
    			flex-flow: row wrap;
    			/* 从起点开始放置 */
    			align-content: flex-start;
    		}
    
    		.child {
    			box-sizing: border-box;
    			background-color: white;
    			/* flex: flex-grow flex-shrink flex-basis; 默认是0 1 auto 不放大 不缩小 项目占据主轴的空间 */
    			flex: 0 0 25%;
    			height: 50px;
    			border: 1px solid red;
    		}
    	</style>
    	<div class="parent">
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    		<div class="child"></div>
    	</div>
    </body>
    
    </html>
    ```

    

27. css实现一个不知道宽度和高度的div居中都有哪些方法

28. BFC

    > **概念**
    >
    > 块级格式化上下文，它是指一个独立的块级渲染区域，只有块级盒子参与，该区域拥有一套渲染规则来约束块级盒子的布局，且与外部区域无关。
    >
    > **应用场景**
    >
    > 1. 取消margin塌陷
    >
    > 2. 阻止元素被浮动元素覆盖（给该元素设置overflow: hidden）
    >
    > **从一个现象说起**
    >
    > - 一个盒子不设置高度，当内部子元素都浮动的时候，无法撑起自身
    >
    >   ```html
    >   <!DOCTYPE html>
    >   <html lang="en">
    >   
    >   <head>
    >       <meta charset="UTF-8">
    >       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    >       <title>Document</title>
    >       <style>
    >           .father {
    >               border: 1px solid red;
    >           }
    >           .son {
    >               float: left;
    >               width: 200px;
    >               height: 200px;
    >               background-color: aqua;
    >           }
    >       </style>
    >   </head>
    >   
    >   <body>
    >       <div class="father">
    >           <div class="son"></div>
    >           <div class="son"></div>
    >           <div class="son"></div>
    >       </div>
    >   </body>
    >   
    >   </html>
    >   ```
    >
    >   
    >
    > **如何形成BFC**
    >
    > - 在父盒子上添加`float`浮动，比如给`.father {float: left}`，注意，只要父盒子的值float值不是none都可以
    > - 使得父盒子的position属性值不为static或者relative
    > - 父盒子的display设置为inline-flex、inline-block、flex
    > - 父盒子设置overflow: hidden，（以上几种方法中最好的）
    >
    > 

29. CSS如何绘制一个扇形

    ```html
    <!-- 实现方式1 -->
    .box {
    	width: 200px;
    	height: 200px;
    	border-radius: 0 0 0 200px;
    	background: blue;
    }
    <div class="box"></div>
    
    <!-- 实现方式2 -->
    .box {
    	width: 0;
    	height: 0;
    	border-width: 200px;
    	border-radius: 200px;
    	border-style: solid;
    	border-color: transparent transparent red;
    }
    <div class="box"></div>
    
    <!-- 实现方式3 -->
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        .wrapper {
          width: 200px;
          height: 200px;
          position: relative;
          background-color: antiquewhite;
          border-radius: 50%;
        }
    
        .box {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: red;
          border-radius: 50%;
          /* clip属性可以裁剪绝对定位元素, rect(top, right, bottom, left) */
          clip: rect(0 100px 100px 0);
          transform: rotate(180deg);
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="box">
        </div>
      </div>
    </body>
    </html>
    ```

    

30. css性能优化

    - 新特性 contain，控制页面的重排和重绘

      - contain属性的主要目的是隔离指定内容的样式、布局和渲染

      - 使用contain声明，会使得该元素及其子元素和页面上其它元素保持独立

      - contain属性有七种不同的值

        - none 无

        - layout 开启布局限制

        - style 开启样式限制

        - paint 开启渲染限制

        - size 开启size限制

        - content 开启除了size之外的所有限制

        - strict 开启layout、style和paint三种限制

      - 应用场景

        - 比如通常在页面上添加第三方的小饰件时
        - 如果你有一个导航栏或其它类似的东西并不在屏幕可显示范围内出现，浏览器同样会为这些不可见的元素进行渲染。通过设置contain：paint，浏览器就会忽略这些屏幕外不可见的元素，从而加速渲染其它内容。
        
      - 对于第三方的小饰件，始终使用 contain：strict是很好的习惯，它可以保护你的页面不受他们的干扰而出现性能问题
      
    - 避免在css中使用@import
    
      > 比如在first.css中使用 @import url('second.css')
      >
      > 浏览器必须先下载和执行、分许first.css，然后再去下载second.css
      >
      > 建议使用link替代@import
      >
      > 因为使用link可以并行加载资源，提升网页的加载时间
    
    - 异步加载css
    
      > 在默认情况下，浏览器在加载`CSS`时将终止页面的样式呈现（同步加载），也就是加载`CSS`会阻塞`DOM树`的渲染（但并不会阻塞`DOM树`的构建），可以简单理解为：当在加载`CSS`的同时，也在构建`DOM树`，只是没有应用上样式。
      >
      > 实现异步加载的两种方式：
      >
      > 1. 使用媒体查询
      >
      >    ```css
      >    <link rel="stylesheet" href="./index2.css" media="none" onload="this.media='all'">
      >    这样浏览器将会异步加载这个CSS文件（优先度比较低），在加载完毕之后，使用onload属性将link的媒体类型设置为all，然后便开始渲染。
      >    
      >    <link rel="stylesheet" href="./index1.css">
      >    ```
      >
      >    
      >
      > 2. 提前加载 `<link rel="preload" href="./index.css" as="style">`，这种方式浏览器的支持度不好
    
    - 最小化和压缩css
    
      > 去除没有用到的css，去除空格，压缩css
    
31. 常见移动端适配方案

    > 1. 媒体查询
    >
    >    > 主要是通过查询设备的宽度来执行不同的css代码
    >    >
    >    > ```css
    >    > @media screen (max-width:300px) {}
    >    > @media screen (min-width:200px) and (max-width:300px) {}
    >    > ```
    >    >
    >    > 优点：调整屏幕宽度的时候不用刷新页面即可生效、方法简单、成本低、bootstrap再用
    >    >
    >    > 缺点：代码量大
    >
    > 2. flex弹性布局
    >
    >    > 使用px作为单位
    >
    > 3. 百分比布局
    >
    >    > 原理简单、不存在兼容性问题
    >    >
    >    > 无法做到范围上的精细
    >
    > 4. 纯vw方案
    >
    >    > - **vw** : **1vw** 等于 **视口宽度** 的 **1%**
    >    > - **vh** : **1vh** 等于 **视口高度** 的 **1% **
    >    > - **vmin** : 选取 **vw** 和 **vh** 中 **最小** 的那个
    >    > - **vmax** : 选取 **vw** 和 **vh** 中 **最大** 的那个
    >    >
    >    > ```scss
    >    > $base_vw = 375;
    >    > @function vw ($px) {
    >    >     return ($px/$base_vw) * 100vw
    >    > };
    >    > ```
    >    >
    >    > 优点：纯css实现，不存在脚本依赖问题
    >    >
    >    > 缺点：存在兼容性问题，有些浏览器不支持
    >
    > 5. rem实现
    >
    >    > `rem`是相对长度单位，`rem`方案中的样式设计为相对于根元素`font-size`计算值的倍数。根据屏幕宽度设置`html`标签的`font-size`，在布局时使用 **rem** 单位布局，达到自适应的目的。
    >    >
    >    > ```js
    >    > (function (doc, win) {
    >    >      var html = doc.getElementsByTagName("html")[0],
    >    >          // orientationchange->手机屏幕转屏事件
    >    >          // resize->页面大小改变事件
    >    >          reEvt = "orientationchange" in win ? "orientationchange" : "resize",
    >    >          reFontSize = function () {
    >    >              var clientW = doc.documentElement.clientWidth || doc.body.clientWidth;
    >    >              if (!clientW) {
    >    >                  return;
    >    >              }
    >    >              html.style.fontSize = 50 * (clientW / 375) + "px";
    >    >          }
    >    >      win.addEventListener(reEvt, reFontSize);
    >    >      // DOMContentLoaded->dom加载完就执行,onload要dom/css/js都加载完才执行
    >    >      doc.addEventListener("DOMContentLoaded", reFontSize);
    >    >  })(document, window);
    >    > ```
    >    >
    >    > 
    >
    >    

32. 

