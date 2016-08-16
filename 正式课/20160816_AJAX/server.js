var http = require("http"),//->创建服务或者管理服务
    url = require("url"),
    fs = require("fs");

//->http.createServer:创建一个服务
//里面的回调函数并不是创建服务成功执行,而是有客户端向这个服务发送请求才会执行的
var server1 = http.createServer(function () {
    console.log(1);
});
server1.listen(80, function () {
    //->server1.listen:为当前的服务监听一个端口(80)
    //当端口监听成功后会触发回调函数执行
    console.log("server is success，listening on 80 port!");
});