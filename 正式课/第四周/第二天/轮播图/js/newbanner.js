//获取元素
var banner = document.getElementById('banner');
var bannerInner = utils.getElementsByClass('bannerInner',banner)[0];
var imgs = bannerInner.getElementsByTagName('img');
var focusListUl = banner.getElementsByTagName('ul')[0];
var focusLis = focusListUl.getElementsByTagName('li');
var left = utils.getElementsByClass('left',banner)[0];
var right = utils.getElementsByClass('right',banner)[0];
//获取数据
(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)){
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();

//绑定数据
(function bindData(){
    if(window.data){
        var str = ''; //
        var liStr = '';
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            str += '<div><img src="" trueSrc="'+ curData.src +'"/></div>';
            liStr += i === 0 ? '<li class="bg"></li>' : '<li></li>';
        }
        str += '<div><img src="" trueSrc="'+ data[0].src +'"/></div>';
        bannerInner.innerHTML = str;
        utils.css(bannerInner,'width',(data.length+1)*1000);
        focusListUl.innerHTML = liStr;
    }
})();

//图片延迟加载
function imagesDelayLoad(){
    for(var i=0; i<imgs.length; i++){
        (function (i){
            var curImg = imgs[i];
            if(curImg.isloaded) return;
            var tempImg =  document.createElement('img');
            tempImg.src = curImg.getAttribute('trueSrc');
            tempImg.onload = function (){
                curImg.src = this.src;
                curImg.style.display = 'block';
                animate(curImg,{opacity:1},300);
            }
            tempImg = null;
            curImg.isloaded = true;
        })(i);
    }
}
window.setTimeout(imagesDelayLoad,500);
//自动轮播
var step = 0;
var timer = null;
function autoMove(){
    if(step == data.length){ //4
        step = 0;
        utils.css(bannerInner,'left',0);
    }
    step++;
    console.log(step);

    animate(bannerInner,{left: -step*1000},300);
    focusAlign();
}
timer = window.setInterval(autoMove,2000);

function focusAlign(){
    var tempStep = step == data.length ? 0 : step;
    for(var i=0; i<focusLis.length; i++){
        focusLis[i].className = i === tempStep ? 'bg' : "";
    }
}

function bindEventForLis(){
    for(var i=0; i<focusLis.length; i++){
        focusLis[i].onclick = function (){
            if(step == data.length){ //4
                step = 0;
                utils.css(bannerInner,'left',0);
            }
            step = this.index;
            console.log(step);
            animate(bannerInner,{left: -step*1000},300);
            focusAlign();
        }
        focusLis[i].index = i;
    }
}
bindEventForLis();

banner.onmouseover = function (){
    left.style.display = right.style.display = 'block';
    window.clearInterval(timer);
}
banner.onmouseout = function (){
    left.style.display =  right.style.display = 'none';
    timer = window.setInterval(autoMove,2000);
}

left.onclick = function (){
    if(step == 0){
        step = data.length;
        utils.css(bannerInner,"left",-step*1000);
    }
    step--;
    animate(bannerInner,{left: -step*1000},300);
    focusAlign();
}
right.onclick = autoMove;


