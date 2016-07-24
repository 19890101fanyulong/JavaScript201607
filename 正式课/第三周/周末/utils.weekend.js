var utils = {
    listToArray: function (likeArray) {
        try {
            return Array.prototype.slice.call(likeArray);
        } catch (e) {
            var ary = [];
            for (var i = 0; i < likeArray.length; i++) {
                ary.push(likeArray[i]);
            }
            return ary;
        }
    },
    jsonParse: function (jsonStr){
        return "JSON" in window ? JSON.parse(jsonStr) : eval("("+jsonStr +")");
    },
    win: function (attr, val) {
        if (typeof val !== "undefined") {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    },
    offset: function (ele) {
        var left = null;
        var top = null;
        var par = ele.offsetParent;
        left += ele.offsetLeft;
        top += ele.offsetTop;
        while (par) {
            if (window.navigator.userAgent.indexOf("MSIE 8") === -1) {
                left += par.clientLeft; //除了ie8才累加
                top += par.clientTop; //除了ie8才累加
            }
            left += par.offsetLeft;
            top += par.offsetTop;
            par = par.offsetParent; //每次累加之后需要迭代这个条件，换成par的offsetParent
        }
        return {left: left, top: top};
    },
    getCss: function (ele, attr) { //获取元素的某个经过计算过后的样式
        var val = null;
        if ('getComputedStyle' in window) {
            val = window.getComputedStyle(ele, null)[attr];
        } else { //
            if (attr == "opacity") {
                val = ele.currentStyle.filter;
                var filterReg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = filterReg.test(val) ? filterReg.exec(val)[1] / 100 : 1;
            } else {
                val = ele.currentStyle[attr];
            }
        }
        var reg = /^-?\d+(\.\d+)?(px|rem|em|pt|deg)?$/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    },
    setCss: function (ele, attr, val) { //给元素设置样式
        if (attr == "opacity") {
            ele.style.opacity = val;
            ele.stlye.filter = "alpha(opacity=" + val * 100 + ')';
            return;
        }
        if (attr == "float") {
            ele.style.cssFloat = val; //标准
            ele.style.styleFloat = val; //ie低版本
            return;
        }
        var reg = /^width|height|left|top|right|bottom|(margin|padding)(Left|Right|Top|Bottom)?$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += "px";
            }
        }
        ele.style[attr] = val;
    },
    hasClass: function (ele,strClass){ // utils.hasClass(div1,"c1");  class="c1 c2 c3"
        strClass = strClass.replace(/^ +| +$/g,"");
        var reg = new RegExp('(^| +)'+strClass+'( +|$)');
        return reg.test(ele.className);
    },
    addClass: function (ele,strClass){ //添加类   utils.addClass(div1,"c2 c3");
        var strClassAry = strClass.replace(/^ +| +$/g,"").split(/ +/);
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i];
            if(!this.hasClass(ele,curClass)){ //如果没有这个class才添加
                ele.className += ' '+curClass;
            }
        }
    },
    removeClass: function (ele,strClass){ //utils.removeClass(div1,"c2 c3"); class="c2  c3 c4"
        var strClassAry = strClass.replace(/^ +| +$/g,"").split(/ +/);
        for(var i=0; i<strClassAry.length; i++){
            var curClass = strClassAry[i];
            var reg = new RegExp('(^| +)'+strClass+'( +|$)'); //   /(^| +)c2( +|$)/
            if(this.hasClass(ele,curClass)){
                ele.className = ele.className.replace(reg,' ');
            }
        }
    },
    getElementsByClass: function (strClass, context) { //utils.getElementsByClass()
        context = context || document;
        if (context.getElementsByClassName) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        var ary = [];
        var allTags = context.getElementsByTagName('*');
        var strClassAry = strClass.replace(/^ +| +$/g, "").split(/ +/);
        for (var i = 0; i < allTags.length; i++) {
            var curTag = allTags[i];
            var flag = true;
            for (var j = 0; j < strClassAry.length; j++) {
                var curClass = strClassAry[j];
                var reg = new RegExp("(^| +)" + curClass + "( +|$)", 'g');  //<div class="c1 c3"> [c1,c2]
                if (!reg.test(curTag.className)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                ary.push(curTag);
            }
        }
        return ary;
    }
};

var newUitls = (function (){ //单例模式的小技巧
    function listToArray(){
        alert(1);
    }
    function jsonParse(){
        listToArray(); //利用作用域来查找
        this.listToArray(); //通过对象的属性值的堆内存地址查找,必须在最后的对象中return出去
    }

    function css(){

    }

    return {
        listToArray : listToArray,
        jsonParse: jsonParse
    };
})();

newUitls.listToArray();
newUitls.jsonParse();