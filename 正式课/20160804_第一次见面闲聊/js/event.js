//->在Function.prototype上扩展方法实现BIND的兼容处理
~function (pro) {
    pro.myBind = myBind;
    function myBind(context) {
        var _this = this;
        var outerArg = [].slice.call(arguments, 1);
        if ("bind" in Function.prototype) {
            outerArg.unshift(context);
            return _this.bind.apply(_this, outerArg);
        }
        return function () {
            var innerArg = [].slice.call(arguments);
            _this.apply(context, outerArg.concat(innerArg));
        }
    }
}(Function.prototype);


function bind(curEle, type, fn) {
    if (window.addEventListener) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var tempFn = fn.myBind(curEle);
    tempFn.photo = fn;
    !curEle["bind" + type] ? curEle["bind" + type] = [] : null;
    var ary = curEle["bind" + type];
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].photo === fn) {
            return;
        }
    }
    ary.push(tempFn);
    curEle.attachEvent("on" + type, tempFn);
}

function unbind(curEle, type, fn) {
    if (window.removeEventListener) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    var ary = curEle["bind" + type];
    if (ary) {
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (tempFn.photo === fn) {
                curEle.detachEvent("on" + type, tempFn);
                ary.splice(i, 1);
                return;
            }
        }
    }
}