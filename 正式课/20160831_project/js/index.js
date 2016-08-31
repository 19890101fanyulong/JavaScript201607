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