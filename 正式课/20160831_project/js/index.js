//->计算每一个区域的高度
~function () {
    //->JQ:innerWidth/innerHeight/outerWidth/outerHeight =>JS:clientWidth/clientHeight/offsetWidth/offsetHeight
    changeHeight();
    function changeHeight() {
        var winH = $(window).innerHeight(),
            $conBody = $('.conBody'),
            $menu = $conBody.children('.menu');
        var h = winH - 64 - 20 - 20;
        $conBody.css('height', h);
        $menu.css('height', h - 2);
    }

    //->window.onresize:浏览器窗口的大小发生改变就会触发这个事件执行
    $(window).on('resize', changeHeight);
}();

//->MENU RENDER
var menuRender = (function () {
    //->准备需要绑定的数据:一般项目中是从服务器端获取的,腾讯的看比赛是写死的,我们自己来创造测试数据
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

    var $menu = $('.menu');

    function bindHTML() {
        //->把页面中模板中嵌入的HTML字符串获取到
        var menuTemplate = $('#menuTemplate').html();

        //->把在HTML中制定的模板字符串和需要绑定的数据统一交给EJS模板引擎渲染
        var result = ejs.render(menuTemplate, {menuData: ary});

        //->最后把得到的结果放入到页面的容器中
        $menu.children('ul').html(result);
    }

    return {
        init: function () {
            bindHTML();
        }
    };
})();
menuRender.init();