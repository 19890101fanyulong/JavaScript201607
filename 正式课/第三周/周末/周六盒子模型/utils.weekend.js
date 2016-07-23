var utils = {
    listToArray : function (likeArray){
        try{
            return Array.prototype.slice.call(likeArray);
        }catch(e){
            var ary = [];
            for(var i=0; i<likeArray.length; i++){
                ary.push(likeArray[i]);
            }
            return ary;
        }
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
    }
};