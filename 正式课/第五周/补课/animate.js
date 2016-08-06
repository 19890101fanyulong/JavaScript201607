(function (){
    function animate(ele,target,duration,callback){ //ele就是要运动的那个元素
        //ele要在duration的时间内运动到target，这个target可以是一个多方向{width:500,opacity:0.2}
        var effect = {
           linear : function (t,b,c,d){ //匀速运动的公式
               return b + t/d*c; //一定是现在的位置，由于花费的时间改变导致运动的距离改变
           }
        };
        var begin = {};
        var change = {}; //终点-起点
        for(var key in target){ //根据终点找起点
            if(target.hasOwnProperty(key)){
                begin[key] = utils.css(ele,key);
                change[key] = target[key] - begin[key];
            }
        }
        var time = 0;
        var interval = 10;
        window.clearInterval(ele.timer); //只要执行animate方法必须先把上一次的定时器清掉
        ele.timer = window.setInterval(function (){
            //时间改变
            time += interval;
            if(time >= duration){ //花费的时间已经超过或者等于规定时间
                window.clearInterval(ele.timer);
                utils.css(ele,target); //target是一个对象
                //运动到终点让盒子变颜色
                if(typeof callback == 'function'){ //传了函数进来
                    callback.call(ele); //把传进来的函数中的this换成正在运动的这个元素
                }
                return;
            }
            for(var key in change){ //{width: 100,opacity: 0.8}
                if(change[key]){
                    var posi = effect.linear(time,begin[key],change[key],duration); //根据公式把应该运动到位置已经计算好了
                    utils.css(ele,key,posi);
                }
            }
        },interval);
    }
    window.animate = animate;
})();