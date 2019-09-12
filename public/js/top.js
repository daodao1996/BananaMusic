
let BASE_URL = "http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

window.onload=function(){
    toplist1();
    ifLogged();
};

function jumpMainpage() {
    window.location.href=BASE_URL+"/mainPage.html";
};

function jumpSinger() {
    window.location.href=BASE_URL+"/singer.html";
};

function jumpPlaylist() {
    window.location.href=BASE_URL+"/playlist.html";
};
function jumpMymusic() {
    if(sessionStorage.getItem("username")){
        window.location.href=BASE_URL+"/mymusic.html";
    }else{
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    }
};

function jumpSearchResult(){
    let text =document.getElementById("keyword0");
    console.log(text);
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
};
function ifLogged() {
    let uname = sessionStorage.getItem("username");
    if(uname !== null){
        $("#nav-login p").html("注销");
        $("#nav-login").click(function () {
            sessionStorage.removeItem("username");
            window.location.reload();
        });
    }
    else{
        $("#nav-login p").html("登录");
        $("#nav-login a").attr("href","/login.html");
    }
}

var options1={};
var options={};


function toplist1(){
  let temp=decodeURI(window.location.search.split("=")[1]);
   if(temp){ //根据url的参数
     $.ajax({
       type:"POST",
       url:BASE_URL+"/top.html",
       data:{
         listName:temp//url的参数值
       },
       datatype:'JSON',
       crossDomain:true,
       success:function(result) {
           albumintorduce(result);
           options1 = {
               "id": "page1",
               "data": result.songlist,
               "maxshowpageitem": 3,
               "pagelistcount": 15,
               "callBack": function (rr) {
                   albumSongList(rr);
               }
           };
           page1.init(result.songlist.length, 1, options1);//歌曲列表分页
           if (result.comment) {
               options = {
                   "id": "page",
                   "data": result.comment,
                   "maxshowpageitem": 3,
                   "pagelistcount": 4,
                   "callBack": function (rr) {
                       showAssess(rr, result.comment_num)
                   }
               };
               page.init(result.comment.length, 1, options);//评论分页
               $("#top_list .top_music").each(function () {
                   if ($(this).attr("value") == temp) {
                       $(".top_music").css("background", "#fffffa");
                       $(".top_music").css("color", "black");
                       $(this).css("background", "#ff9800");
                       $(this).css("color", "#fffffa");
                   }
               })
           }
       }

     })
}
}

function toplist(){
      $("#top_list").off().on('click','.top_music',function(){
     // top1();
      let value=$(this).attr("value");
      window.location.href=BASE_URL+"/top.html?listName="+value;
      })
}

function albumintorduce(data){
 let html=`<img src="${data.toplist_pic}" alt=""  id="T1"/>
	<div id="music_popular">
	<h2 id="Z8">${data.listName}</h2>
  </div> 
  </div>`;
  $("#D2").html(html);
}


function albumSongList(data){//加载歌曲列表
    let html="";
    for(let i in data){
        html=html+ ` <tr>
 		<td  style="font-famliy:宋体; font-size:14px; valign=middle" id="JS1" > <a href="${BASE_URL}/songDetail.html?songmid=${data[i].songmid}">	${data[i].songname}</a></td>
		<td style="font-famliy:宋体; font-size:16px; valign=middle" id="JS2"><a href="${BASE_URL}/singerDetail.html?singermid=${data[i].singermid}">${data[i].singername}</a></td>
 		<td style="font-famliy:宋体; font-size:16px; valign=middle">${toHourMinute(parseInt(data[i].songtime))}</td>
 	</tr>`;
        }
    $(".L3").html(html);

}

//分钟数转换为时和分
function toHourMinute(minutes) {
  if (Math.floor(minutes / 60) < 10) {
      if ((minutes % 60) < 10) {
          return ("0" + Math.floor(minutes / 60) + ":" + "0" + (minutes % 60));
      }
      else {
          return ("0" + Math.floor(minutes / 60) + ":" + (minutes % 60));
      }
  }
  else {
      if ((minutes % 60) < 10) {
          return (Math.floor(minutes / 60) + ":" + "0" + (minutes % 60));
      }
      else {
          return (Math.floor(minutes / 60) + ":" + (minutes % 60));
      }
  }
  // 也可以转换为json，以方便外部使用
  // return {hour:Math.floor(minutes/60),minute:(minutes%60)};
}


function showAssess(data,num){//显示评论
    let html=`<p class="lyric_name1">精彩评论(<span id="count_comment_2">${num}</span>条)</p>
    <div id="main_commit">
    <hr class="hr1">
    `;
    for(let i in data){
        html=html+` <div class="comment_1">
        
        <div class="message1">
        <span class="user">${data[i].nick}</span>
        <p class="comment_2"  value="${data[i].commentid}">
           ${data[i].rootCommentContent}
        </p>
        <p class="message1_bottom"> <img src="./img/消息.png" class="img2" onclick="ownIdeo()"></p>
        <div class="ret_message">
            <textarea placeholder="回复......" class="comment_write_1" onkeyup="commentCoun1()"></textarea><span class="count_comment_2">剩余<span class="count">300</span>字</span>
            <p class="pubic_commet_1"><img src="./img/笑脸.png" class="smail"><button class="commit_comment_1" onclick="returnMessage()">发表评论<tton><button class="down_comment_1" onclick="cancel()">取消<tton></p>
        </div>`;
        html=html+`<div id="ret_message_ret">`
        if(data[i].middleCommentContent!=null){
            for(let j in data[i].middleCommentContent){
                html=html+` <div class="ret_message_show"><span class="user_name">${data[i].middleCommentContent[j].replyedNick}</span><span class="ret_message_show_1">${data[i].middleCommentContent[j].subcommentcontent}
        </span>
        </div>`;
            }
        }
        html=html+`</div> </div>
        </div>
        <hr class="hr1">`;
    }
    $("#wonderful_comment").html(html);
}





  

  function publicMessage(){//发表评论
    $(".pubic_commet").off().on('click','#commit_comment',function(){
      var username= sessionStorage.getItem("username");
      let value= $(this).parent().parent().children('.comment_write').val();
      if(username){
      if(value.length>0){
        $.ajax({                                   //发表评论的ajax请求  需要所有的评论，以及评论的总个数
          type:'POST',
          url:BASE_URL+"/top.html/publicmessage",
          data:{
              listName:$("#Z8").html(),//topName
              nick:username,//nick
              rootCommentContent:$(this).parent().parent().children('.comment_write').val()//评论
          },
          datatype:'JSON',
          crossDomain:true,
          success:function(result){//传入的是评论
            alert("发表成功");
              $(".comment_write").val("");
              $("#count1").html("300");
            // showAssess(result.comment,result.comment_num)//显示评论
              options={
                  "id":"page",//显示页码的元素
                  "data":result.comment,//显示数据
                  "maxshowpageitem":5,//最多显示的页码个数
                  "pagelistcount":5,//每页显示数据个数
                  "callBack":function(rr){
                      showAssess(rr,result.comment.length);
                  }
              };
              page.init(result.comment.length,1,options);//评论部分的分页
          }
      })
    }
  }else{
    alert("请先登录！！！");
    window.location.href=BASE_URL+"/login.html";
  }
    })
  }


  function cancel(){//取消评论
    $(".pubic_commet_1").off().on('click','.down_comment_1',function(){
      $(this).parent().parent().children().first().val("");
      $(this).parent().parent().children().first().next().children().html('300');
      $(this).parent().parent().hide();
    })
  }


  

  function returnMessage(){//回复评论
    $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
        console.log("1"+$(this).parent().parent().parent().children('.user').text())
        console.log("2"+$(this).parent().parent().parent().children(".comment_2").attr("value"))
        console.log("3"+$(this).parent().parent().children().first().val())
      var username= sessionStorage.getItem("username");
      let value= $(this).parent().parent().children().first().val();
      if(username){
      if(value.length>0){
          console.log("进去了");
        $.ajax({                                    //回复评论的ajax请求   需要所有的评论，以及评论的总个数
          type:'POST',
          url:BASE_URL+"/top.html/retmessage",
          data:{
              "listName":$("#Z8").html(),//topName
             "commentid":$(this).parent().parent().parent().children(".comment_2").attr("value"),//主评论id
              "replydNick":username,//回复评论name
              "subcommentcontent": $(this).parent().parent().children().first().val()//回复评论内容
          },
          datatype:'JSON',
          crossDomain:true,
            success: function (result) {//目前是直接在当前节点插入显示，后期可以调整为局部刷新。
                alert("回复成功");
                // showAssess(result.comment,result.comment_num)//显示评论
                $(this).parent().parent().children().first().val("");
                $(this).parent().parent().children('.count_comment_1').children('.count').html("300");
                // showAssess(result.comment,result.comment_num)//显示评论
                options = {
                    "id": "page",//显示页码的元素
                    "data": result,//显示数据
                    "maxshowpageitem": 5,//最多显示的页码个数
                    "pagelistcount": 5,//每页显示数据个数
                    "callBack": function (rr) {
                        showAssess(rr, result.length);
                    }
                };
                page.init(result.length, 1, options);//评论部分的分页
            }
      })
      }
    }else{
      alert("请先登录！！！");
      window.location.href=BASE_URL+"/login.html";
    }
    })
  }


function commentCoun(){//控制文本框的字数
    $(document).ready(function(){
      let value=$(".comment_write").val();
      let length=value.length;
      let rest_length=300-Number(length);
      if(rest_length>=0){ 
        $(".comment_write").next().children().html(rest_length);
      }else{
        let value1=value.substr(0,300);
        alert("字数不能超过300个字");
        $(".comment_write").val(value1);
      }
    })
  }
  
  function commentCoun1(){//控制回复的字数
    $(document).ready(function(){
      $('.comment_write_1').keyup(function(){
        let value=$(this).val();
        let length=value.length;
      let rest_length=300-Number(length);
      if(rest_length>=0){
        $(this).next().children().html(rest_length);
      }else{
        let value1=value.substr(0,300);
        alert("字数不能超过300个字");
        $(this).val(value1);
      }
      })
    })
  }

  function ownIdeo(){
    $(".message1_bottom").off().on('click',".img2",function(){
      $(this).parent().next().show();
    })  
}

