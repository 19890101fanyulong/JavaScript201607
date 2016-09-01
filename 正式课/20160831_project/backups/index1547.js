//->String.prototype
~function (pro) {
    //->queryURLParameter:获取URL地址中的参数值以及HASH值
    function queryURLParameter() {
        //->PARAMETER
        var obj = {},
            reg = /([^?=&#]+)=([^?=&#]+)/g;
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });

        //->HASH
        reg = /#([^?=&#]+)/;
        if (reg.test(this)) {
            obj['hash'] = reg.exec(this)[1];
        }
        return obj;
    }

    //->formatTime:按照指定的模板把时间字符串格式化
    function formatTime(template) {
        template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒'

        //->把需要解析的时间字符串中的数字分别获取到
        var ary = this.match(/\d+/g);

        //->按照规定的模板解析数据
        return template.replace(/\{(\d)\}/g, function () {
            var index = arguments[1],
                content = ary[index];
            content = content || '00';
            return content;
        });
    }

    pro.queryURLParameter = queryURLParameter;
    pro.formatTime = formatTime;
}(String.prototype);

//"2016-09-25 18:05:04" ->"09-25"   "2016-09-25 18:05:04".formatTime('{1}-{2}')
//"2016-09-25 18:05:04".formatTime('{1}-{2} {3}:{4}') "09-25 18:05"


//->计算每一个区域的高度
~function () {
    changeHeight();
    function changeHeight() {
        var winH = $(window).innerHeight(),
            $conBody = $('.conBody'),
            $menu = $conBody.children('.menu');
        var h = winH - 64 - 20 - 20;
        $conBody.css('height', h);
        $menu.css('height', h - 2);
    }

    $(window).on('resize', changeHeight);
}();


//->CALENDAR RENDER
var calendarRender = (function () {
    var $calender = $('.calender'),
        $wrapper = $calender.find('.wrapper');
    var maxL = 0, minL = 0;

    var $calendarFn = $.Callbacks();
    //$.Callbacks:创建一个计划
    //$calendarFn.add：向计划表中追加方法
    //$calendarFn.remove：从计划表中移除方法
    //$calendarFn.fire：通知计划表中的方法依次执行

    //->EJS绑定页面中的数据
    $calendarFn.add(function (today, data) {
        var templateStr = $('#calendarTemplate').html();
        var resultStr = ejs.render(templateStr, {calendarData: data});
        $wrapper.html(resultStr).css('width', data.length * 110);
    });

    //->开始定位到今天日期的位置或者今天日期相近的位置
    $calendarFn.add(function (today, data) {
        var $link = $wrapper.children('a'),
            $tar = $link.filter("[data-time='" + today + "']");
        if ($tar.length === 0) {
            //->TODAY在所有的A中不存在:找TODAY的后一个日期
            var flag = false;
            $link.each(function (index, item) {
                var itemTime = $(item).attr('data-time').replace(/-/g, ''),
                    todayTime = today.replace(/-/g, '');
                if (itemTime > todayTime) {
                    $tar = $(item);
                    flag = true;
                    return false;//->结束JQ的EACH循环
                }
            });
            if (!flag) {
                //->TODAY不存在,也没有比TODAY大的日期了:选中最后一个即可
                $tar = $link.eq($link.length - 1);
            }
        }
        var curL = -$tar.index() * 110 + 110 * 3;
        curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
        $tar.addClass('bg');
        $wrapper.css('left', curL);

        //->根据起始的日期和结束的日期获取比赛的列表信息
    });

    return {
        init: function (columnId) {
            //->GET DATA
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                type: 'get',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result.code == 0) {
                        var data = result['data'],
                            today = data['today'];
                        data = data['data'];
                        minL = -(data.length - 7) * 110;//->计算WRAPPER的最小运动LEFT的值
                        $calendarFn.fire(today, data);
                    }
                }
            });
        }
    }
})();

//->MENU RENDER
var menuRender = (function () {
    var ary = [
        {'title': 'NBA', 'HASH': 'nba', 'columnId': '100000'},
        {'title': '中超', 'HASH': 'csl', 'columnId': '208'},
        {'title': '亚冠', 'HASH': 'afc', 'columnId': '605'},
        {'title': '欧冠', 'HASH': 'ucl', 'columnId': '5'},
        {'title': '英超', 'HASH': 'pl', 'columnId': '8'},
        {'title': '西甲', 'HASH': 'laliga', 'columnId': '23'},
        {'title': '意甲', 'HASH': 'seriea', 'columnId': '21'},
        {'title': '德甲', 'HASH': 'bundesliga', 'columnId': '22'},
        {'title': '欧洲世预赛', 'HASH': 'wcp-eu', 'columnId': '336'},
        {'title': '亚洲世预赛', 'HASH': 'wcp-as', 'columnId': '341'},
        {'title': '南美世预赛', 'HASH': 'wcp-sa', 'columnId': '342'},
        {'title': '法甲', 'HASH': 'l1', 'columnId': '24'},
        {'title': 'CBA', 'HASH': 'cba', 'columnId': '100008'},
        {'title': '综合', 'HASH': 'others', 'columnId': '100002'},
        {'title': 'NFL', 'HASH': 'nfl', 'columnId': '100005'}
    ];

    var menuScroll = null,
        $menu = $('.menu'),
        $menuUL = $menu.children('ul');

    //->bindEvent:给所有的MENU绑定点击事件
    function bindEvent() {
        var $oLink = $menuUL.find('a');
        $oLink.on('click', function () {
            //$(this).addClass('bg').parent().siblings().children('a').removeClass('bg');
            var _this = this;//->当前点击的这一个A
            $oLink.each(function (index, item) {
                //->this:item
                item === _this ? $(item).addClass('bg') : $(item).removeClass('bg');
            });

            //->改变右侧区域的内容
            calendarRender.init($(_this).attr('data-id'));
        });
    }

    //->positionMenu:开始加载页面的时候让其中一个LI选中
    function positionMenu() {
        var curHASH = window.location.href.queryURLParameter()['hash'];
        curHASH = curHASH || 'nba';
        var $tar = $menuUL.find("a[href='#" + curHASH + "']");
        if ($tar.length === 0) {
            $tar = $menuUL.find('a').eq(0);
        }
        $tar.addClass('bg');

        //->ISCROLL定位到选中的位置
        menuScroll.scrollToElement($tar[0], 300);

        //->定位完成后在右侧显示对应的数据
        calendarRender.init($tar.attr('data-id'));
    }

    return {
        init: function () {
            //->EJS模板引擎绑定数据
            $menuUL.html(ejs.render($('#menuTemplate').html(), {menuData: ary}));

            //->实现局部滚动(IScroll.js)
            menuScroll = new IScroll('.menu', {
                scrollbars: true,
                bounce: false,
                mouseWheel: true
            });

            //->开始加载页面的时候让其中一个LI选中
            positionMenu();

            //->给所有的MENU绑定点击事件
            bindEvent();
        }
    };
})();
menuRender.init();











