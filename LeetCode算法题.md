1. 括号生成

   ```js
   // 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
   输入：n = 3
   输出：["((()))","(()())","(())()","()(())","()()()"]
   
   输入：n = 1
   输出：["()"]
   
   1 <= n <= 8
   
   /**
    * @param {number} n
    * @return {string[]}
    */
   var generateParenthesis = function(n) {
       let res = [];
       function dfs(leftRemain, rightRemain, str) {
           if (leftRemain === 0 && rightRemain === 0) {
               return res.push(str);
           }
           if (leftRemain > 0) {
               dfs(leftRemain - 1, rightRemain, str + '(')
           }
           if (leftRemain < rightRemain) {
               dfs(leftRemain, rightRemain - 1, str + ')')
           }
       }
       dfs(n, n, '');
       return res;
   };
   ```

   [![gBXZV0.png](https://z3.ax1x.com/2021/05/13/gBXZV0.png)](https://imgtu.com/i/gBXZV0)

2. 两数相除

   ```js
   // 给定两个整数，被除数 dividend 和除数 divisor。将两数相除，要求不使用乘法、除法和 mod 运算符。
   // 返回被除数 dividend 除以除数 divisor 得到的商。
   
   // 整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2
   
   示例 1:
   输入: dividend = 10, divisor = 3
   输出: 3
   解释: 10/3 = truncate(3.33333..) = truncate(3) = 3
   
   示例 2:
   输入: dividend = 7, divisor = -3
   输出: -2
   解释: 7/-3 = truncate(-2.33333..) = -2
   
   提示：
   被除数和除数均为 32 位有符号整数。
   除数不为 0。
   假设我们的环境只能存储 32 位有符号整数，其数值范围是 [−231,  231 − 1]。本题中，如果除法结果溢出，则返回 231 − 1。
   
   ```

   

3. 两数相乘

   ```js
   给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。
   示例 1:
   输入: num1 = "2", num2 = "3"
   输出: "6"
   
   示例 2:
   输入: num1 = "123", num2 = "456"
   输出: "56088"
   
   说明：
   1. num1 和 num2 的长度小于110。
   2. num1 和 num2 只包含数字 0-9。
   3. num1 和 num2 均不以零开头，除非是数字 0 本身。
   4. 不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。
   
   
   var multiply = function(num1, num2) {
       if (num1 == '0' || num2 == "0") return "0"
       // if (num1.length > 110 || num2.length > 110) throw new Error('num1 和 num2 的长度小于110')
       // if (!/^[\d'"]+$/g.test(num1) || !/^[\d'"]+$/g.test(num1)) throw new Error('num1 和 num2 只包含数字 0-9')
       // if (!/^['"0]+/g.test(num1) || !/^['"0]+/g.test(num2)) throw new Error('num1 和 num2 均不以零开头')
       let yushu = '', shang = '', arr = [], sum = '', count = 0, result = ''
       for (let i = num1.length - 1; i >= 0; i--) {
           for (let j = num2.length - 1; j >= 0; j--) {
               let mul = num1[i] * num2[j]
               if (mul >= 10) {
                   yushu = (mul + shang) % 10
                   shang = parseInt((mul + shang) / 10)
                   sum = yushu + sum
               } else {
                   let temp = (+mul + +shang)
                   if (temp >= 10) {
                       sum = temp % 10 + sum
                       shang = parseInt(temp / 10)
                   } else {
                       sum = temp + sum
                       shang = ''
                   }
               }
           }
           arr.push((shang + sum) + '0'.repeat(count))
           qiuhe(result, (shang + sum) + '0'.repeat(count))
           count++
           sum = ''
           shang = ''
           yushu = ''
       }
       function qiuhe(params_1, params_2) {
           if (!params_1) {
               result = params_2
           }
           if (params_1.length > params_2.length) {
               params_2 = params_2.padStart(params_1.length, '0')
           }
           if (params_1.length < params_2.length) {
               params_1 = params_1.padStart(params_2.length, '0')
           }
           let res = '', temp_res = ''
           for (let i = params_1.length - 1; i >= 0; i--) {
               let p1 = params_1[i], p2 = params_2[i]
               let temp = +p1 + +p2 + res
               res = ''
               if (temp >= 10) {
                   res = parseInt(temp / 10)
               }
               if (i == 0) {
                   temp_res = temp + temp_res
               } else {
                   temp_res = (temp % 10) + temp_res
               }
           }
           result = temp_res
       }
       return result
   }
   
   console.log(multiply("123456789", "987654321"))
   ```

   

4. 实现 [pow(*x*, *n*)](https://www.cplusplus.com/reference/valarray/pow/) ，即计算 x 的 n 次幂函数（即，xn）。

   ```js
   示例 1：
   输入：x = 2.00000, n = 10
   输出：1024.00000
   
   示例 2：
   输入：x = 2.10000, n = 3
   输出：9.26100
   
   示例 3：
   输入：x = 2.00000, n = -2
   输出：0.25000
   解释：2-2 = 1/22 = 1/4 = 0.25
   
   提示：
   -100.0 < x < 100.0
   -231 <= n <= 231-1
   -104 <= xn <= 104
   
   var myPow = function(x, n) {
       let res = 1
       if (n < 0) {
           x = 1 / x
           n = -n
       }
       while (n) {
           if (n % 2 == 1) {
               res *= x
           }
           x *= x
           n = Math.floor(n / 2)
       }
       return res
   }
   ```

   

5. 合并区间

   ```js
   以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
   
   示例 1：
   输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
   输出：[[1,6],[8,10],[15,18]]
   解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
   
   示例 2：
   输入：intervals = [[1,4],[4,5]]
   输出：[[1,5]]
   解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。
   
   提示：
   1 <= intervals.length <= 10^4
   intervals[i].length == 2
   0 <= starti <= endi <= 10^4
   ```

   

6. 

