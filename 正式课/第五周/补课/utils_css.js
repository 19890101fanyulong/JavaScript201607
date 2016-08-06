var utils = (function () {

    function getCss(attr) { //
        //window.getComputedStyle 标准浏览器
        //this.currentStyle ie6-8
        var val = null;
        if ('getComputedStyle' in window) { //标准
            val = window.getComputedStyle(this, null)[attr]; // 183px  '0.5'  'block'
        } else { //ie ==> 透明度 alpha(opacity=50)
            if (attr == 'opacity') {
                val = this.currentStyle['filter']; //'alpha(opacity=50.5)'
                var regFilter = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = regFilter.test(val) ? regFilter.exec(val)[1] / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        }
        //写了一个正则用来匹配类似于 -183.55px这样的val。把单位去掉 marginLeft left
        var reg = /^-?\d+(\.\d+)?(px|em|rem|pt|deg)?$/;
        if (reg.test(val)) {
            val = parseFloat(val);
        }
        return val;
    }

    function setCss(attr, val) {
        if (attr == 'opacity') {
            this.style.opacity = val;
            this.style.filter = 'alpha(opacity=' + val * 100 + ')';
            return;
        }
        if (attr == 'float') {
            this.style.cssFloat = val;
            this.style.styleFloat = val;
            return;
        }
        //setCss(box,'width',100);
        var reg = /^(width|height|top|right|bottom|left|(margin|padding)(Top|Right|Bottom|Left)?)$/; //marginLeft,paddingRight
        if (reg.test(attr)) { //你正在设置宽度高度等  100px
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        this.style[attr] = val;
    }

    function setGroupCss(options) { // {width: 100,height:200}
        for (var key in options) { //for in 可以把原型上的自己添加的公有方法遍历到
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]); //this就是你要设置的那个元素
            }
        }
    }

    function css(ele) { //  css(box,'width')  css(box,'width',100)  css(box,{width:100})
        //根据参数的类型和个数的不同可以分别调用不同的方法
        //console.log(arguments); //
        var args = Array.prototype.slice.call(arguments, 1); //[secondParam] [secondParam,thirdParam]
        if (typeof arguments[1] == 'string') { //第二个参数传的是字符串, 1 : getCss 2 setCss  区别： 第三个参数是否传
            if (typeof arguments[2] == 'undefined') {
                return getCss.apply(ele, args);
            }
            setCss.apply(ele, args);
        }
        //setGroup没处理
        arguments[1] = arguments[1] || [];
        if (arguments[1].toString() == '[object Object]') { //对象
            setGroupCss.apply(ele, args);
        }
    }

    return {
        /* getCss : getCss,
         setCss : setCss,
         setGroupCss : setGroupCss*/
        css: css
    }
})();

