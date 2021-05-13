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

2. 