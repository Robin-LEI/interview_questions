# 设计原则

1. 单一职责原则
   - 一个程序只做好一件事
   - 如果功能过于复杂就拆开，每个部分保持独立
2. 开放/封闭原则
   - 对扩展开放，对修改关闭
   - 增加新的需求时，扩展新代码，而非修改已有代码
3. 里式替换原则
   - 子类能覆盖父类
   - 父类能出现的地方子类就能出现
4. 接口隔离原则
   - 保持接口的单一独立
5. 依赖倒转原则
   - 面向接口编程，依赖于抽象而不是依赖于具体
   - 使用方更关注接口而不是关注类的实现



# 设计模式的类型

- 创建型
- 结构型
- 行为型



# 常见的设计模式

### 1. 外观模式

> 为一组复杂的子系统提供一个高级的统一接口进行访问
>
> 可以简化底层接口的复杂性，也可以解决浏览器的兼容性问题

> onclick属于DOM0级事件，会发生覆盖风险
>
> addEventListener属于DOM2级事件处理程序（老版本IE不支持这个方法，使用attachEvent）

> 优点：提高安全性、减少系统间相互依赖
>
> 缺点：不符合开放/封闭原则，改东西很麻烦

```js
// 采用外观模式封装一个方法，解决浏览器的兼容性问题
function addEvent(dom, type, fn) {
    if (dom.addEventListener) {
        dom.addEventListener(type, fn, false);
    } else if (dom.attachEvent) {
        dom.attachEvent('on' + type, fn);
    } else {
        dom['on' + type] = fn;
    }
}

// 简化底层接口的复杂性
// 获取事件对象
function getEvent(event) {
    // 标准浏览器返回 event，IE下返回window.event
    return event || window.event;
}

// 获取模板元素
function getTarget(event) {
    event = getEvent(event);
    // 标准浏览器下返回 event.target,IE下返回event.srcElement
    return event.target || event.srcElement;
}

// 阻止默认行为
function preventDefault(event) {
    let event = getEvent(event);
    if (event.preventDefault) { // 标准浏览器
        event.preventDefault();
    } else { // IE
        event.returnValue = false;
    }
}

// 使用
document.onclick = function(e) {
    preventDefault(e);
    // 获取事件源目标对象
    if (getTarget(e) === 'xx') {
        console.log('find it')
    }
}
```



### 2. 迭代器模式

> 在不暴露对象内部结构的同时，可以顺序的访问聚合对象内部的元素

> 比如我们访问页面中一个容器下面的li标签，就可以创建一个迭代器对象，为每一个元素处理逻辑。比如获取容器下面的第一个元素、第二个元素、前一个、后一个等。
>
> 数组迭代器，遍历数组的同时可以拿到数组的每一项和value
>
> 对象迭代器
>
> 可以解决分支循环嵌套，减少分支判断

> 优点：减少对象的使用者和对象的内部结构之间的耦合。



### 3. 代理模式

> 由于一个对象不能直接引用另外一个对象，所以需要通过代理对象在这两个对象之间起作用。

> 站长统计
>
> JSONP



### 4. 单例模式

> 也被称为单体模式，是只允许实例化一次的对象类
>
> 有时候我们也用一个对象来规划一个命名空间，来管理对象上的属性和方法

> 应用场景：定义命名空间
>
> 管理代码库的各个模块，比如早起百度内部就是这样实现编码的，如果需要新增一个设置元素class的方法，就需要在baidu.dom模块上加一个addClass
>
> 管理静态变量（JavaScript本身没有静态变量，没有static关键字，但是可以模拟，静态变量的特点是定义后不能修改只能访问）
>
> ```js
> var Conf = (function(){
>     var conf = {
>         COUNT: 1000 // 静态变量，不能修改
>     }
>     return {
>         get: function(name) {
>             return conf[name] || null
>         }
>     }
> })()
> 
> var count = Conf.get('COUNT')
> console.log(count)
> ```
>
> 惰性单例（惰性创建）
>
> ```js
> var LazySingle = (function() {
>     let _instance = null;
>     function Single() {
>         return {
>             publicProperty: ‘1’
>         }
>     }
>     return function() {
>         if (!_instance) {
>             // 只允许实例化一次对象类，有时也为了节省系统资源
>             _instance = new Single();
>         }
>         return _instance;
>     }
> })();
> console.log(LazySingle().publicProperty);
> ```

> 缺点：扩展很困难，只能修改源代码
>
> 单例类的职责过重，在一定程度上违背了单一职责原则



### 5. 简单工厂模式

> 主要用来创建同一类对象

> 如果类太多，封装起来，向外暴露一个，使用者不用再去关注创建这些对象到底依赖于哪些基类，只需要记住这个函数即可，这个函数通常也被称为工厂函数，这种模式叫做简单工厂模式。

```js
// 篮球基类
let Basketball = function() {
    this.intro = '篮球'
}
Basketball.prototype = {
    getMember: function() {
        console.log('每个队需要五名队员')
    }
}
// 足球基类
let Football = function() {
    this.intro = '篮球'
}
Football.prototype = {
    getMember: function() {
        console.log('每个队需要3名队员')
    }
}
// 网球基类
let Tennis = function() {
    this.intro = '篮球'
}
Tennis.prototype = {
    getMember: function() {
        console.log('每个队需要1名队员')
    }
}

// 向外暴露一个运动工厂
let sportFactory = function(name) {
    switch(name) {
        case 'basketball':
            return new Basketball()
        case 'football':
            return new Football()
        case 'tennis':
            return new Tennis()
    }
}
```

> 简单工厂模式还可以创建相似对象
>
> ```js
> function createBook(name, time, type) { // 工厂模式
>     let o = new Object();
>     o.name = name;
>     o.time = time;
>     o.type = type;
>     return o; // 将对象返回
> }
> ```
>
> 可以实现代码复用，共用资源

> 综上，有两种方式实现简单工厂，第一种是通过类实例化对象创建的；第二种是通过创建一个新对象然后包装增强其属性和功能来实现的。



### 6. 抽象工厂模式

> JavaScript中abstract还是一个保留字
>
> 抽象类是一种声明但是不能使用的类，当你使用的时候就会报错，在js中可以在类的方法中抛出错误手动模拟抽象类
>
> ```js
> let Car = function() {}
> Car.prototype = {
>     getPrice() {
>         return new Error('抽象方法不能调用')
>     },
>     getSpeed() {
>         return new Error('抽象方法不能调用')
>     }
> }
> ```
>
> 抽象类在继承中是很有用的，子类继承父类，要重写父类的方法，否则调用的时候找到父类的方法会报错。

> 这个模式创建出来的不是一个对象实例，是一个类簇。
>
> 其实就是实现一个子类继承父类的方法。
>
> 避免子类忘记重写父类的抽象方法。
>
> ```js
> // 这是一个抽象工厂方法
> let VehicleFactory = function(subType, superType) {
>     // 判断抽象工厂中是否存在抽象类
>     if (typeof VehicleFactory[superType] === 'function') {
>         // 缓存类
>         function F() {}
>         // 继承父类的属性和方法
>         F.prototype = new VehicleFactory[superType]();
>         subType.constructor = subType;
>         subType.prototype = new F(); // 子类原型继承父类
>     } else {
>         // 不存在该抽象类，抛出错误
>         throw new Error('未创建该抽象类')
>     }
> }
> 
> VehicleFactory.Car = function() { // 定义一个抽象类
>     this.type = 'car'
> }
> VehicleFactory.Car.prototype = { // 定义抽象方法
>     getPrice: function() {
>         return new Error('抽象方法不能调用')
>     },
>     getSpeed: function() {
>         return new Error('抽象方法不能调用')
>     }
> }
> 
> // 宝马汽车子类
> let BMW = function(price, speed) {
>     this.price = price;
>     this.speed = speed;
> }
> // 抽象工厂实现对抽象类的继承
> VehicleFactory(BMW, 'Car');
> BMW.prototype.getPrice = function() {
>     return this.price;
> }
> BMW.prototype.getSpeed = function() {
>     return this.speed;
> }
> 
> // 测试代码
> let bmw = new BMW(300000, 120);
> // console.log(bmw.price);
> // console.log(bmw.speed);
> console.log(bmw.getPrice());
> console.log(bmw.getSpeed());
> ```



### 7. 策略模式

> 封装一系列的算法策略，并使得他们之间可以相互替换

> 涉及到两个类的概念
>
> 环境类（Context）：负责接受用户的请求，并派发给策略算法执行
>
> 策略类（Strategy）：策略算法的具体实现，接受环境类派发的计算请求，并返回计算结果

```js
// demo1
// 有一个计算员工年终奖的需求，假设，绩效为 S 的员工年终奖是 4 倍工资，
// 绩效为 A 的员工年终奖是 3 倍工资，绩效为 B 的员工年终奖是 2 倍工资，下面我们来计算员工的年终奖。

// 传统的写法
var calculateBonus = function (performanceLevel, salary) {
      if (performanceLevel === 'S') {
          return salary * 4;
      }
      if (performanceLevel === 'A') {
          return salary * 3;
      }
      if (performanceLevel === 'B') {
          return salary * 2;
      }
  };

console.log(calculateBonus('B', 20000)); // 输出：40000 
console.log(calculateBonus('S', 6000)); // 输出：24000

// 缺点：
// 1. 采用了大量的if-else，代码逻辑不清楚，不利于维护
// 2. 如果需要修改绩效对应的奖金系数，需要修改源码，违反了对扩展开放/对修改关闭
// 3. 代码复用性差

// 采用策略模式修改
// 定义一个策略类
const strategies = {
    S: salary => {
        return salary * 4
    },
    A: salary => {
        return salary * 3
    },
    B: salary => {
        return salary * 2
    }
}

// 定义一个环境类，派发给策略类执行
const calculateBonus = (level, salary) => {
    return strategies[level](salary)
}

console.log(calculateBonus('S', 20000))
console.log(calculateBonus('A', 10000))

// 优点：
// 1. 减少了if-else的过多嵌套，代码更加清晰

// 采用类+策略模式的形式修改代码，实现代码的复用性
// 定义一个策略类
// 策略类 策略算法的具体实现
class Strategies {
  constructor() {
    this.strategies = {
      S: salary => {
        return salary * 4
      },
      A: salary => {
        return salary * 3
      },
      B: salary => {
        return salary * 2
      }
    }
  }
}

// 环境类 接受用户的请求 派发给策略算法执行
class ContextClass extends Strategies {
  calculateBonus(level, salary) {
    return this.strategies[level](salary)
  }
}

const contextClass = new ContextClass();
console.log(contextClass.calculateBonus('S', 200))
```

```js
// demo2 表单校验
// 传统做法
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<form id='registerForm' action="xxx" method="post">
		用户名：<input type="text" name="userName">
		密码：<input type="text" name="password">
		手机号：<input type="text" name="phone">
		<button>提交</button>
	</form>
	<script type="text/javascript">
        let registerForm = document.getElementById('registerForm')

        registerForm.onsubmit = () => {
                if (registerForm.userName.value) {
                        alert('用户名不能为空')
                        return false
                }

                if (registerForm.password.value.length < 6) {
                        alert('密码长度不能少于6')
                        return false
                }

                if (!/(^1[3|5|8][0-9]$)/.test(registerForm.phone.value)) {
                        alert('手机号码格式不正确')
                        return false
                }
        }
        </script>
</body>
</html>

// 策略模式做法
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	 
	<form action="http://xxx.com/register" id="registerForm" method="post">
		  请输入用户名：
		<input type="text" name="userName" />
		  请输入密码：
		<input type="text" name="password" />
		  请输入手机号码：
		<input type="text" name="phoneNumber" />
		<button>
			提交
		</button>
	</form>
	<script type="text/javascript" src="index.js">
		
	</script>             
</body>   
</html>

// 表单dom
const registerForm = document.getElementById('registerForm')

// 表单规则
const rules = {
    userName: [
        {
            strategy: 'isNonEmpty',
            errorMsg: '用户名不能为空'
        },
        {
            strategy: 'minLength:10',
            errorMsg: '用户名长度不能小于10位'
        }	
    ],
    password: [
        {
            strategy: 'minLength:6',
            errorMsg: '密码长度不能小于6位'
        }
    ],
    phoneNumber: [
        {
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }
    ]
}

// 策略类
var strategies = { 
    isNonEmpty: function(value, errorMsg) { 
        if (value === '') { 
            return errorMsg; 
        } 
    },
     minLength: function(value, errorMsg, length) { 
        console.log(length)
        if (value.length < length) { 
            return errorMsg; 
        } 
    },
     isMobile: function(value, errorMsg) { 
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) { 
            return errorMsg; 
        } 
    } 
};  

// 验证类
const Validator = function () {
    this.cache = []
}

// 添加验证方法
Validator.prototype.add = function ({ dom, rules}) {
    rules.forEach(rule => {
        const { strategy, errorMsg } = rule
        console.log(rule)
        const [ strategyName, strategyCondition ] = strategy.split(':')
        console.log(strategyName)
        const { value } = dom
        this.cache.push(strategies[strategyName].bind(dom, value, errorMsg, strategyCondition))
    })
}

// 开始验证
Validator.prototype.start = function () {
    let errorMsg
    this.cache.some(cacheItem => {
            const _errorMsg = cacheItem()
            if (_errorMsg) {
                    errorMsg = _errorMsg
                    return true
            } else {
                    return false
            }
    })

    return errorMsg
}

// 验证函数
const validatorFn = () => {
    const validator = new Validator()
    console.log(validator.add)

    Object.keys(rules).forEach(key => {
        console.log(2222222, rules[key])
        validator.add({
            dom: registerForm[key],
            rules: rules[key]
        })
    })

    const errorMsg = validator.start()
    return errorMsg
}


// 表单提交
registerForm.onsubmit = () => {
    const errorMsg = validatorFn()
    if (errorMsg) {
        alert(errorMsg)
        return false
    }
    return false
}
```





### 8. 观察者模式

> 也被称为发布-订阅模式
>
> 也被称为消息机制

> 被观察者也被称为主体对象

> 案例：比如飞机、地面中转站、卫星之间的关系。
>
> 中转站与天空中的飞机要想知道某架飞机的运行情况，各地中转站都需要在卫星上注册这架飞机的信息，以便接受到这架飞机的信息。于是每当飞机到达一个地方时，都会向卫星发出位置信息，然后卫星又将该信息广播到已经订阅过这架飞机的中转站。这样每个中转站都可以接受飞机的消息并做相应的处理来避免飞机事故的发生。

> 观察者对象，有一个消息容器、和三个方法，分别是订阅消息方法、取消订阅的方法、发送订阅的方法
>
> ```js
> // 观察者对象
> let Observer = (function () {
>     // 防止消息队列暴露被恶意修改，所以将其设置为私有变量保存
>     let _messages = {}
>     return {
>         regist: function(),
>         fire: function() {},
>        	remove: function() {}
>     }
> })()
> ```
>
> 
>
> **订阅消息**
>
> 接受两个参数，一个是消息的类型，一个是相应的动作，在推入到消息队列时，如果不存在此消息，则应该创建一个该消息类型并将这个消息放入到消息队列中，如果存在此消息，就将该消息执行方法推入该消息对应的执行方法队列中
>
> ```js
> regist: function(type, fn) {
>     if (typeof _messages[type] === undefined) {
>         _messages[type] = [fn]
>     } else {
>         _messages[type].push(fn)
>     }
> }
> ```
>
> 
>
> **取消订阅**
>
> > 将订阅者注销的消息从消息队列中移除
> >
> > 接受两个参数，一个是消息类型，一个是要执行的某一动作
>
> ```js
> remove: function(type, fn) {
>     if (!_messages[type]) return
>     for (let i = 0; i < _messages[type].length; i++) {
>          if (_messages[type][i] === fn) {
>              _messages[type].splice(i, 1)
>          }
>     }
> }
> ```
>
> 
>
> **发送订阅**
>
> 当观察者发布一个消息时将所有订阅者订阅的消息一次全部执行
>
> 接受两个参数，一个是消息类型，一个是执行动作时候的参数
>
> ```js
> fire: function(type, args) {
>     if (!_messages[type]) return
>     for (let i = 0; i < _messages[type].length; i++) {
>         _messages[type][i].call(this, {
>             type,
>             args
>         })
>     }
> }
> ```

> 可以进行模块间的解耦、对象间的解耦，每一个订阅者对象可以自己做自己的事情



### 9. 中介者模式

> 降低对象之间的耦合

> 需求：项目经理准备在首页的导航模块添加一个设置层，让用户可以通过设置层，来设置导航的样式
>
> 分析：设置层只是单向的控制导航模块内导航的样式，单向通信可以使用中介者模式

> 中介者模式和观察者模式都是通过消息的收发机制实现的。
>
> 中介者消息的发送只有一个，就是中介者对象，中介者对象不能订阅消息，中介者对象只能是消息的发送方
>
> 观察者模式中的订阅者是双向的，既可以是消息的发布者也可以是消息的订阅者，但是在中介者模式，订阅者是单向的，只能是消息的订阅者。



### 10. 访问者模式

> 思想就是我们在不改变操作对象的同时，为他添加新的操作方法，来实现对操作对象的访问
>
> 内部实现的核心就是利用call和apply

`在attachEvent事件中的this指向的不是这个元素而是window，所以如果你想获取事件对象，只能通过window.e获取`

```js
// IE中的事件绑定
function bindIEEvent(dom, type, fn, data) { // data自定义数据
    let data = data || {}
    dom.attachEvent('on' + type, function(e) {
        fn.call(dom, e, data) // call和apply可以改变函数执行时候的作用域
    })
}

// 为什么需要自定义数据data?
// W3C给我们定义事件的绑定函数回调中只能接受一个参数e，但是有时候并不能满足我们的需求，比如我们在点击按钮的时候可以传递一些数据
```





### 11. 状态模式

> 最终目的是简化分支判断流程

> 状态模式解决了分支判断语句臃肿的问题，将每个分支作为一种状态独立出来，方便每种状态的管理而又不至于每次执行时遍历所有分支

```js
// 比如我们现在需要根据一个投票的状态结果，去展示不同类型的图片
// 传统写法
function showResult(result) {
    if (result == 0) {
        console.log('展示第1张图片')
    } else if (result == 1) {
        console.log('展示第2张图片')
    } else if (result == 2) {
        console.log('展示第3张图片')
    } else {
        console.log('展示第4张图片')
    }
}

// 采用状态模式的写法
let ResultState = function() {
    // 判断的结果保存在内部状态中
    let States = {
        // 每一种状态作为一个独立的方法保存
        state0: function() {
            console.log('展示第1张图片')
        },
        state1: function() {
            console.log('展示第2张图片')
        },
        state2: function() {
            console.log('展示第3张图片')
        }
    }
    // 获取某一种状态并且执行其方法
    function show(result) {
        return States['state' + result] && States['state' + result]();
    }
    return {
        show
    }
}()

// 如果想展示第二张图片
ResultState.show(1);
```





### 12. 享元模式

> 运用共享技术有效的支持细粒度的对象，避免对象间拥有相同内容造成多余的开销

> 享元模式将数据和方法分成内部数据、内部方法、外部数据、外部方法。内部数据和内部方法是指相似或者共有的数据和方法，所以将这一部分提取出来减少开销，可以提高性能。

> 有时候系统存在大量的对象，会造成大量的内存占用，使用享元模式来减少内存消耗是很有必要的

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
  <div id="container">
  </div>
  <button id="next">next</button>
  <script>
    let Flyweight = function() {
      let created = []
      function create() {
        // 只会执行五次 也就是只会创建五个dom
        let dom = document.createElement('div')
        document.getElementById('container').appendChild(dom)
        created.push(dom)
        return dom
      }
      return {
        getDiv: function() {
          if (created.length < 5) {
            return create()
          } else {
            let div = created.shift()
            created.push(div)
            return div
          }
        }
      }
    }()

    // 模拟数据
    let article = ['第1条新闻', '第2条新闻', '第3条新闻', '第4条新闻','第5条新闻', '第6条新闻',
    '第7条新闻', '第8条新闻','第9条新闻', '第10条新闻','第11条新闻', '第12条新闻','第13条新闻', 
    '第14条新闻','第15条新闻', '第16条新闻','第17条新闻', '第18条新闻','第19条新闻', '第20条新闻',
    '第21条新闻', '第22条新闻'];

    // 初始化页面
    let paper = 0, num = 5, len = article.length;

    // 默认添加5条新闻  一开始创建了五次dom
    for (let i = 0; i < num; i++) {
      if (article[i]) {
        Flyweight.getDiv().innerHTML = article[i];
      }
    }

    document.getElementById('next').addEventListener('click', function() {
      // 如果新闻内容不超过5条 直接返回
      if (article.length <= 5) {
        return
      }
      let n = ++paper * num % len; // 获取当前页面的第一条新闻索引
      let j = 0; // 循环变量
      for (; j < 5; j++) {
        if (article[n + j]) { // 如果存在 第 n + j 条数据则插入
          Flyweight.getDiv().innerHTML = article[n + j];
        } else if (article[n + j - len]) { // 否则插入起始位置第 n + j - len 条
          Flyweight.getDiv().innerHTML = article[n + j - len];
        } else { // 如果都不存在插入空字符串
          Flyweight.getDiv().innerHTML = ''
        }
      }
    }, false)

    // 通过享元模式每次操作只需要操作那五个元素 不需要在重新创建dom，如果一个页面有几千条新闻数据，采用
    // 原始方式很消耗性能的
  </script>
</body>
</html>
```



### 13. 原型模式

> **原型继承的实现是不需要了解创建的过程的，谈谈你的理解**
>
> 原型模式就是将原型对象指向创建对象的类，使这些类共享原型的属性和方法。
>
> 使用原型模式的扩展性强，所以不要随意的去修改基类或者子类



### 14. 装饰者模式

> 在不改变原有对象的基础上，通过对其进行包装扩展，也就是添加一些属性和方法，使得原有对象可以满足用户的更复杂的需求
>
> ```js
> // 例如，有一些表单的输入框，之前要求点击输入框的时候输入的时候，如果输入的文本长度超过限制，出现一行提示文本
> // 现在要求改成一开始默认出现提示文本，点击输入框提示文本消失
> // 那么问题来了，表单中有那么多输入框，不可能一一修改原有的代码
> // 采用装饰者模式，保留原有的同时扩展自己的
> let decorator = function(inputId, fn) {
>     // 获取事件源
>     let input = document.getElementById(inputId)
>     if (typeof input.onclick === 'function') { // 已经绑定过事件
>         let oldClickFn = input.onclick; // 保留老的
>         input.onclick = function() {
>             oldClickFn();
>             input.onclick = fn;
>         }
>     } else { // 没有绑定
>         input.onclick = fn;
>     }
> }
> // 修改手机输入框
> decorator('tel_input', () => {
>     tips.style.display = 'none'
> })
> // 地址输入框
> decorator('address_input', () => {
>     tips.style.display = 'none'
> })
> ```
>
> 





### MVC模式

> M：model，模型层
>
> V：view，视图层
>
> C：controller，业务逻辑层，也叫控制器层
>
> MVC模式就是为了解决在一个组件中，内容太过复杂，引起层次的混乱问题，MVC用来处理分层

> **思想**
>
> 将页面分成三个部分，数据层部分、视图层部分、控制器层部分。视图层可以调用数据层的数据创建视图，控制器层可以调用数据层的数据和视图层的视图创建页面增加逻辑。

```js
// 雏形
$(function() {
    let MVC = MVC || {} // 初始化对象
    // 初始化数据模型层
    MVC.model = (function() {})()
    // 初始化视图层
    MVC.view = (function() {})()
    // 初始化控制器层
    MVC.ctrl = (function() {})()
})
// 注意，每个对象都是一个自执行函数，为什么？
// 因为上面三个层次对象可以被调用的，但是声明的函数在执行前是不能被调用的，所以先自动执行一遍是为了给其它对象的调用提供接口和方法
```

```js
// MVC 数据模型层
MVC.model = (function() {
    // 内部数据对象
    let M = {}
    M.data = {} // 这里可以绑定从服务端获取的数据
    // 页面加载的时候，提供一份供外部使用的配置数据
    M.conf = {}
    // 返回数据模型层对象的操作方法
    return {
        getData: function(m) {
            // 获取想要获取的数据
            return M.data[m];
        },
        // 设置服务端数据
        setData: function(k, v) {
            M.data[k] = v;
            return this;
        }
    }
})();
// 这样我们就可以视图对象以及控制层对象去操作模型数据对象的数据了
```

> 在视图层的内部需要引入模型层的数据
>
> 需要返回一些操作方法的接口供控制层使用

> 控制层
>
> 在内部获取数据层和视图层的引用
>
> 控制层要做的事情其实很简单，第一：创建视图页面，第二：添加交互与动画特效

> MVC模式的优点是可以降低耦合，降低了开发和维护成本
>
> 各层各司其职



### MVP模式

> M：Model 模型
>
> V：View 视图
>
> P：Presenter 管理器
>
> View层不直接引用Model层的数据，而是通过Presenter层实现对Model层内的数据访问。
>
> 所有层次的交互都发生在Presenter层。

> 既然有了MVC，为什么还要MVP呢？
>
> 因为在MVC模式开发中，视图层因为要渲染页面有时候需要引用数据层的数据，对于发生的这一切，控制器常常不得而知。因此数据层的数据修改，常常在控制器不知情的情况下影响到视图的呈现。
>
> MVC模式没有实现视图和数据的解耦。增加后期维护成本。
>
> MVP实现了视图和数据的解耦，数据层只负责存储数据，视图层只负责创建视图模板，管理层负责管理数据、UI视图创建、交互逻辑、动画特效等一切事务。它们之间的业务独立又单一，因此我们添加或修改模块，只需要对管理层做处理就好了。

> 管理器内过多的逻辑也使得其开发和维护的成本比较高



### MVVM模式

> M：Model 数据模型层
>
> V：View 视图
>
> VM：ViewModel 视图模型

> 为什么出现MVVM？
>
> 之前采用MVC或者MVP开发，在实现页面的某个组件时，如果这个组件之前已经存在过或者存在类似的，也就是页面的UI功能类似，这个时候创建的管理器或者控制器代码或多或少存在重复。
>
> 而且操作管理器的成本也很大。

> MVVM模式的特点
>
> 对于视图层（V）的元素是要被视图模型层（VM）监听的。
>
> 采用MVVM开发，在页面中直接书写HTML代码创建视图，开发起来更方便。主要用来分离视图和数据的。
>
> 测试问题更加容易，只需要针对视图模型层编写测试代码即可。
>
> 视图层可以独立开发，专业的开发人员可以专注于编写视图模型层里面的业务逻辑。

