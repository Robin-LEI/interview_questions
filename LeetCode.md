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
   
   // ===========================
   /**
    * @param {string} num1
    * @param {string} num2
    * @return {string}
    */
    var multiply = function(num1, num2) {
       if (!num1 || !num2) return;
       if (!num1.length || !num2.length) return;
       if (!num1.trim().length || !num2.trim().length) return;
       if ([...new Set(num1)][0] === '0' || [...new Set(num2)][0] === '0') return '0';
   
       // 定义一个存储结果的数组
       // index1 表示个位
       // index2 表示十位
       let ans = [], index1, index2;
   
       for (let i = num1.length - 1; i >= 0; i--) {
           for (let j = num2.length - 1; j >= 0; j--) {
               index1 = i + j;
               index2 = i + j + 1;
               let mul = num1[i] * num2[j] + (ans[index2] || 0);
               ans[index2] = mul % 10;
               ans[index1] = (ans[index1] || 0) + parseInt(mul / 10);
           }
       }
   
       return ans.join('').replace(/^0+/, '')
    }
   
   ```

   ![](https://segmentfault.com/img/bVbfc14?w=969&h=789)

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
   
   /**
    * @param {number[][]} intervals
    * @return {number[][]}
    */
   var merge = function(intervals) {
       // 先排序，按照每一项的左边元素的大小从小到大排序
       order(intervals)
       console.log(intervals)
       // 循环遍历排好序的数组，下一项节点的左边元素比上一项节点的右边元素值大，则没有重合，把当前项存在结果数组中
       // 如果当前项的左边的值小于等于前一项右边的值，则有重合，此时比较当前项右边的值和前一项右边的值，把大的作为区间的右边元素值
       return compare(intervals)
   
       function compare(arr) {
           // 第一项作为初始值
           let merged = [arr[0]]
           for (let i = 1; i < arr.length; i++) {
               console.time('calculate')
               calculate(merged[merged.length - 1], arr[i], merged)
               console.timeEnd('calculate')
           }
           return merged
       }
   
       function calculate(prev, next, merged) {
           if (next[0] > prev[1]) { // 没有重合
               merged.push(next)
           } else { // 存在重合
               if (next[1] >= prev[1]) {
                   prev[1] = next[1]
               }
           }
       }
   
       function order(arr) {
           /**
           这里的排序使用的是冒泡排序
           冒泡排序的性能不高，时间复杂度 O(n^2)
           优化前：228ms-256ms
            */
           // 数组本身的sort排序
           intervals = arr.sort((a, b) => a[0] - b[0])
           
           // 插入排序
           // let handle = [arr[0]]
           // for (let i = 1; i < arr.length; i++) {
           //     let A = arr[i]
           //     for (let j = handle.length - 1; j >= 0; j--) {
           //         let B = handle[j]
           //         if (A[0] > B[0]) {
           //             handle.splice(j + 1,0,A)
           //             break
           //         }
           //         if (j === 0) {
           //             handle.unshift(A)
           //         }
           //     }
           // }
   
           // intervals = handle
           // return handle
   		
        	// 冒泡排序1
           // for (let i = 0; i < arr.length - 1; i++) {
           //     for (let j = 0; j < arr.length - 1 - i; j++) {
           //         if (arr[j][0] > arr[j + 1][0]) {
           //             const temp = arr[j]
           //             arr[j] = arr[j + 1]
           //             arr[j + 1] = temp
           //         }
           //     }
           // }
           
   		// 冒泡排序2
           // for (let i = 0; i < arr.length; i++) {
           //     for (let j = 0; j < arr.length - i - 1; j++) {
           //         if (arr[j][0] > arr[j + 1][0]) {
           //             const temp = arr[j]
           //             arr[j] = arr[j + 1]
           //             arr[j + 1] = temp
           //         }
           //     }
           // }
       }
   };
   ```

   

6. 加一

   ```js
   给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。
   最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。
   你可以假设除了整数 0 之外，这个整数不会以零开头.
   
   示例 1：
   输入：digits = [1,2,3]
   输出：[1,2,4]
   解释：输入数组表示数字 123。
   
   示例 2：
   输入：digits = [4,3,2,1]
   输出：[4,3,2,2]
   解释：输入数组表示数字 4321。
   
   示例 3：
   输入：digits = [0]
   输出：[1]
   
   示例 4：
   输入：digits = [1,2,9]
   输出：[1,3,0]
   
   提示：
   1 <= digits.length <= 100
   0 <= digits[i] <= 9
   
   var plusOne = function(digits) {
       for (let i = digits.length - 1; i>= 0; i--) {
           digits[i]++
           digits[i] %= 10
           if (digits[i] != 0)
               return digits;
       }
       // 针对处理 [9] 这种情况
       digits.unshift(1)
       return digits
   }
   ```

   

7. 最后一个单词的长度

   ```js
   给你一个字符串 s，由若干单词组成，单词之间用空格隔开。返回字符串中最后一个单词的长度。如果不存在最后一个单词，请返回 0 。
   单词 是指仅由字母组成、不包含任何空格字符的最大子字符串。
   
   示例 1：
   输入：s = "Hello World"
   输出：5
   
   示例 2：
   输入：s = " "
   输出：0
   
   提示：
   1 <= s.length <= 104
   s 仅有英文字母和空格 ' ' 组成
   
   /**
    * @param {string} s
    * @return {number}
    */
   var lengthOfLastWord = function(s) {
       s = s.replace(/(^\s*)|(\s*$)/g, '') // 把字符串首尾空格全部去除
       let reg = /^[a-zA-Z]+(\s*[a-zA-Z]+)*$/g // 判断去除首尾空格后的字符串是否是“单词”
       if (!reg.test(s)) return 0 // 如果不是“单词”，返回0
       reg = /[a-zA-Z]+$/g // 匹配最后一个单词
       let res = s.match(reg) 
       return res[res.length - 1].length
   };
   ```

   

8. 全排列

   ```js
   给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。
   
   示例 1：
   输入：nums = [1,2,3]
   输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
   
   示例 2：
   输入：nums = [0,1]
   输出：[[0,1],[1,0]]
   
   示例 3：
   输入：nums = [1]
   输出：[[1]]
   
   提示：
   1 <= nums.length <= 6
   -10 <= nums[i] <= 10
   nums 中的所有整数 互不相同
   
   /**
    * @param {number[]} nums
    * @return {number[][]}
    */
   var permute = (nums) => {
     const res = []; // 存储结果
     const used = {};
   
     function dfs(path, curr) {
       if (path.length == nums.length) { // 个数选够了
         res.push(path.slice()); // 拷贝一份path，加入解集res
         return;                 // 结束当前递归分支
       }
       for (const num of nums) { // for枚举出每个可选的选项
         // if (path.includes(num)) continue; // 别这么写！查找的时间是O(n)，增加时间复杂度
         if (used[num]) continue; // 使用过的，跳过
         path.push(num);         // 选择当前的数，加入path
         used[num] = true;       // 记录一下 使用了
         dfs(path);              // 基于选了当前的数，递归
         path.pop();             // 上一句的递归结束，回溯，将最后选的数pop出来
         used[num] = false;      // 撤销这个记录
       }
     }
   
     dfs([], []); // 递归的入口，空path传进去
     return res;
   };
   ```

   

9. 有效的数独

   ```js
   请你判断一个 9x9 的数独是否有效。只需要 根据以下规则 ，验证已经填入的数字是否有效即可。
   
   1. 数字 1-9 在每一行只能出现一次。
   2. 数字 1-9 在每一列只能出现一次。
   3. 数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）
   
   数独部分空格内已填入了数字，空白格用 '.' 表示。
   
   注意：
   一个有效的数独（部分已被填充）不一定是可解的。
   只需要根据以上规则，验证已经填入的数字是否有效即可。
   
   提示：
   board.length == 9
   board[i].length == 9
   board[i][j] 是一位数字或者 '.'
   ```

   ![数独](https://i0.hdslb.com/bfs/album/e6a3e158c01148e8673f84a43979cfda070ca025.png)

   ![](https://i0.hdslb.com/bfs/album/58534aba52df0e951fd6ec34d283ecacc083491d.png)

   ![](https://i0.hdslb.com/bfs/album/c4e18eb2b5fc9572fafa74e21c724fcbdb792044.png)

   >  解释：除了第一行的第一个数字从 5 改为 8 以外，空格内其他数字均与 示例1 相同。 但由于位于左上角的 3x3 宫内有两个 8 存在, 因此这个数独是无效的。

   

10. 用栈实现队列

11. 用队列实现栈

12. 给定两个整数n和k，返回1...n中所有可能的k个数的组合

    ```js
    /* 
    输入：n = 4,k = 2;
    输出：
    [
      [2,4],
      [3,4],
      [2,3],
      [1,2],
      [1,3],
      [1,4],
    ]
     */
    ```

    

13. 给你一个包含n个整数的数组nums，判断nums中是否存在三个元素a、b、c，使得a+b+c=0？请你找出所有满足条件且不重复的三元组

    ```js
    // 示例
    给定数组 nums = [-1, 0, 1, 2, -1, -4]， 满足要求的三元组集合为： [ [-1, 0, 1], [-1, -1, 2] ]
    ```

    

14. 数字序列中的某一位数字

    ```js
    
    ```

    

15. 字符串相加

    > 给定两个字符串形式的非负整数 `num1` 和`num2` ，计算它们的和。
    >
    > 1. num1 和num2 的长度都小于 5100
    > 2. num1 和num2 都只包含数字 0-9
    > 3. num1 和num2 都不包含任何前导零
    > 4. 你不能使用任何內建 BigInteger 库， 也不能直接将输入的字符串转换为整数形式
    
    ```js
    /**
     * @param {string} num1
     * @param {string} num2
     * @return {string}
     */
    var addStrings = function(num1, num2) {
    
        let ans = [], len = Math.max(num1.length, num2.length);
        num1 = num1.padStart(len, 0);
        num2 = num2.padStart(len, 0);
    
        for (let i = len - 1; i >= 0; i--) {
            let sum = Number(num1[i] || 0) + Number(num2[i] || 0) + (ans[i] || 0);
            ans[i] = sum % 10;
            if ((i - 1) < 0) {
                ans.unshift(parseInt(sum / 10));
            } else {
                ans[i - 1] = parseInt(sum / 10);
            }
        }
    
        const tempRes = ans.join('').replace(/^0+/, '');
        return !tempRes ? '0' : tempRes;
    };
    ```
    
    

