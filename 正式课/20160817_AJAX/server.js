var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //->用来处理静态资源文件请求的前端路由
    //->根据请求资源文件的后缀名,我们获取到当前资源文件对应的MIME类型
    var reg = /\.(HTML|CSS|JS|ICO|TXT|JSON)/i;
    //->条件成立说明我们当前向服务器请求的是资源文件(HTML/CSS/JS/IMG...)
    if (reg.test(pathname)) {
        //->获取请求资源文件的后缀名
        var suffix = reg.exec(pathname)[1].toUpperCase();

        //->根据后缀名获取到对应的MIME类型
        var suffixMIME = 'text/plain';
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
        }

        //->根据请求的资源文件的不同,把对应文件中的内容获取到,并且返回给客户端,在返回之前告诉客户端我们返回内容的MIME类型
        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf-8');
            response.writeHead(200, {
                'content-type': suffixMIME + ';charset=utf-8;',
                'test': 'zhufeng'//->服务器端可以通过自定义响应首部把部分内容返回给客户端,客户端可以在xhr.readyState >= 2的时候就可以通过xhr.getResponseHeader("test")获取到返回的内容
            });
            response.end(conFile);//->此处是服务器端把返回的内容放在响应主体中返回给客户端的,客户端通过xhr.responseText来接收信息,但是必须等到xhr.readyState == 4的时候才可以
        } catch (e) {
            response.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            response.end('request file is not found!');
        }
    }
});
server1.listen(80, function () {
    console.log("server is success,listening on 80 port!");
});