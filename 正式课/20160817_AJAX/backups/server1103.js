var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (request, response) {
    //->获取客户端请求的信息并且进行解析
    var urlObj = url.parse(request.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //->根据请求的信息把指定目录下的文件(pathname)中的原代码获取到,并且返回给客户端
    //pathname='/qianduan/index.html'
    var con = fs.readFileSync('.' + pathname, "utf-8");
    //response.write(con);
    //response.end();
    response.end(con);
});
server1.listen(80, function () {
    console.log("server is success,listening on 80 port!");
});