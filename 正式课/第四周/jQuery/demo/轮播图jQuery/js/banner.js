(function ($){
    function banner(url,interval){
        var $banner = $(this);
        var $bannerInner = $banner.find('.bannerInner');
        var $focusList = $banner.find('.focusList');
        var $left = $banner.find('.left');
        var $right = $banner.find('.right');
//集合
        var $imgs = null;
        var $divs = null;
        var $lis = null;

        var res = null;
//获取数据
        (function getData() {
            $.ajax({
                url: url + '?_=' + Math.random,
                type: 'get',
                dataType: 'json',
                async: false,
                success: function (data) {
                    res = data;
                }
            });
        })();
        console.log(res);

//绑定数据
        (function bindData() {
            var str = '';
            var strLi = '';
            $.each(res, function (index, item) {
                //index是索引   item数据res中的每一项
                //<div><img src="images/banner1.jpg" /></div>
                str += '<div><img src="" trueSrc="' + item.src + '" /></div>';
                strLi += index == 0 ? '<li class="bg"></li>' : '<li></li>'; //默认第一个有bg这个样式
            });
            //把拼接好的字符串添加到原有结构
            $bannerInner.html(str);
            $focusList.html(strLi);

            //由于jQ文档结构改变需要重新获取，原生通过dom的方式获取是有映射关系的
            $imgs = $bannerInner.find("img");
            $divs = $bannerInner.children('div');
            $lis = $focusList.children('li');
        })();
        /*
         *   通过jQuery获取的元素每次文档结构改变的时候都需要重新获取
         * */
//console.log($imgs);

//图片延迟加载
        function imgsDelay() {
            $.each($imgs, function (index, item) { // 循环所有的图片
                //index每一张真实图片的索引，item是每一张真实的图片
                var tempImg = new Image();
                $(tempImg).prop('src', $(item).attr('trueSrc')); // tempImg.src = img.getAttribute('trueSrc')
                $(tempImg).on('load', function () {
                    //图片加载成功的时候
                    //item.src = this.src;
                    $(item).prop('src', $(this).prop('src')).css('display', 'block');
                });
            });
            //默认让第一张的zIndex设置为1，透明度从0运动到1
            $divs.eq(0).css('zIndex', 1).stop().animate({opacity: 1}, 300);
        }
        window.setTimeout(imgsDelay, 500);

//自动轮播
        var timer = null;
        interval = interval || 2000;
        var step = 0; //当前第几张图片显示，step和索引值是相同的
        timer = window.setInterval(autoMove, interval);
        function autoMove() {
            //当运动到第四张的索引是3，下一次应该运动到索引为0的那一张
            if (step == res.length - 1) {
                step = -1;
            }
            step++; //每次执行时候step都会自动增加1
            //step = 0   ==>  step = 1
            //让step为1这一张出现 ==> 把step增加后的值对应的索引图片的zIndex的值赋值1，并且把其他的zIdex的值赋值为0.
            //立刻让step这张图片的透明度从0运动1，到达1之后把其他的图片的透明度设置成0
            //自动轮播和点击和左右都是相同的操作。。。封装成一个函数
            setBanner();
        }

        function setBanner() {
            $.each($imgs, function (index, item) { //$divs是包含img的那个盒子
                //index 每一张图片的索引，item是每一张图片 ==> 这个item也可以使用this
                if (index == step) { //这是即将要显示的那一张
                    $(item).parent().css('zIndex', 1).stop().animate({opacity: 1}, 300, 'linear', function () {
                        //当前要显示的这一张的透明度从0运动到1，并且把其他张透明度都设置成0
                        $(item).parent().siblings().css('opacity', 0);
                    })
                } else { //都是应该不层级zIndex放到0
                    $(item).parent().css('zIndex', 0);
                }
                //焦点对齐
                index == step && $lis.eq(index).addClass('bg').siblings().removeClass('bg');
            });
        }

        $banner.off('mouseover').on('mouseover', function () {
            $left.css('display', 'block');
            $right.css('display', 'block');
            window.clearInterval(timer);
        }).off('mouseout').on('mouseout', function () {
            $left.css('display', 'none');
            $right.css('display', 'none');
            timer = window.setInterval(autoMove, interval);
        });

        (function bindEvent() {
            $.each($lis, function (index, item) {
                $(this).on('click', function () {
                    step = $(this).index(); //点击的按个li的索引值赋值给step
                    setBanner(); //setBannner就是根据step的变化运动到step的值变化之后的位置
                });
            });
        })();

        $left.on('click',function (){
            if(step == 0){
                step = res.length;
            }
            step--;
            setBanner();
        });

        $right.on('click',autoMove);

    }

    $.extend({
        banner : banner
    });

    $.fn.extend({
        banner : banner
    })
//获取要操作到的元素

//banner($('#banner1'),'data.txt');


})(jQuery);








