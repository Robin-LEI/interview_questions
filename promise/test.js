let Promise = require('./study')

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000);
})

promise.then(data => {
  console.log(data);
}, err => {
  console.log(err);
})
