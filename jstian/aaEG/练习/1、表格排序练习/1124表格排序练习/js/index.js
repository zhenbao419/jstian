/**
 * Created by Administrator on 2016/11/24.
 */
var table = document.getElementById('tab'),
    thead = table.tHead,
    theadRow = thead.rows[0],
    ths =theadRow.cells,
    tbody = table.tBodies[0],
    tbodyRows = tbody.rows;


//获取数据
function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status ==200){
          data = JSON.parse(xhr.responseText)
        }
    }
    xhr.send(null);
}
getData();

function bindData(){
    if(data){
        var frg = document.createDocumentFragment();
        for(var i=0;i<data.length;i++){
            var curDataObj =data[i];
            var tr = document.createElement('tr');//这个是创建了tr
               for(var key in curDataObj){
                   var td = document.createElement('td');
                   td.innerHTML = curDataObj[key];
                   if(key==='develop'){
                       td.innerHTML = curDataObj[key] ==0 ? '发展中': '发达'  ;
                   }else{
                       td.innerHTML = curDataObj[key];
                   }
                   tr.appendChild(td);
               }

            frg.appendChild(tr)
        }
        tbody.appendChild(frg);
        frg = null;
    }
}
bindData();

function changeBg(){
    for(var i=0; i<tbodyRows.length;i++){
        tbodyRows[i].className = i%2 ? 'c0' :'c1';
    }
}
changeBg();

function bindEvent(){
    for(var i=0;i<ths.length;i++){
        var curThs = ths[i];
        ths[i].index = i;
        ths[i].sortFlag = -1;

        if(curThs.className = 'cursor'){
            ths[i].onclick = function (){
                tableSort.call(this,this.index);
                changeBg();
            };

        }
    }
}
bindEvent();


function tableSort(n){

    for(var i=0;i<ths.length;i++){
        if(ths[i] !==this){
            ths[i].sortFlag = -1
        }
    }


   var tbodyRowsArray = listToArray(tbodyRows);
    this.sortFlag *= -1;
    var that = this;
    tbodyRowsArray.sort(function (a,b){
            var _a = a.cells[n].innerHTML;
            var _b = b.cells[n].innerHTML;
            if(isNaN(_a)||isNaN(_b)){
                return (_a.localeCompare(_b))*that.sortFlag;
            }
            return (_a - _b)*that.sortFlag;


    });
    //这个是已经把tbodyRowsArray排序好了

    var frg = document.createDocumentFragment();
    for(var i=0;i<tbodyRowsArray.length;i++){
        frg.appendChild(tbodyRowsArray[i]);
    }
    tbody.appendChild(frg);

}









function listToArray(likeAry){
    try{
       return Array.prototype.slice.call(likeAry)
    }catch(e){
        var ary = [];
        for(var i=0;i<likeAry.length;i++){
            ary[ary.length]=likeAry[i];
        }
        return ary;
    }

}












