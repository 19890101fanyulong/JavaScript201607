//sync:同步
//async:异步

var fs = require("fs");

//var con = fs.readFileSync('./qianduan/index.html', "utf-8");
//console.log(con);

//var con2 = fs.readFile('./qianduan/index.html', function (error, output) {
//    console.log(output.toString());
//});
//console.log(con2);

fs.writeFileSync('./qianduan/temp.txt', "珠峰培训", "utf-8");