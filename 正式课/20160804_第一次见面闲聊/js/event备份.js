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

//var tempFn; ->使用全局存储最后一个执行BIND绑定的会把前面处理的都覆盖掉,移除的时候不管传递的是谁,都移除的是最后一个绑定的

//->bind:DOM2事件绑定 给当前元素[CUR ELE]的[TYPE]事件类型绑定一个[FN]方法
function bind(curEle, type, fn) {
    if (window.addEventListener) {
        curEle.addEventListener(type, fn, false);
        return;
    }
    //->IE6~8
    //curEle.attachEvent("on" + type, fn.myBind(curEle));//->这样处理虽然解决了THIS指向问题,但是相当于绑定一个匿名函数,移除的时候不知道移除谁

    //tempFn = fn.myBind(curEle);
    //curEle.attachEvent("on" + type, tempFn);


}

//->unbind:移除事件绑定
function unbind(curEle, type, fn) {
    if (window.removeEventListener) {
        curEle.removeEventListener(type, fn, false);
        return;
    }
    //curEle.detachEvent("on" + type, tempFn);

}