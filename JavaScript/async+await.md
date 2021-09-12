async函数是generator函数的语法糖，async函数就是把generator函数的 * 号替换成 async，yield被替换成await。

await后面紧跟的可以是promise对象，也可以是普通值，如果是普通值，这个时候就等于同步操作。



执行async函数的时候，如果遇到await，会立即返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。



await命令后面的promise对象，运行结果可能是rejected，所以最后把await放到try...catch代码块中。



await会将resolve的结果返回出来。

```js
async function asyncFn() {
  return 'hello async'
}
// async函数里面return了一个值，不管是啥类型的，最终async函数的实际结果都是
// Promise.resolve(a)
console.log(asyncFn());
```





```js
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('asnyc1 end');
}
async function async2() {
	console.log('async2');
}
console.log('script start');
setTimeout(() => {
	console.log('setTimeOut');
}, 0);
async1();
new Promise(function (reslove) {
	console.log('promise1');
	reslove();
}).then(function () {
	console.log('promise2');
})
console.log('script end');

// https://juejin.cn/post/6968815596393725983
// script start\async1 start \async2 \promise1 \script end \asnyc1 end \promise2 \setTimeOut
```



```js
setTimeout(() => {
  console.log(1);
}, 0);

async function timeout() {
  console.log(7);

  setTimeout(() => {
    console.log(5);
  }, 0);

  const a = await new Promise((res, rej) => {
    console.log(8);

    setTimeout(() => {
      console.log(2);
      res(3);
    }, 0);
  });

  console.log(9);

  setTimeout(() => {
    console.log(6);
  }, 0);

  console.log(a);
}

timeout();

console.log(4);

// 7 8 4 1 5 2 9 3 6
```



```js
setTimeout(() => {
  console.log(1);
}, 0);

async function timeout() {

  setTimeout(() => {
    console.log(5);
  }, 0);

  const a = await new Promise((res, rej) => {
    setTimeout(() => {
      console.log(2);
      res(3);
    }, 0);
  });


  setTimeout(() => {
    console.log(6);
  }, 0);

  console.log(a);
}

timeout();

console.log(4);


// 4 1 5 2 3 6
```

