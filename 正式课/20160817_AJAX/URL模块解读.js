var url = require("url");
var obj = url.parse("http://192.168.1.100:80/qianduan/index.html?name=zxt&age=26#zf", true);
console.log(obj);