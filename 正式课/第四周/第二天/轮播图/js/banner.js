/**
 * Created by lucky on 2016/7/27.
 */
//获取元素
var banner = document.getElementById('banner');
var bannerInner = utils.getElementsByClass('bannerInner',banner)[0];
var imgs = bannerInner.getElementsByTagName('img');
var focusList = utils.getElementsByClass('focusList',banner)[0];
var focusLis = focusList.getElementsByTagName('li');
console.log(focusLis);
var left = utils.getElementsByClass('left',banner)[0];
var right = utils.getElementsByClass('right',banner)[0];

//获取数据
;(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',"data.txt?_="+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
            window.data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);

//绑定数据
;(function bindData(){
    if(window.data){
        var str = '';
        var lisHtml = "";
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            str += '<div><img src="" trueSrc="' + curData.src + '"/></div>';
            lisHtml += i===0 ? '<li class="bg"></li>' :'<li></li>';//默认第一个焦点是有选中样式的
        }
        str += '<div><img src="" trueSrc="' + data[0].src + '"/></div>'; //把第一张最佳到末尾一张
        bannerInner.innerHTML = str;
        utils.setCss(bannerInner,"width",1000*(data.length+1)); //由于多添加了一张图片导致宽度不够需要动态设置宽度
        focusList.innerHTML = lisHtml;
    }
})();

//给图片做延迟加载
function imgsDelayLoad(){
    //给每一张图片都要做延迟加载
    for(var i=0; i<imgs.length; i++){
        /*(function (i){*/
            var curImg = imgs[i];
            if(curImg.isloaded) return;
            //使用自定义属性的方式:  1 自定义属性一般添加在绑定事件的元素身上  2 事件触发的时候利用this获取到自定义属性
            var tempImg = new Image();
            tempImg.index = i; // 给临时的图片添加一个自定义属性用来保存索引值
            tempImg.src = curImg.getAttribute('trueSrc');

            tempImg.onload = function (){
                imgs[this.index].src = this.src; //利用自定义属性找到当前的图片
                utils.setCss(imgs[this.index],"display","block");
                //淡入的方式
                animate(imgs[this.index],{opacity:1},300);
            }
            curImg.isloaded = true;
            tempImg = null;
        /*})(i);*/
    }
}
window.setTimeout(imgsDelayLoad,1000);

//自动轮播
var step = 0; //用来记录当前是第几章图片
var timer = null;

function autoMove(){ //负责播放一张图片
    if(step == data.length){ //已经运动到了最后一张，最后一张和第一张是完全一样的。下一次的终点是第二张
        step = 0;
        utils.setCss(bannerInner,"left", -step*1000);
    }
    step++; //
    animate(bannerInner,{left: -step*1000},300);
    focusAlign();
}
timer = window.setInterval(autoMove,2000);

function focusAlign(){ //每次轮播一张图片的时候都会执行一次。
    var tempStep = step === data.length ? 0 : step;
    for(var i=0; i<focusLis.length; i++){ //i =  0 , 1 ,2 ,3
        //i最大可以等于3，但是step可以最大可以是4，step的值为4的时候，其实是第五张图片显示，第五张图片和第一张是相同。从视觉上是第一张
       /* var tempStep;
        if(step == data.length){
            tempStep = 0;
        }else{
            tempStep = step; //0 1 2 3 4
        }*/
        focusLis[i].className = i == tempStep ? "bg" : "";
    }
}

//鼠标悬停的时候停止播放,鼠标离开的时候继续播放
banner.onmouseover = function (){
    //左右按钮才出现
    utils.setCss(left,"display","block");
    utils.setCss(right,"display","block");
    window.clearInterval(timer); //鼠标悬停把定时器清除
}
banner.onmouseout = function (){
    left.style.display = right.style.display = 'none'; //鼠标离开的时候把左右按钮消失
    timer = window.setInterval(autoMove,2000); //鼠标离开的时候启动定时器
}

//点击焦点实现图片切换
function bindEventForFocus(){
    for(var i=0; i<focusLis.length; i++){
        focusLis[i].index = i;
        focusLis[i].onclick = function (){ //给每一个焦点绑定点击事件
            step = this.index; //为了保证点击之后下一次自动轮播从当前点击的这一个焦点开始
            animate(bannerInner,{left: -step*1000},300);
            focusAlign();
        }
    }
}
bindEventForFocus();
//给左右按钮绑定事件
left.onclick = function (){
    /*if(step == data.length){
        step = 0;
    }*/
    if(step == 0){
        step = data.length;
        utils.setCss(bannerInner,"left",-step*1000);
    }
    step--; //
    animate(bannerInner,{left: -step*1000},300);
    focusAlign();
}
right.onclick = autoMove; //点击向右的时候就是自动轮播







