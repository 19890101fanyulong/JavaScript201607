/**
 * Created by lucky on 2016/7/17.
 */
var box = document.getElementById('box');
var table = box.getElementsByTagName('table')[0];
var theadThs = table.tHead.rows[0].cells;
var tbody = table.tBodies[0];
var tbodyRows = tbody.rows;

function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET",'data.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            window.data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
}
getData();

function bindData(){
    if(window.data){
        var frg = document.createDocumentFragment();
        for(var i=0; i<data.length; i++){
            var curData = data[i];
            var tr = document.createElement('tr');
            for(var key in curData){
                var td = document.createElement('td');
                if(key === 'sex'){
                    td.innerHTML = curData[key] == 1 ? "男" : "女";
                }else{
                    td.innerHTML = curData[key];
                }
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tbody.appendChild(frg);
        frg = null;
    }
}
bindData();

function bindEvent(){
    for(var i=0; i<theadThs.length; i++){
        theadThs[i].index = i;
        theadThs[i].sortFlag = -1;

        if(theadThs[i].className === 'cursor'){
            theadThs[i].onclick = function (){
                //
                sort.call(this);
                changeBg();
            }
        }
    }
}
bindEvent();

function changeBg(){
    for(var i=0; i<tbodyRows.length; i++){
        tbodyRows[i].className = i%2 ? "bg" : "";
    }
}
changeBg();

function sort(){
    for(var i=0; i<theadThs.length; i++){
        if(theadThs[i] !== this){
            theadThs[i].sortFlag = -1;
        }
    }
    var tbodyRowsAry = [].slice.call(tbodyRows);
    var that = this;
    that.sortFlag *= -1;
    tbodyRowsAry.sort(function (a,b){
        var _a = a.cells[that.index].innerHTML;
        var _b = b.cells[that.index].innerHTML;
        if(isNaN(_a) || isNaN(_b)){
            return (_a.localeCompare(_b))*that.sortFlag;
        }
        return (_a - _b)*that.sortFlag;
    });
    var frg = document.createDocumentFragment();
    for(var i=0; i<tbodyRowsAry.length; i++){
        frg.appendChild(tbodyRowsAry[i]);
    }
    tbody.appendChild(frg);
    frg = null;
}