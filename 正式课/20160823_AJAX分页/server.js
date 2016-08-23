var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server1 = http.createServer(function (request, response) {
    var urlObj = url.parse(request.url, true),
        pathname = urlObj['pathname'],
        query = urlObj['query'];

    //->静态资源文件的请求处理
    var reg = /\.(HTML|CSS|JS|ICO)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = suffix === 'HTML' ? 'text/html' : (suffix === 'CSS' ? 'text/css' : 'text/javascript');
        try {
            var conFile = fs.readFileSync('.' + pathname, 'utf-8');
            response.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            response.end(conFile);
        } catch (e) {
            response.writeHead(404);
            response.end();
        }
        return;
    }

    //->API数据请求接口的处理
    var data = fs.readFileSync('./json/data.json', 'utf-8');
    data = JSON.parse(data);

    if (pathname === '/getList') {
        var n = query['n'] || 1;//->客户端没有传递n的值默认展示第一页的数据
        var result = {
            code: 0,
            msg: 'success',
            total: Math.ceil(data.length / 10),
            data: []
        };
        for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
            if (i > data.length - 1) {
                //->最后一页不一定是10条数据
                break;
            }
            result.data.push(data[i]);
        }
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
        return;
    }

    if (pathname === '/getInfo') {
        var id = query['id'];
        result = {
            code: 1,
            msg: 'error',
            data: null
        };
        data.forEach(function (item, index) {
            if (id == item['id']) {
                result = {
                    code: 0,
                    msg: 'success',
                    data: item
                };
            }
        });
        response.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        response.end(JSON.stringify(result));
        return;
    }

    response.writeHead(404);
    response.end();
});
server1.listen(80, function () {
    console.log('server is success,listening on 80 port!');
});