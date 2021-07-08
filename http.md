# curl

1. curl www.baidu.com

2. curl -v www.baidu.com



# cors解决跨域

1. 设置 Access-Control-Allow-Origin: *，设置成\*不安全，可以设置成一个特定的域名
2. 客户端利用jsonp，如script、img、link的src、href
3. 各种头
   - Access-Control-Allow-Headers
   - Access-Control-Allow-Methods
   - Access-Control-Max-Age: 1000 // 1s内不用在进行预请求

# content-type

1. 设置成text/plain 纯文本，浏览器就不去解析了，直接显示在页面上

2. 设置成text/html，浏览器会去解析



http协议使用 换行符 \n 切