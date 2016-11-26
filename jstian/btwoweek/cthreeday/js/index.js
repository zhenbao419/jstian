/**
 * Created by Administrator on 2016/11/24.
 */
//1、获取元素
var table = document.getElementById('tab');//获取最外层的table标签
var thead = table.tHead;//这个表格独有的获取方式获取头
var theadRow = thead.rows[0];//rows就是获取行，这是获取所有的行，即使只有一行也需要通过索引0来获取，获取第一行
var ths = theadRow.cells;//cells就是获取行内的所有的列，在表头里面的列。
var tBody = table.tBodies[0];//这是表格下所有的tbody，通过索引0来获取第一个
var tBodyRows = tBody.rows;//这是获取tbody下所有的行

/*文本文件里面的本身就是字符串所以中括号就不用带引号了*/

//2、先去获取数据  通过ajax来获取在data.txt这个文件中的数据
/*
*       ajax：   async(异步的) javascript  and  XML
*              作用：专门负责获取数据，或者和后端交互使用
*
*        步骤：1、创建一个异步对象  new XMLHttpRequest();
*             2、xhr.open('get/post(method)','url','true/false');
*                get/post是请求的方式，url是请求的地址（接口），false/true同步/true
*             3、绑定onreadystatechange事件，成功返回并且携带数据
 *                     xhr.readyState ==4 &&  xhr.status ==200
 *                     xhr.status == 200 成功
 *                     xhr.status = 404  -->not found 找不到
 *                     xhr.status = 502  -->服务器错误
 *                     xhr.status = 304   --> 本地缓存
 *
 *            4.xhr.send(null)  xhr出发
*
* */

function getData(){
    var xhr = new XMLHttpRequest();//新的XMLHttpRequest  类的一个实例 那么这个实例可以理解成为就是装载数据的载体
    xhr.open('get'/*方式*/,"data.txt",false);
// open('get/post','url',false)
//第一个参数的意思是：请求的方式是 get/post
//第二个参数的意思是：url：请求的地址(这个地址一般是后台提供)
//第三个参数的意思是：false同步还是异步（同步就是死等  异步是一起进行）
    xhr.onreadystatechange = function (){
        //这个是绑定事件，这个事件什么时候被触发呢？
        if(xhr.readyState == 4 &&  xhr.status == 200){
            //xhr.readyState == 4   xhr已经成功回来了
            //xhr.status == 200  xhr成功带着数据回来了
            //console.log(xhr.responseText) ;//这个属性上就是获取回来的数据
            //console.log(typeof xhr.responseText);//'string'
            //所以这个时候要去掉双引号，变成数组才行
            JSON.parse(xhr.responseText);//这样去掉了双引号
            console.log(JSON.parse(xhr.responseText));//[Object, Object, Object] 变成了数组对象

            window.data = JSON.parse(xhr.responseText)//赋值给全局变量，这样就可以在外面用了。这个属性上就是获取回来的数据，并且把这个txt数据解析成了一个数组。然后把这个数据赋值给window.data属性。那么在全局就会多一个叫做data的全局变量。


        }
    };
    xhr.send(null);//这个时候才触发

}

getData();




// 3. 我们要把刚刚通过ajax的方式获取到的数据，添加到页面的tbody中
//console.log(window.data);//变成了数组里面包含了一堆对象


function bindData(){
    if(window.data){
        var frg =document.createDocumentFragment();
        for(var i=0;i<data.length;i++){
            var curDataObj = data[i];
            //curDataObj就是一个对象{contry：，GDP}
            //只要能循环一次那么比然存在一个对象，只要有一个对象就是在tbody里需要创建一行。
            var tr = document.createElement('tr');
            //因为并不知道有多少列所以用for in 遍历属性就行了
            //第二个循环是往tr内添加td
            for(var key in curDataObj){
                var td = document.createElement('td');
                if(key === 'develop'){//说明当前正在遍历develop这一组属性  如果是develop 还要判断属性值是不是0,如果是0显示发展中，如果是1显示'发达'
                    td.innerHTML = curDataObj[key]==0 ?'发展中':'发达';
                }else{
                    td.innerHTML = curDataObj[key];//因为key是变量
                    //td的html是根据当前你正在遍历的这一组属性的值来决定的。属性值是每次根据key的不同变着的。
                }

                /*  对上面的简写成三元运算
                 td.innerHTML = key =='develop' ?(curDataObj[key]==0?'发达中':'发展中'):curDataObj[key];*/


                tr.appendChild(td);//这个时候不会出现回流因为没有在页面中
            }
            frg.appendChild(tr);
        }
        tBody.appendChild(frg);
        frg = null;
    }

}

bindData();

//4、隔行变色
function changeBg(){
    for(var i=0;i<tBodyRows.length;i++){
        tBodyRows[i].className = i%2 ? 'c0':'c1';
    /*    console.log(tBodyRows[i]);*/
    }
}
changeBg();



//5、点击的时刻应该排序  给表头那些th绑定点击事件

function bindEvent(){
    for(var i = 0; i<ths.length;i++){
        if(ths[i].className == 'cursor'){//只给包含cursor这个类的th绑定点击事件

            ths[i].index =i;//每个表头都添加一个自定义属性，为了保存自己的索引值。点击那一刻排序方法需要用到这个索引。根据这个索引来排序。
            ths[i].sortFlag = -1;//这个就是为了让这个正序和倒序

            ths[i].onclick = function(){
                //当点击动作发生的时刻就应该按照当前点击的这一列排序
                tableSort.call(this,this.index);//this.index 点击哪一列那一列排序
                //当点击动作发生的时候，其实是tbody下的rows去上下调换位置。按照点击这一列的innerHTML的值去排序。
             // this;  //这里的this就是点击那一列的表头th =》这个表头的索引和这一列内所有tbody下的td的索引是相同的。
                changeBg();//这样就是隔行变色不会乱了
            };

        }
    }
}
bindEvent();



function tableSort(n){//表格排序的核心函数

    //把不是点击的那个就 让其他的都再点击的时候是升序排序 不用都变成正序或者倒序 这个是最后写的
    for(var i=0;i<ths.length;i++){
        if(ths[i] !== this){
            ths[i].sortFlag =-1;
        }
    }




    //tBodyRows//这个是类数组
   var tBodyRowsAry =  ListToArray(tBodyRows);//把tBodyRows转化为数组。

    this.sortFlag *= -1;
    var that = this;//用that的变量去保存这个this


    tBodyRowsAry.sort(function (a,b){//dom映射关系一直存在
      //这个数组内是tbody下的所有的tr
      // a 和 b 代表的是相邻的两个行（tr）
        //我们是按照tr所有列中tr.cells的正在点击的那一列排序  tr.cell[点击的那一列的索引]的innerHTML排序
        // a那一行的所有列，第几列就要加索引

        var _a =a.cells[/*3*/n].innerHTML;
        var _b = b.cells[/*3*/n].innerHTML;
        if(isNaN(_a)||isNaN(_b)){//判断_a和_b 是不是一个数的时候就进行着个（文字）
            return (_a.localeCompare(_b))*that.sortFlag;
            //这个sort方法中的this已经是window了。所以这里不可以用this了，到上一级把this拿来，通过that = this获取到的。
            //如果是字符串需要用这个方法去比较

        }
        return (_a -_b)*that.sortFlag;


     // return  a.cells[/*3*/n].innerHTML - b.cells[/*3*/n].innerHTML;
    });
    //tBodyRowsAry经过sort方法排序之后已经排好顺序的数组了

    //需要把排好序的数组重新添加到页面中
    var frg = document.createDocumentFragment();//避免dom回流所以加这个
    for(var i=0;i<tBodyRowsAry.length;i++){
        frg.appendChild(tBodyRowsAry[i]);
    }
    tBody.appendChild(frg);
    frg=null;
}

/*tableSort()*/






function ListToArray(likeAry){//类数组转化为数组
   try{
     return  Array.prototype.slice.call(likeAry);//重头复制到为
   }catch(e){
       var ary = [];
       for(var i=0;i<likeAry.length;i++){
           ary[ary.length] = likeAry[i];
       }
       return ary;
   }
}







