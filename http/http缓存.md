**缓存的作用范围**

属于浏览器端的缓存，上一次http请求和下一次http请求之间。http缓存可以提高并发效率。



**http缓存分类**

强缓存、协商缓存

强缓存根据这两个字段判断是否命中： expires（存在安全隐患，本地时间是可以修改的）、cache control（优先级高，相对时间），响应头中包含这两个字段

cache-control：max-age=xx

status code： 200 （from memory cache）



为什么有了expires还需要cache control？

因为expires存在服务器时间和客户端时间不同步的问题，expires是绝对时间，cache control是相对时间，更加准确。

 

为什么需要强缓存？

服务器的配置是有限的，设置了强缓存，就可以允许更多的人并发访问。



304 协商缓存。

需要发请求到服务器。

服务器根据http头信息中的Last-Modify/If-Modify-Since或Etag/If-None-Match来判断是否命中协商缓存。命中，返回304，浏览器从缓存加载资源。

浏览器第一次加载资源的时候，服务器会在响应头加last-modify字段，表示资源的最后修改时间，当浏览器再次请求该资源的时候，在请求头中携带if-modify-match字段，该值为之前返回的last-modify。服务器拿到这个值之后，判断是否可以用缓存的资源。



etag/if-none-match

etag可以保证每一个资源是唯一的，是资源的唯一标识。资源的变化会导致etag的改变。



有了last-modify为什么还需要etag？

last-modify的修改只能精确到秒，如果某些文件在1s内，被多次修改，可能会存在误差，不能准确标志文件被修改的精确时间。



etag的优先级高于last-modify。



协商缓存，协商什么？

浏览器问服务器我缓存的文件有没有更新。如果有更新，服务器返回最新资源，返回200，如果没有更新，浏览器可以用缓存，返回304。