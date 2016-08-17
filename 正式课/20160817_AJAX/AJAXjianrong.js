//->惰性思想之函数重新覆盖
function createXHR() {
    var xhr = null, flag = 0;
    //->我们把创建AJAX对象的四种方式存放在四个不同的小方法中,然后循环数据分别执行每一个小方法,如果遇到一个执行没有报错,说明当前这个小方法是兼容这个浏览器的,此时我们把createXHR重写,让其等于这个小方法,以后在执行createXHR都是在执行这个兼容的小方法了
    var ary = [
        function () {
            return new XMLHttpRequest;
        },
        function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }
    ];
    for (var i = 0, len = ary.length; i < len; i++) {
        var tempFn = ary[i];
        try {
            xhr = tempFn();//->如果执行不报错说明当前这个方法兼容,结束循环,并且重新的把createXHR进行赋值
            createXHR = tempFn;
            flag++;
            break;
        } catch (e) {

        }
    }
    if (flag === 0) {//->执行完成四个小方法后一个兼容的都没有
        throw new Error("your browser is not support ajax!");
    }
    return xhr;
}

console.log(createXHR);
var xhr = createXHR();
console.log(xhr);

console.log(createXHR);
xhr = createXHR();
console.log(xhr);