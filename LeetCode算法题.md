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

   

3. 

