var tabBox = document.getElementById('tabBox');
var table = tabBox.getElementsByTagName('table')[0];
var theadCells = table.tHead.rows[0].cells;
var tbody = table.tBodies[0];
var tbodyRows = tbody.rows;
;(function getData(){ //getData
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status ==200){
            window.data = utils.jsonParse(xhr.responseText);
        }
    };
    xhr.send(null);
})();

;(function bindData(){
    if(data){
        var frg = document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var tr = document.createElement('tr');
            var curObj = data[i];
            for(var key in curObj){
                var td = document.createElement('td');
                if(key  === 'sex'){
                    td.innerHTML = curObj['sex'] === 1 ? '男' : "女";
                }else{
                    td.innerHTML = curObj[key];
                }
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tbody.appendChild(frg);
        frg = null;
    }
})();
function changeBg(){
    for(var i=0; i<tbodyRows.length; i++){
        tbodyRows[i].className = i%2 ? "bg" : '';
    }
}
changeBg();

;(function bindEvent(){
    for(var i=0; i< theadCells.length; i++){
        theadCells[i].index = i;
        theadCells[i].sortFlag = -1;
        if(theadCells[i].className === "cursor"){
            theadCells[i].onclick = function (){
                sort.call(this);
                changeBg();
            }
        }
    }
})();

function sort(){
    for(var i=0; i<theadCells.length; i++){
        if(theadCells[i] != this){
            theadCells[i].sortFlag = -1;
        }
    }
    var tbodyrowsAry = utils.listToArray(tbodyRows);
    var that = this;
    that.sortFlag *= -1;
    tbodyrowsAry.sort(function (a,b){
        var _a = a.cells[that.index].innerHTML;
        var _b = b.cells[that.index].innerHTML;
        if(isNaN(_a) || isNaN(_b)){
            return (_a.localeCompare(_b))*that.sortFlag;
        }
        return (_a - _b)*that.sortFlag;
    });
    var frg = document.createDocumentFragment();
    for(var i=0; i<tbodyrowsAry.length; i++){
        frg.appendChild(tbodyrowsAry[i]);
    }
    tbody.appendChild(frg);
    frg = null;
}


