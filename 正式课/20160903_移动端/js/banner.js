//->REM
document.documentElement.style.fontSize = document.documentElement.clientWidth / 640 * 100 + 'px';

//->页面中如果自己使用了TOUCH MOVE等原生事件,需要把浏览器默认的行为阻止掉
$(document).on('touchmove touchstart touchend', function (ev) {
    ev.preventDefault();
});

//->BANNER RENDER
var bannerRender = (function () {
    var winW = document.documentElement.clientWidth,
        maxL = 0,
        minL = 0;
    var $banner = $('.banner'),
        $wrapper = $banner.children('.wrapper'),
        $slideList = $wrapper.children('.slide'),
        $imgList = $wrapper.find('img');
    var step = 1,
        count = 0,
        followTimer = null;

    //->PUBLIC FN
    function isSwipe(strX, strY, endX, endY) {
        return Math.abs(endX - strX) > 0 || Math.abs(endY - strY) > 0;
    }

    function swipeDir(strX, strY, endX, endY) {
        return Math.abs(endX - strX) >= Math.abs(endY - strY) ? (endX - strX > 0 ? 'right' : 'left') : (endY - strY > 0 ? 'down' : 'up');
    }


    //->TOUCH START
    function dragStart(ev) {
        var point = ev.touches[0];
        $wrapper.attr({
            strL: parseFloat($wrapper.css('left')),
            strX: point.clientX,
            strY: point.clientY,
            isMove: false,
            dir: null,
            changeX: null
        });
    }

    //->TOUCH MOVE
    function dragIng(ev) {
        var point = ev.touches[0];
        var endX = point.clientX,
            endY = point.clientY,
            strX = parseFloat($wrapper.attr('strX')),
            strY = parseFloat($wrapper.attr('strY')),
            strL = parseFloat($wrapper.attr('strL')),
            changeX = endX - strX;

        //->计算出是否滑动以及滑动的方向:只有是左右滑动才进行处理
        var isMove = isSwipe(strX, strY, endX, endY),
            dir = swipeDir(strX, strY, endX, endY);
        if (isMove && /(left|right)/i.test(dir)) {
            $wrapper.attr({
                isMove: true,
                dir: dir,
                changeX: changeX
            });
            var curL = strL + changeX;
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
            $wrapper[0].style.webkitTransitionDuration = '0s';
            $wrapper.css('left', curL);
        }
    }

    //->TOUCH END
    function dragEnd(ev) {
        var isMove = $wrapper.attr('isMove'),
            dir = $wrapper.attr('dir'),
            changeX = parseFloat($wrapper.attr('changeX'));
        if (isMove && /(left|right)/i.test(dir)) {
            if (Math.abs(changeX) >= winW / 2) {
                if (dir === 'left') {
                    step++;
                } else {
                    step--;
                }
            }
            $wrapper[0].style.webkitTransitionDuration = '.2s';
            $wrapper.css('left', -step * winW);
            lazyImg();

            //->动画运动过程中,我们监听一个定时器:动画运动完成判断当前是否运动到边界,如果运动到达了边界,我们让其立马回到自己真实的位置
            window.clearTimeout(followTimer);
            followTimer = window.setTimeout(function () {
                if (step === 0 || step === count - 1) {
                    $wrapper[0].style.webkitTransitionDuration = '0s';
                    step = step === 0 ? count - 2 : 1;
                    $wrapper.css('left', -step * winW);
                    lazyImg();
                }
                window.clearTimeout(followTimer);
            }, 200);
        }
    }

    //->lazyImg:图片延迟加载,让当前的活动块及相邻的两个活动块进行加载
    function lazyImg() {
        var $cur = $slideList.eq(step),
            $tar = $cur.add($cur.prev()).add($cur.next());
        $tar.each(function (index, item) {
            //->this:item
            var $img = $(item).children('img');
            if ($img.attr('isLoad') === 'true') {
                //->ATTR存储或者获取的属性值都是一个字符串,如果当前的图片已经加载过我们就不需要重新的进行加载了
                return;
            }
            var oImg = new Image;
            oImg.src = $img.attr('data-src');
            oImg.onload = function () {
                //->this:oImg
                $img.attr({
                    src: this.src,
                    isLoad: true
                }).css('display', 'block');
                oImg = null;
            }
        });
    }

    return {
        init: function () {
            //->init css style
            count = $slideList.length;
            minL = -(count - 1) * winW;
            $wrapper.css('width', count * winW);
            $slideList.css('width', winW);

            //->lazy img
            lazyImg();

            //->swipe left or swipe right
            $banner.on('touchstart', dragStart).on('touchmove', dragIng).on('touchend', dragEnd);
        }
    }
})();
bannerRender.init();