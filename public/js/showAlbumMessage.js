// let data={albumID:'003RMaRIliFoYd',pubTime:'2014-12-26',album_name:'哎呦，不错哦',lan:'国语',company:'杰威尔音乐有限公司',desc:'年度特大号期待！ 很Jay的一张专辑 周杰伦 Jay Chou 哎呦，不错哦 JAY语录里最被流传模仿的一句 最周杰伦的一张创作 以幽默拉开序幕，给你「鞋子特大号」！ 幽默是挫折中优雅',
// album_pic:"https://y.gtimg.cn/music/photo_new/T002R300x300M000001uqejs3d6EID.jpg?max_age=2592000",singer_MID:'001',list:[{songname:'阳明山',singer_name:'周杰伦',song_time:'02:32',song_mid:'001'},
// {songname:'窃爱',singer_name:'周杰伦',song_time:'03:24',song_mid:'002'},{songname:'算什么男人',singer_name:'周杰伦',song_time:'04:49',song_mid:'003'},{songname:'一口气全念对',singer_name:'周杰伦',song_time:'02:38',song_mid:'005'}
// ]};

// let data1={singer_name:"周杰伦",singer_MID:"001",album_list:[{album_name:"周杰伦的床边故事",album_pic:"https://y.gtimg.cn/music/photo_new/T002R90x90M000003RMaRI1iFoYd.jpg?max_age=2592000"},{album_name:"Try",album_pic:"https://y.gtimg.cn/music/photo_new/T002R90x90M000001V8fw21OdEnP.jpg?max_age=2592000"},{album_name:"英雄",album_pic:"https://y.gtimg.cn/music/photo_new/T002R90x90M000001uJFiE0tbGGa.jpg?max_age=2592000"}]}




let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";
// var options={
// 	"id":"page",//显示页码的元素
// 	"data":data.comment,//显示数据
//     "maxshowpageitem":5,//最多显示的页码个数
//     "pagelistcount":5,//每页显示数据个数
//     "callBack":function(result){
//         showAssess(result,data.comment.length);
//     }
// };
 let options={};


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

function jumpLogin() {
    window.location.href=BASE_URL+"/login.html";
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
        $("#nav-login a").attr("href","login.html");
    }
}

let albumID='003RMaRIliFoYd';
window.onload=function(){
    ifLogged();
  showAlbumDetail()
//     albumSongList(data);
//     albumIntroduce(data);
//     introduceAndSimilar(data);
//     similar(data.similar);
//    // showAssess(data2,sum);
//     page.init(data.comment.length,1,options);//评论部分的分页
}

// window.onload=function(){
//     albumSongList(data);
//     albumIntroduce(data);
//     introduceAndSimilar(data);
//     similar(data.similar);
//     page.init(datas.length,1,options);//评论部分的分页
// }

function showAlbumDetail(){//显示专辑介绍部分以及评论//关于这个专辑的所有
    $.ajax({
        type:'POST',
        url:BASE_URL+"/album.html",
        data:{
            albumID:window.location.search.split("=")[1]
        },
        datatype:'JSON',
        crossDomain:true,
        success:function(result) {
            albumSongList(result);//显示专辑列表
            albumIntroduce(result);//显示专辑介绍
            introduceAndSimilar(result);//专辑详情介绍
            similar(result.similar);//相似推荐
            if (result.comment) {
                options = {
                    "id": "page",//显示页码的元素
                    "data": result.comment,//显示数据
                    "maxshowpageitem": 5,//最多显示的页码个数
                    "pagelistcount": 5,//每页显示数据个数
                    "callBack": function (rr) {
                        showAssess(rr, result.comment.length);
                    }
                };
                page.init(result.comment.length, 1, options);//评论部分的分页
            }
        }
    })
}




function albumSongList(data){//加载专辑列表
    let html="";
    for(let i in data.list){
        html=html+ `<tr value="${data.list[i].song_mid}">
<td>${data.list[i].songname}</td>
<td>${data.list[i].singer_name}
    <a href="${BASE_URL}/songDetail.html?songmid=${data.list[i].songmid}">
    <img src="./img/按钮1.png"></a>
</td>
<td>${toHourMinute(parseInt(data.list[i].song_time))}</td></tr>`
        }

    $(".album_tbody_list").html(html);

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

function albumIntroduce(data){//专辑介绍1
    let html="";
    html=html+`<div class="singerimg"><img src="${data.album_pic}"></div><div class="song_introduce"><p class="song_name">${data.albumName}</p>
    <p class="singer_1" ><img src="./img/1.png"><span class="singer">${data["list"][0].singer_name}</span></p>
    <table class="song_message">
<tr>
<td id="album">专辑:${data.albumName}</td>
<td id="language">语种：${data.lan} </td>
</tr>
<tr>
<td id="date">发行时间：${data.pubTime}</td>
<td id="song_company"> 发行公司：${data.company}</td>
</tr>
</table>
</div>`;
$('.middle_top').html(html);
}

function introduceAndSimilar(data){//专辑详情
    let html=`<h2 class="album_name">简介</h2>
    <div class="intorduce_1">
        ${data.desc}
    </div>`;
    $("#introduce").html(html);
}

function similar(data){//相似推荐
    let html="";
    if(data.length>0){
        html=html+` <h2 class="album_name">其他专辑</h2>
        <ul class="similar_1" ><li><img src="${data[0].album_pic}">
        <span class="similar_2"><a href="${BASE_URL}/album.html?albumMID=${data[0].albumMID}">${data[0].albumName}</a></span></li>
        <li><img src="${data[1].album_pic}"><span class="similar_2"><a href="${BASE_URL}/album.html?albumMID=${data[1].albumMID}">${data[1].albumName}</a></span></li>
        <li><img src="${data[2].album_pic}"><span class="similar_2"><a href="${BASE_URL}/album.html?albumMID=${data[2].albumMID}">${data[2].albumName}</a></span></li></ul>`;
    }
    $("#similar_recommendation").html(html);
}



function showAssess(data,num){//显示评论
  //$("#commentContent").reload();
  let html=`<p class="lyric_name1">精彩评论(<span id="count_comment_2">${num}</span>条)</p>
  <div id="main_commit">
  <hr class="hr1">
  `;
  for(let i in data){
      html=html+` <div class="comment_1">
      
      <div class="message1">
      <span class="user">${data[i].nick}:</span>
      <p class="comment_2"  value="${data[i].commentid}">
         ${data[i].rootCommentContent}
      </p>
      <p class="message1_bottom"> <img src="../img/消息.png" class="img2" onclick="ownIdeo()"></p>
      <div class="ret_message">
          <textarea placeholder="回复......" class="comment_write_1" onkeyup="commentCoun1()"></textarea><span class="count_comment_2">剩余<span class="count">300</span>字</span>
          <p class="pubic_commet_1"><img src="../img/笑脸.png" class="smail"><button class="commit_comment_1" onclick="returnMessage()">发表评论</button><button class="down_comment_1" onclick="cancel()">取消</button></p>
      </div>`;
      html=html+`<div id="ret_message_ret">`
      if(data[i].middleCommentContent!=null){
          for(let j in data[i].middleCommentContent){
              html=html+` <div class="ret_message_show"><span class="user_name">${data[i].middleCommentContent[j].replyedNick}:</span><span class="ret_message_show_1">${data[i].middleCommentContent[j].subcommentcontent}
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


function assess(){//评论
    let url = window.location.toString();//跳转到评论最开始
    let id="main_comment";
    if(id){
      let t=$("#"+id).offset().top;
      $(window).scrollTop(t);
  }
}


function collection(){//收藏
    let temp=$(".collection").children("img")[0].src.split("album/")[1];
    if(temp=="notgood.png"){
      $(".collection").children("img").attr("src","./img/good.png");
      alert("收藏成功");
    }else{
      $(".collection").children("img").attr("src",'./img/notgood.png');
      alert("取消收藏");
    }
  }


  function play(){//播放
    alert("我播放了");
   
    // alert($(".album_tbody_list tr").attr("value"));
  }



  function publicMessage(){//发表评论
  $(".pubic_commet").off().on('click','#commit_comment',function(){
      var username= sessionStorage.getItem("username");
      if(username) {
          let value = $(this).parent().parent().children('.comment_write').val();
          if (value.length > 0) {
              $.ajax({                                   //发表评论的ajax请求  需要所有的评论，以及评论的总个数
                  type: 'POST',
                  url: BASE_URL + "/album.html/publicmessage",
                  data: {
                      albumMID: window.location.search.split("=")[1],//歌曲id
                      nick: username,
                      rootCommentContent: $(this).parent().parent().children('.comment_write').val()//评论
                  },
                  datatype: 'JSON',
                  crossDomain: true,
                  success: function (result) {//传入的是评论
                      alert("发表成功");
                      $(".comment_write").val("");
                     $("#count1").html("300");
                      // showAssess(result.comment,result.comment_num)//显示评论
                      options = {
                          "id": "page",//显示页码的元素
                          "data": result.comment,//显示数据
                          "maxshowpageitem": 5,//最多显示的页码个数
                          "pagelistcount": 5,//每页显示数据个数
                          "callBack": function (rr) {
                              showAssess(rr, result.comment.length);
                          }
                      };
                      page.init(result.comment.length, 1, options);//评论部分的分页
                  }
              })
          }
      }else{
          alert("请先登录!!!");
          window.location.href=BASE_URL+"/login.html";
      }
  })
}

//   function publicMessage(){//发表评论
//     $(".pubic_commet").off().on('click','#commit_comment',function(){
//       let value= $(this).parent().parent().children('.comment_write').val();
//       if(value.length>0){
//       alert("发表成功");
//       let html=`  <hr class="hr1"><div class="comment_1">
//       <img src="../../img/SongDetail/头像1.png" class="photo">
//       <div class="message1">
//       <span class="user">赵一盾</span>
//       <p class="comment_2">
//         ${value}
//       </p>
//       <p class="message1_bottom"><span class="data1">2018年7月12日</span><img src="./img/攒.png" class="img1"  onclick="addZai()"><img src="./img/点赞.png" class="img3"  onclick="downZai()"><span class="count_zai">1526</span> <img src="../../img/SongDetail/消息.png" class="img2" onclick="ownIdeo()"></p>
//       <div class="ret_message">
//           <textarea placeholder="回复......" class="comment_write_1" onkeyup="commentCoun1()"></textarea><span class="count_comment_2">剩余<span class="count">300</span>字</span>
//           <p class="pubic_commet_1"><img src="./img/笑脸.png" class="smail"><button class="commit_comment_1" onclick="returnMessage()">发表评论</button><button class="down_comment_1" onclick="cancel()">取消</button></p>
//       </div>
//       <div id="ret_message_ret"></div>`
//       ;
//       $("#main_commit").prepend(html);
//       $(this).parent().parent().children('.comment_write').val("");
//       $(this).parent().parent().children('.count_comment_1').children('.count').html("300");
//     }
//     })
//   }

  function cancel(){//取消评论
    $(".pubic_commet_1").off().on('click','.down_comment_1',function(){
      $(this).parent().parent().children().first().val("");
      $(this).parent().parent().children().first().next().children().html('300');
      $(this).parent().parent().hide();
    })
  }


//   function returnMessage(){//回复评论
//     $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
//       let value= $(this).parent().parent().children().first().val();
//       if(value.length>0){
//       let html=` <div class="ret_message_show"><span class="user_name">${JSON.parse(window.localStorage.data).username}</span><span class="ret_message_show_1">${value}</span></div>`;
//       alert("回复成功");
//       $(this).parent().parent().next().prepend(html);
//       $(this).parent().parent().children().first().val("");
//       $(this).parent().parent().children().first().next().children().html('300');
//       $(this).parent().parent().hide();
//       }
//     })
//   }

  function returnMessage(){//回复评论
    $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
        var username= sessionStorage.getItem("username");
        if(username) {
            let value = $(this).parent().parent().children().first().val();
            if (value.length > 0) {
                $.ajax({                                    //回复评论的ajax请求   需要所有的评论，以及评论的总个数
                    type: 'POST',
                    url: BASE_URL + "/album.html/retmessage",
                    data: {
                        albumMID: window.location.search.split("=")[1],//歌曲id
                        nick: $(this).parent().parent().parent().children('.user').text(),//主评论
                        commentid: $(this).parent().parent().parent().children(".comment_2").attr("value"),//主评论id
                        replydNick: username,//回复评论name
                        subcommentcontent: $(this).parent().parent().children().first().val()//回复评论内容

                    },
                    datatype: 'JSON',
                    crossDomain: true,
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
            alert("请先登录!!!");
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

  function moreComment(){//查看更多的评论
    $(document).ready(function(){
      $("#more_main_comment").show();
      $(".more_comment").hide();
      $(".close_comment").show();
    })
  }
  
  function ownIdeo(){
    $(".message1_bottom").off().on('click',".img2",function(){
      $(this).parent().next().show();
    })  
}