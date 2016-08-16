var zhufeng = require("./b");

var total = zhufeng.sum(1, 2, 3, 4);
console.log(total);


/*
在项目中定义三个模块
test1  sum ->任意数求和

test2  avg ->可以给avg传递任意的数字，然后求出平均数：首先需要在test2中调取test1中的sum方法, 例如传递进来12,23,34,45,56，首先调取sum求和,把求和的结果除以五，从而获取平均数

test3 在这里面调取test2中的avg方法实现八个评委打分计算平均分的效果*/