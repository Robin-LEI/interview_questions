ts中的接口，通过关键字 interface 去定义，用来制定一个标准。

1. 属性接口，用来对属性进行批量限制

   ```typescript
   interface Config {
       name: string;
       age: number;
   }
   
   function getInfo(info: Config):void {
       console.log(info.name, info.age)
   }
   ```

   

2. 函数型接口，用来对函数的参数和返回值进行限制

   ```typescript
   interface encrypt {
       (value1: string, value2: number):string;
   }
   function md5(jm: encrypt, val1: string, val2: string):string {
       return jm(val1, val2)
   }
   ```

   

3. 可索引接口（不常用），分为数组的可索引接口，对象的可索引接口

   ```typescript
   interface userArr {
       [index: number]: string; // 索引是 number 类型，每一项的值是 string 类型
   }
   
   inter userObj {
       [index: string]: string; // 索引是 string 类型，每一项的值的类型是 string 类型
   }
   ```

   

4. 类类型接口，对类的约束，类通过 implements 实现接口，就要实现接口中定义的属性和方法

   ```typescript
   interface Animal {
     name: string;
     eat(str: string): void;
   }
   
   class Dog implements Animal {
     name: string;
     constructor(name: string) {
       this.name = name;
     }
   
     eat() {
       console.log(this.name);
     }
   }
   ```

5. 接口可以继承接口 通过 extends

   ```typescript
   interface Animal {
     eat(): void;
   }
   
   interface Person extends Animal {
     work():void;
   }
   
   class Boy implements Person {
     constructor() {}
     eat() {}
     work() {}
   }
   ```

   