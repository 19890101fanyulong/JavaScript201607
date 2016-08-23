var pageRender = (function () {
    var n = 1,
        total = 0;

    var box = document.getElementById('box'),
        content = document.getElementById('content'),
        numBox = document.getElementById('numBox'),
        pageNum = document.getElementById('pageNum');

    //->SEND AJAX
    function getData() {
        ajax({
            url: '/getList?n=' + n,
            success: function (jsonData) {
                if (jsonData && jsonData['code'] == 0) {
                    total = parseFloat(jsonData['total']);
                    bindHTML(jsonData['data']);
                }
            }
        });
    }

    //->BIND HTML
    function bindHTML(data) {
        //->CONTENT
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var cur = data[i];
            str += '<li stuId="' + cur['id'] + '">';
            str += '<span>' + cur['id'] + '</span>';
            str += '<span>' + cur['name'] + '</span>';
            str += '<span>' + (cur['sex'] == 1 ? '女' : '男') + '</span>';
            str += '<span>' + cur['score'] + '</span>';
            str += '</li>';
        }
        content.innerHTML = str;

        //->PAGE
        str = '';
        for (var j = 1; j <= total; j++) {
            str += '<li class="' + (j === n ? 'bg' : '') + '">' + j + '</li>';
        }
        numBox.innerHTML = str;

        //->INPUT
        pageNum.value = n;
    }

    return {
        init: function () {
            //->加载页面绑定第一页的数据
            getData();

            //->事件委托处理点击
            box.onclick = function (ev) {
                ev = ev || window.event;
                var tar = ev.target || ev.srcElement,
                    tarTag = tar.tagName.toUpperCase(),
                    tarInn = tar.innerHTML,
                    tarPar = tar.parentNode,
                    tarGra = tarPar.parentNode;

                //->点击的是CONTENT下的LI:跳转到详细页面
                if ((tarTag === 'SPAN' && tarGra.id === 'content') || (tarTag === 'LI' && tarPar.id === 'content')) {
                    //window.location.href = 'detail.html'; ->在本页面打开新的页面,如果想在新的窗口打开新页面需要使用window.open('[url]')
                    var stuId = tarTag === 'SPAN' ? tarPar.getAttribute('stuId') : tar.getAttribute('stuId');
                    window.open('detail.html?id=' + stuId);
                    return;
                }

                //->点的是FOOTER下的SPAN
                if (tarTag === 'SPAN' && tarPar.id === 'footer') {
                    if (tarInn === 'FIRST') {
                        if (n === 1) {
                            return;
                        }
                        n = 1;
                    }
                    if (tarInn === 'LAST') {
                        if (n === total) {
                            return;
                        }
                        n = total;
                    }

                    if (tarInn === 'PREV') {
                        if (n === 1) {
                            return;
                        }
                        n--;
                    }
                    if (tarInn === 'NEXT') {
                        if (n === total) {
                            return;
                        }
                        n++;
                    }
                    //->获取最新N的值,重新的绑定数据
                    getData();
                    return;
                }

                //->点击的是FOOTER下的LI
                if (tarTag === 'LI' && tarGra.id === 'footer') {
                    if (n === parseFloat(tarInn)) {
                        return;
                    }
                    n = parseFloat(tarInn);
                    getData();
                }
            };

            //->文本框操作
            pageNum.onkeyup = function (ev) {
                ev = ev || window.event;
                //->只有按下的是ENTER键我们才跳转到对应的页码
                if (ev.keyCode !== 13) return;

                var val = Math.round(parseFloat(this.value));
                //->如果不是有效数字:不会重新绑定,让文本框中的内容还是当前页
                if (isNaN(val)) {
                    this.value = n;
                    return;
                }

                //->如果比第一页还小,让其等于第一页；
                //->如果比最后一页还大,让其等于最后一页即可;
                n = val > total ? total : (val < 1 ? 1 : val);
                getData();
            }
        }
    }
})();
pageRender.init();