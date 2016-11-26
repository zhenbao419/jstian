/**
 * Created by Administrator on 2016/11/24.
 */
var tab = document.getElementById('tab'),
    thead = tab.tHead,
    theadRow = thead.rows[0],
    ths = theadRow.cells,
    tbody = tab.tBodies[0],
    tbodyRows = tbody.rows;


//获取数据
function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data2.txt',false);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            data = JSON.parse(xhr.responseText);
           // console.log(xhr.responseText);
        }
    };
    xhr.send(null);
}
getData();


//绑定数据
function bindData(){
    if(data){
        var frg =document.createDocumentFragment();
        for(var i=0;i<data.length;i++){
            var curData = data[i];
            var tr = document.createElement('tr');
                for(var key in curData){
                    var td = document.createElement('td');
                    if(key === 'develop'){
                        td.innerHTML = curData[key] == 0 ? '发展中':'发达' ;
                    }else{
                        td.innerHTML = curData[key];
                    }
                    tr.appendChild(td);
                }
            frg.appendChild(tr);
        }
        tbody.appendChild(frg);
        frg=null;
    }
}
bindData();


//隔行变色
function changeBg(){
    for(var i=0;i<tbodyRows.length;i++){
        tbodyRows[i].className= i%2 ? 'c0': 'c1';
    }
}
changeBg();



//绑定事件
function bindEvent(){
    for(var i=0;i<ths.length;i++){
        if(ths[i].className=='cursor'){
            ths[i].index = i;
            ths[i].sortFlag = -1;

            ths[i].onclick = function (){
                tableSort.call(this,this.index);
                changeBg();
            }
        }
    }
}
bindEvent();

//排序
function tableSort(n) {
    for(var i=0;i<ths.length;i++){
        if(ths[i] !== this){
            ths[i].sortFlag = -1
        }
    }


    var tbodyRowsAry = listToArray(tbodyRows);
    this.sortFlag *=-1;
    var that = this;
    tbodyRowsAry.sort(function (a, b) {

        if ( isNaN(a) || isNaN(b) ) {
           // alert('zhege ');
            //console.log(a.cells[n].innerHTML);
            return ((a.cells[n].innerHTML).localeCompare(b.cells[n].innerHTML))*that.sortFlag;
        }
      // alert('zhege ')//这个没有走  点击都走不到这个语句
        return ((a.cells[n].innerHTML) - (b.cells[n].innerHTML))*that.sortFlag;



    });

    var frg = document.createDocumentFragment();
    for (var i = 0; i < tbodyRowsAry.length; i++) {
        frg.appendChild(tbodyRowsAry[i]);
    }
    tbody.appendChild(frg);
    frg = null;
}







    function listToArray(likeAry){
        try{
            return Array.prototype.slice.call(likeAry);
        }catch(e){
            var ary =[];
            for(var i=0;i<likeAry.length;i++){
                ary[ary.length] = likeAry[i];
            }
            return ary;
        }
    }

