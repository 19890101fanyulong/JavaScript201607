
/**
 * bind函数，负责处理在ie6-8和标准浏览器中绑定的兼容问题
 * @param ele  给ele绑定
 * @param eventType  给ele绑定这个eventType事件类型
 * @param fn  给ele的eventType事件绑定fn这个函数
 */
//bind(box,'click',fn1); //把ie和标准都处理好
//bind(box,'click',fn2); //把ie和标准都处理好
function bind(ele,eventType,fn){
    if(ele.addEventListener){
        ele.addEventListener(eventType,fn,false);
        return;
    }
    //只要代码运行到这那么就不是标准浏览器，代码运行到这里就需要处理this问题，使用attachEvent函数中的this是window，把fn中的this处理成ele,如果直接fn.call(ele)那么就已经执行了。
    var tempFn = function (){ //这个匿名函数执行的时候就能执行fn了。
        //把这个匿名函数中的this修改成任何我都无所谓，window
        fn.call(ele); //在执行这个匿名函数的过程中把fn执行，并且通过call把fn中的this修改成了ele
    }

    //我现在需要一个容器，用来记录这些经过包装之后的fn以前都是谁。这个容器永远都不能丢，只有存在ele的自定义属性身上最好。  box.mybind = [];  如果ele的这个属性存在那么就不用赋值数组了，如果不存在还需要赋值一个数组
    if(!ele['mybind'+eventType]){ //只有第一次执行才能进入
        ele['mybind'+eventType] = [];
    }
    var ary = ele['mybind'+eventType]; // 以后每次执行ary就是那个自定义属性的数组
    //添加了自定义属性，用来记录这个tempFn以前是谁,以前就是传进来的fn
    tempFn.originFn = fn;
    ary.push(tempFn);
    //吧包装过后的tmepFn也放到这个ele的自定义属性数组一份。
    // [     tempFn.originFn == fn1(fn1包装),    tempFn.originFn == fn2 (fn2包装)]
    ele.attachEvent('on'+eventType,tempFn); //把tempFn放到事件池中，系统默认
    //
}

function unbind(ele,eventType,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(eventType,fn,false);
        return;
    }
    //只要代码运行到这那么就不是标准浏览器
    //移除的时候需要在众多的tempFn中挑出来谁是原来的fn
    var ary = ele['mybind'+eventType]; //ele['mybind']中存放就是 [tempFn.originFn == fn1(fn1包装),    tempFn.originFn == fn2 (fn2包装)]
    for(var i=0; i<ary.length; i++){
        if(ary[i].originFn == fn){ //我要找到包装之前的那个tempFn
            ele.detachEvent('on'+eventType,ary[i]); //这个on需要处理下
            break; //找到了就不用循环其他的了
        }
    }
}


function bind(ele,eventType,fn){ //bind(box,click,fn1)  //bind(box,click,fn2)  //bind(box,'mouseover',fn1); //bind(box,click,fn1)  box.mybindclick = [tempFn(fn1),tempFn(fn2)]
    if(ele.addEventListener){
        ele.addEventListener(eventType,fn,false);
        return;
    }
    if(!ele['mybind'+eventType]){
        ele['mybind'+eventType] = [];
    }     //box.mybindclick = [tempFn]; //box.mybindmouseover = [tempFn];
    var a =   ele['mybind'+eventType];
    for(var i=0; i< a.length; i++){
        if(a[i].originFn == fn){
            return;
        }
    }
    var tempFn = function (){
        fn.call(ele);
    }
    tempFn.originFn = fn;

    a.push(tempFn);
    ele.attachEvent('on'+eventType,tempFn);
}


function on(ele,eventType,fn){
    if(!ele['mysort'+eventType]){
        ele['mysort'+eventType] = [];
    }
    var a = ele['mysort'+eventType];
    for(var i =0; i< a.length; i++){
        if(a[i] == fn){
            return;
        }
    }
    a.push(fn);
    bind(ele,eventType,run); //bind把run方法绑定给ele的eventType属性，当事件触发的时候真正执行的方法是run(run中才有事件对象e)，run负责循环执行自定义属性数组中的方法,并且由于bind方法已经是处理好this的了。run中的this也已经处理好了也是ele
}

function run(e){ //run才是真正绑定的函数，所以run才有事件对象e
    e = e || window.event;
    var isLowIE = !e.target; //在ie6-8中e.target不存在
    if(isLowIE){
        e.target = e.srcElement;
        e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft)+ e.clientX;
        e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
        e.preventDefault = function (){
            e.returnValue = false;
        }
        e.stopPropagation = function (){
            e.cancelBubble = true;
        }
    }
    //this == e.target ==> ele
    //先把run对应的事件属性的数组找到
    var ary = e.target['mysort'+ e.type]; //e.type就是eventType
    for(var i=0; i<ary.length; i++){ //ary[i]代表的就是每一个函数
        var curFn = ary[i];
        if(typeof  curFn == 'function'){
            curFn.call(this,e); //把run中的e事件对象还需要传给每一个函数,我这个e所有的兼容性都处理完了
            //curFn.call(e.target);

        }else{ //不是fn那么就是在off的时候的null
            //为了防止自定义属性数组中的在off的时候累计越来越多的null，就可以删除了
            ary.splice(i,1);
            i--; //循环执行数组中的函数的时候必须保证每个函数都执行到
        }
    }
}

//on(box,'click',fn1); ==> run


function off(ele,eventType,fn){
    var a = ele['mysort'+eventType];
    for(var i=0; i< a.length; i++){
        if(a[i] === fn){
            //a.splice(i,1);
            a[i] = null; //保证数组不会塌陷问题
            break;
        }
    }
}

