//->开始的时候组织IMG拖拽的默认行为:它的默认形式是会把IMG图像的缩影进行移动
var imgList = document.getElementsByTagName("img");
for (var i = 0; i < imgList.length; i++) {
    on(imgList[i], "mousemove", function (e) {
        e.preventDefault();
    });
}

/*----------拖拽------------*/
var oBox = document.getElementById("box"),
    oBox2 = document.getElementById("box2"),
    oBox3 = document.getElementById("box3"),
    winW = document.documentElement.clientWidth || document.body.clientWidth,
    winH = document.documentElement.clientHeight || document.body.clientHeight,
    boxW = oBox.offsetWidth,
    boxH = oBox.offsetHeight;

//->计算四个边界值
var minL = 0,
    minT = 0,
    maxL = winW - boxW,
    maxT = winH - boxH,
    zIndex = 1;

//->绑定方法
on(oBox, "mousedown", dragDown);
on(oBox2, "mousedown", dragDown);
on(oBox3, "mousedown", dragDown);
function dragDown(e) {
    //->this:oBox
    this["strX"] = e.clientX;
    this["strY"] = e.clientY;
    this["strT"] = this.offsetTop;
    this["strL"] = this.offsetLeft;

    //->解决焦点丢失问题都委托给document,需要解决THIS问题
    this["MOVE"] = processThis(dragMove, this);
    this["UP"] = processThis(dragUp, this);
    on(document, "mousemove", this["MOVE"]);
    on(document, "mouseup", this["UP"]);

    //->按住谁,谁在上面
    this.style.zIndex = ++zIndex;

    //->按下清除动画
    window.clearInterval(this.flyTimer);
    window.clearInterval(this.dropTimer);
}

function dragMove(e) {
    //->this:oBox
    var curL = e.clientX - this["strX"] + this["strL"],
        curT = e.clientY - this["strY"] + this["strT"];
    curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
    curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
    this.style.left = curL + "px";
    this.style.top = curT + "px";

    //->计算水平方向的速度
    if (!this["prev"]) {
        this["prev"] = this.offsetLeft;
    } else {
        this["speedFly"] = this.offsetLeft - this["prev"];
        this["prev"] = this.offsetLeft;
    }
}

function dragUp(e) {
    //->this:oBox
    off(document, "mousemove", this["MOVE"]);
    off(document, "mouseup", this["UP"]);

    //->开始动画
    fly.call(this);
    drop.call(this);
}


/*-------水平方向的运动--------*/
function fly() {
    //->this:oBox
    var _this = this,
        speedFly = _this["speedFly"];

    _this.flyTimer = window.setInterval(function () {
        //->this:window
        if (Math.abs(speedFly) < 0.5) {
            //->offsetLeft获取的都是经过四舍五入的整数,所以加减一个小于0.5的值不会对最后的结果产生任何的影响,此时我们就可以结束动画了
            window.clearInterval(_this.flyTimer);
            return;
        }
        speedFly *= 0.98;//->让速度衰减
        var curL = _this.offsetLeft + speedFly;
        if (curL > maxL) {
            speedFly *= -1;
            _this.style.left = maxL + "px";
        } else if (curL < minL) {
            speedFly *= -1;
            _this.style.left = minL + "px";
        } else {
            _this.style.left = curL + "px";
        }
    }, 17);
}

/*-------垂直方向的运动--------*/
function drop() {
    //->this:oBox
    var _this = this,
        speedDrop = 9.8,
        flag = 0;

    _this.dropTimer = window.setInterval(function () {
        if (flag > 1) {
            window.clearInterval(_this.dropTimer);
            return;
        }

        speedDrop *= 0.98;//->控制速度的衰减
        speedDrop += 10;//->控制下落速度加快和控制反弹速度变慢
        var curT = _this.offsetTop + speedDrop;
        if (curT > maxT) {
            flag++;
            speedDrop *= -1;
            _this.style.top = maxT + "px";
        } else {
            flag = 0;
            _this.style.top = curT + "px";
        }
    }, 17);
}

/*
 mousemove事件并不是移动一点就会触发一次,每个浏览器都有一个最短的反应时间(我们假设谷歌是10ms才能反应过来),在一个最短的反应时间内,我们检测出盒子的位置发生移动了才会触发一次mousemove事件 ->我们移动的快,触发的次数少 移动的慢,触发的次数多
 */