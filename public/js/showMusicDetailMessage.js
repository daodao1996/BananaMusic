// let sum=1752;

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
const BASE_URL = "http://bananamusic.s1.natapp.cc";//'http://127.0.0.1:9696';
window.onload=function(){
    ifLogged();
     //loclaStorage();
     showSongDetail();
    // showSongDetailDiv(data);
    // showLyricDIV(data);
    // introduceAndSimilar(data);
    // similar(data.recommend);
    // showAssess(data.comment,data.comment_num);
    // page.init(data.comment.length,1,options);//评论部分的分页
};

// window.onload=function(){
//   loclaStorage();
//   // showSongDetail();
//  showSongDetailDiv(data);
//  showLyricDIV(data);
//  introduceAndSimilar(data);
//  similar(data.recommend);
//  showAssess(data.comment,data.comment_num);
//  page.init(data.comment.length,1,options);//评论部分的分页
// }

/*

function loclaStorage(){
    if(!window.sessionStorage){
        alert("浏览器支持localstorage");
    }else{
        var storage=window.localStorage;
        var data={
            username:'xiecanyong',
            password:'123456'
        };
        var d=JSON.stringify(data);
        storage.setItem("data",d);
        console.log(storage.data);
    }
}
*/

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

function showSongDetail(){//显示歌曲介绍部分以及歌词，相似推荐部分     需要歌曲的所有的信息
    console.log(window.location.search.split("=")[1]);
    $.ajax({
        type:'POST',
        url:BASE_URL+"/songDetail.html",
        data:{
            song_mid:window.location.search.split("=")[1]
        },
        datatype:'JSON',
        crossDomain:true,
        success:function(result) {
            showSongDetailDiv(result);
            showLyricDIV(result);
            introduceAndSimilar(result);
            similar(result.recommend);
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



function showSongDetailDiv(data){//显示歌曲介绍部分
    let html=`<div class="singerimg">
    <img src="${data.song_pic}">
</div>
<div class="song_introduce">
<p class="song_name">${data.songname}</p>
<p class="singer_1"><img src="../img/1.png"><span class="singer"><a href="${BASE_URL}/singerDetail.html?signer_mid=${data.signer_mid}">${data.singer_name}</a></span></p>
<table class="song_message">
 <tr>
   <td id="album">专辑:${data.albumname}</td>
   <td id="language">语种：${data.lan} </td>
 </tr>
 <tr>
   <td id="date">发行时间：${data.aDate}</td>
   <td id="song_company"> 发行公司：${data.company}</td>
 </tr>
</table>
<ul id="song_ul">
<li><button type="button" class="play" onclick="play()"><img src="../img/播放.png" class="play_image"><span>播放</span></button></li>
<li><button type="button" class="collection"  onclick="collection()" value="${data.songmid}"><img src="./img/notgood.png"><span>收藏</span></button></li>
<li><button type="button" class="assess"  onclick="assess()"><img src="../img/4.png"><span>评价</span></button></li>

</ul>
</div>`;

$(".middle_top").html(html);
}

function showLyricDIV(data){//显示歌词
    if(data.lan !== "纯音乐"){
            let html1 = "";
            let html2 = "";
            if (data.lyric.length>0) {
                let lyric1 = data.lyric;
                for (let i in lyric1) {
                    if (i <= 16) {
                        html1 = html1 + lyric1[i] + "<br>";
                    } else {
                        html2 = html2 + lyric1[i] + "<br>";
                    }
                }

                if (html2.length > 0) {
                    $("#lyric_1").html(html1);
                    $("#lyric_2").html(html2);
                } else {
                    $(".openlyric").hide();
                    $("#lyric_1").html(html1);
                }
            } else {
                // $("#no_lyric").show();
                // $("#lyric_1").hide();
                // $(".openlyric").hide();
                let html="抱歉，此歌曲没有歌词";
                $("#lyric_1").html(html);

            }
        }


    else{
        $("#lyric_1").html("此歌曲为没有填词的纯音乐，请您欣赏");
    }
}


function introduceAndSimilar(data){//歌曲详情
    if(data.song_info){
    let html=`<h2 class="lyric_name">简介</h2>
    <div class="intorduce_1">
        ${data.song_info}
    </div>`;
    $("#introduce").html(html);
    }
}

function similar(data){//相似推荐
    let html=` <h2 class="lyric_name">相似推荐</h2>
    <ul class="similar_1" >
      <li><img src="${data[0].song_pic}">
      <span class="similar_2"><a href="${BASE_URL}/songDetail.html?songmid=${data[0].songmid}">${data[0].songname}</a></span></li>
      <li><img src="${data[1].song_pic}"><span class="similar_2"><a href="${BASE_URL}/songDetail.html?songmid=${data[1].songmid}">${data[1].songname}</a></span></li>
      <li><img src="${data[2].song_pic}"><span class="similar_2"><a href="${BASE_URL}/songDetail.html?songmid=${data[2].songmid}">${data[2].songname}</a></span></li>
    </ul>
    `;

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

function play(){//播放的ajax请求链接 获取歌曲的图片,和名称
    $.ajax({
        type:"POST",
        url:BASE_URL+"/songDetail.html/songnamepic",
        data:{
            song_mid:window.location.search.split("=")[1],
            aaa:"playsong"
        },
        datatype:"JSON",
        crossDomain:true,
        success:function(result){
            let song_result={};
            song_result.cover=result.song_pic;
            song_result.title=result.songname;
            $.ajax({//播放的ajax链接请求
                type:'POST',
                url:BASE_URL+"/songDetail.html/songsrc",
                data:{
                    song_mid:window.location.search.split("=")[1]
                },
                datatype:'JSON',
                crossDomain:true,
                success:function(result){
                    let song_result1={};
                    song_result1.src=result;
                    song_result1.cover=song_result.cover;
                    song_result1.title=song_result.title;
                    let arr = [song_result1];
                    $("#play_song").show();
                    var audioFn = audioPlay({
                        song : arr,
                        autoPlay : false  //是否立即播放第一首，autoPlay为true且song为空，会alert文本提示并退出
                    });
                    audioFn.playAudio();
                }
            })
        }
    });
}



function collection(){//收藏
    let username=sessionStorage.getItem("username");
    if(username){
        let temp=$(".collection").children("img").attr("src").split("/")[2];
        if(temp=="notgood.png"){
            layer.open({
                type: 2,
                title: ['收藏到歌单', 'background-color:#ff9800;color:white;'],
                area: '500px',
                content: ['saveToMusicList.html', 'no'],
                skin: 'layer-add',
                btn: ['确定', '取消'],
                btnAlign: 'c',
                success: function(layero, index) {
                    layer.iframeAuto(index);
                },
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    var tvalue = body.find('#cid').val();
                    console.log("1"+$(".collection").attr("value"))
                    //console.log(dissid);
                    console.log(tvalue);
                    $.ajax({
                        type:"post",
                        data:{
                            "songmid":$(".collection").attr("value"),//歌曲名
                            "dissid":tvalue,//歌单
                            // username:username//用户名
                        },
                        url:BASE_URL+"/songDetail.html/collection",
                        dataType:"json",
                        crossDomain:true,
                        success:function (result) {
                            console.log(result);
                            if(result === true){
                                layer.close(index);
                                //console.log($(".collection").children("img").attr("src"))
                                $(".collection").children("img").attr("src"," ./img/good.png");
                                alert("收藏成功");
                            }else{
                                alert("歌曲已存在");
                            }
                        }
                    });



                },
                btn2: function (index, layero) {
                    layer.close(index);
                }
            });
        }
    }else{
        alert("请先登录");
        window.location.href=BASE_URL+"/login.html";
    }
}


  function assess(){//评论
    let url = window.location.toString();//跳转到评论最开始
    let id="main_comment";
    if(id){
      let t=$("#"+id).offset().top;
      $(window).scrollTop(t);
  }
}




function openLyric(){//展开歌词
  $(document).ready(function(){
    $(".openlyric").click(function(){
      $("#lyric_2").show();
      $(".openlyric").hide();
      $(".closelyric").show();
    });
  }) ;
  }


function closeLyric(){//收起歌词
  $(document).ready(function(){
    $(".closelyric").click(function(){
      $("#lyric_2").hide();
      $(".openlyric").show();
      $(".closelyric").hide();
      let url = window.location.toString();
      let id="lyric";
      if(id){
      let t=$("#"+id).offset().top;
      $(window).scrollTop(t);
      }
    });
  });
}


function addLyric(){//添加歌词
  $(".nothavelyric").hide();
  $(".addLyric").hide();
  $(".writeLyric").show();
}



// function wantToaddLyric(){//确定添加歌词
//   alert("感谢你的添加!");
//   $(".nothavelyric").show();
//   $(".addLyric").show();
//   $(".writeLyric").hide();
//   $("#lyrictextarea").val("");
// }


function wantToaddLyric(){//用户添加歌词的ajax请求
  $.ajax({
    type:'POST',
    url:BASE_URL+"songDetail.html/lyric",
    data:{
      song_mid:window.location.search.split("=")[1],
      lyric: $("#lyrictextarea").val()
    },
    datatype:'JSON',
    crossDomain:true,
    success:function(result){
      alert("感谢你的填充，我们会尽快审核!");
      $(".nothavelyric").show();
      $(".addLyric").show();
      $(".writeLyric").hide();
      $("#lyrictextarea").val("");
    }
  })
}

function downLyric(){//取消添加歌词
  $("#lyrictextarea").val("");
  $(".nothavelyric").show();
  $(".addLyric").show();
  $(".writeLyric").hide();
}


function publicMessage(){//发表评论
    $(".pubic_commet").off().on('click','#commit_comment',function(){
        var username= sessionStorage.getItem("username");
        if(username) {
            let value = $(this).parent().parent().children('.comment_write').val();
            if (value.length > 0) {
                $.ajax({                                   //发表评论的ajax请求  需要所有的评论，以及评论的总个数
                    type: 'POST',
                    url: BASE_URL + "/songDetail.html/publicmessage",
                    data: {
                        song_mid: window.location.search.split("=")[1],//歌曲id
                        nick: sessionStorage.getItem("username"),//nick
                        rootCommentContent: $(this).parent().parent().children('.comment_write').val()//评论
                    },
                    datatype: 'JSON',
                    crossDomain: true,
                    success: function (result) {//传入的是评论
                        alert("发表成功");
                        $("#commentContent").val("");
                        $("#commentcount").html("300");
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


  function cancel(){//取消评论
    $(".pubic_commet_1").off().on('click','.down_comment_1',function(){
      $(this).parent().parent().children().first().val("");
      $(this).parent().parent().children().first().next().children().html('300');
      $(this).parent().parent().hide();
    })
  }





  function returnMessage(){//回复评论
    $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
        var username= sessionStorage.getItem("username");
        if(username) {
            let value = $(this).parent().parent().children().first().val();
            if (value.length > 0) {
                $.ajax({                                    //回复评论的ajax请求   需要所有的评论，以及评论的总个数
                    type: 'POST',
                    url: BASE_URL + "/songDetail.html/retmessage",
                    data: {
                        song_mid: window.location.search.split("=")[1],//歌曲id
                        nick: $(this).parent().parent().parent().children('.user').text(),//主评论
                        commentid: $(this).parent().parent().parent().children(".comment_2").attr("value"),//主评论id
                        replydNick: sessionStorage.getItem("username"),//回复评论name
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
