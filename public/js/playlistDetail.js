    var options={};
    var options1={};
    let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

// options1={//歌曲分页部分
//         "type":"song",
//         "id":"song-page",//显示页码的元素
//         "data":data.songlist,//显示数据
//         "maxshowpageitem":5,//最多显示的页码个数
//         "pagelistcount":10,//每页显示数据个数
//         "callBack":function(song_data){
//         var html="";
//         for(let i= 0 ; i <song_data.length ; i ++){
//          let j = i + 1;
//          html=html+`<tr><td>${j}</td>
//          <td id="little-btn-play"><a href="${BASE_URL}/singerDetail.html?songmid=${song_data[i].songmid}">${song_data[i].songname}</a><a href="${BASE_URL}/singerDetail.html?songmid=${song_data[i].songmid}"><img  src="./img/播放_hover.png"></a></td>
//          <td><a href="${BASE_URL}/singerDetail.html?singer_mid=${song_data[i].singer_mid}">${song_data[i].singer_name}</a></td>
//          <td>${changeToSeconds(song_data[i].songTime)}</td></tr>`;
//       }
//       $("#song_tbody").html(html);
//      }
//     };
//                    options={
//                   "id":"page1",//显示页码的元素
//                   "data":data.comment,//显示数据
//                   "maxshowpageitem":5,//最多显示的页码个数
//                   "pagelistcount":5,//每页显示数据个数
//                   "callBack":function(rr){
//                     showAssess(rr,data.comment.length);
//                   }
//                 };
  window.onload=function(){
createPlaylist();//歌单ajax
      ifLogged();
  // publicMessage();
  // createIntro(data);
  // ulAlignCenter(data.songlist,1,options1);
  // ulAlignCenter1(data.comment,1,options);


  // page.init(data.songlist.length,1,options1);
  // page1.init(data.comment.length,1,options);


  // loclaStorage();
  // showAssess(data.comment,data.comment_num);
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


    $(document).ready(function(){

  //歌单的更多介绍
  $('.detail-more a').on('click',function(){
  // $('.to-show').text(data.singer_info);

  $('.to-show').slideDown(500);
});
  //任意处隐藏
  $(document).click(function(){
    $(".to-show").hide();
  });
  //阻止冒泡
  $(".detail-more a,.to-show").click(function(event){
    event.stopPropagation();
  });
});

function commentCoun(){//控制文本框的字数
  $(document).ready(function(){
    let value=$(".comment_write").val();
    let length=value.length;
    let rest_length=300-Number(length);
    if(rest_length>0){
      $(".count").html(rest_length);
    }else{
      let value1=value.substr(0,300);
      alert("字数不能超过300个字");
      $(".comment_write").val(value1);
    }
  })
}

function commentCoun1(){//控制回复的字数
  $(document).ready(function(){
    let value=$(".comment_write_1").val();
    let length=value.length;
    let rest_length=300-Number(length);
    if(rest_length>0){
      $(".count").html(rest_length);
    }else{
      let value1=value.substr(0,300);
      alert("字数不能超过300个字");
      $(".comment_write_1").val(value1);
    }
  })
}
function moreComment(){//查看更多的评论
  $(document).ready(function(){
    $("#more_main_comment").show();
    $(".more_comment").hide();
    $(".close_comment").show();
  })
}

function closeComment(){//收起评论
  $(document).ready(function(){
    $("#more_main_comment").hide();
    $(".more_comment").show();
    $(".close_comment").hide();
    let url = window.location.toString();//跳转到评论最开始
    let id="wonderful_comment";
    if(id){
      let t=$("#"+id).offset().top;
      $(window).scrollTop(t);
    }
  })
}

function addZai(){
  $(document).ready(function(){
   $(".message1_bottom").off().on('click',".img1",function(){
    let value=$(this).next().text();
    $(this).next().text(Number(value)+1);
  })
 })
}

function ownIdeo(){
 $(".message1_bottom").off().on('click',".img2",function(){
   $(this).parent().next().show();
 })
}

// function publicMessage(){//发表评论
//   alert("发表成功");
// }

function returnMessage(){//回复评论
  $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
    alert("回复成功");
    $(this).parent().parent().hide();
  })
}
function cancel(){//取消评论
  $(".pubic_commet_1").off().on('click','.down_comment_1',function(){
    $(this).parent().parent().hide();
  })
}
// function loclaStorage(){
//   if(!window.localStorage){
//     alert("浏览器支持localstorage");
//   }else{
//     var storage=window.localStorage;
//     var data={
//       username:'xiecanyong',
//       password:'123456'
//     };
//     var d=JSON.stringify(data);
//     storage.setItem("data",d);
//     console.log(storage.data);
//   }
// }

function createIntro(data){
  $(document).ready(function(){
    $('.top-photo img').attr('src',data.imgurl);
    // $('.top-right-me img').attr('src',user.user_pic)
    $('.top-right-title').text(data.dissname);
    $('.top-right-name').text("创建者:"+data.creatorName);
    $('.music-type').text("创建时间:" + data.createTime);
    $('#intro>p').text(cutstr("简介:"+data.desc,190));
  });
}
function ulAlignCenter(data,yes,options1){
  if(Math.ceil(data.length/10) <= 5)
  {
    $('#song-page').css("width",90 + Math.ceil(data.length/10) * 45 + 'px');
  }
  else{
    $('#song-page').css("width",'1200px')
  }
  page.init(data.length,yes,options1);
  }
  function ulAlignCenter1(data,yes,options){
    if(Math.ceil(data.length/5) <= 5)
    {
      console.log(90 + Math.ceil(data.length/5) * 45 + 'px');
      $('#page1').css("width",90 + Math.ceil(data.length/5) * 45 + 'px');
    }
    else{
      $('#page1').css("width",'1200px')
    }
    page1.init(data.length,yes,options);
  }

// function createSongList(songList){//创建表格
//     let html="";
//     for(let i in songList){
//       html=html+`<tr><td>${songList[i].songOrder}</td>
//       <td id="little-btn-play"><a href="">${songList[i].songname}</a><a href=""><img  src="../img/播放_hover.png"></a></td>
//       <td><a href="">${songList[i].albumName}</a></td>
//       <td><a href="">${songList[i].singer}</a></td>
//       <td>${changeToSeconds(songList[i].song_time)}</td></tr>`;
//     }
//     $("#song_tbody").html(html);
// }




  //分秒转换
  function changeToSeconds(time){
    let Min = '';
    let Sec = '';
    if(Math.floor(time / 60) < 10)
    {
      Min += '0' + Math.floor(time / 60).toString();
    }
    else
    {
      Min = Math.floor(time / 60).toString();
    }
    if(Math.floor(time % 60) < 10)
    {
      Sec = '0' + Math.floor(time % 60).toString();
    }
    else
    {
      Sec = Math.floor(time % 60).toString();
    }
    return Min + ':' + Sec;
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


function createPlaylist(){
  $.ajax({
    type:'POST',
    url:BASE_URL+"/playlistDetail.html",
    data:{
              dissid:window.location.search.split("=")[1],//歌单id
          },
    datatype:'JSON',
    crossDomain:true,

    success:function(result) {
        console.log(result.desc);
        createIntro(result);
        $('.to-show').html("<h4>歌单简介</h4><p>" + result.desc + "</p>");

        options1 = {//歌曲分页部分
            "type": "song",
            "id": "song-page",//显示页码的元素
            "data": result.songlist,//显示数据
            "maxshowpageitem": 5,//最多显示的页码个数
            "pagelistcount": 10,//每页显示数据个数
            "callBack": function (song_data) {
                var html = "";
                for (let i = 0; i < song_data.length; i++) {
                    let j = i + 1;
                    html = html + `<tr><td>${j}</td>
         <td id="little-btn-play"><a href="${BASE_URL}/songDetail.html?songmid=${song_data[i].songmid}">${song_data[i].songname}</a><a href="${BASE_URL}/songDetail.html?songmid=${song_data[i].songmid}"><img  src="./img/播放_hover.png"></a></td>
         <td>${song_data[i].singer_name}</td>
         <td>${changeToSeconds(song_data[i].songTime)}</td></tr>`;
                }
                $("#song_tbody").html(html);
            }
        };
        page.init(result.songlist.length, 1, options1);
        if (result.comment) {
            options = {
                "id": "page1",//显示页码的元素
                "data": result.comment,//显示数据
                "maxshowpageitem": 5,//最多显示的页码个数
                "pagelistcount": 5,//每页显示数据个数
                "callBack": function (rr) {
                    showAssess(rr, result.comment.length);
                }
            };
            page1.init(result.comment.length, 1, options);//评论部分的分页

        }
    }
   })
}

function publicMessage(){//发表评论
  $(".pubic_commet").off().on('click','#commit_comment',function(){
    var username = sessionStorage.getItem("username");
    if(username){
      let value= $(this).parent().parent().children('.comment_write').val();
    if(value.length>0){
        $.ajax({                                   //发表评论的ajax请求  需要所有的评论，以及评论的总个数
          type:'POST',
          url:BASE_URL+"/playlistDetail.html/publicmessage",
          data:{
              dissid:window.location.search.split("=")[1],//歌单id
              nick:username,
              rootCommentContent:$(this).parent().parent().children('.comment_write').val()//评论
            },
            datatype:'JSON',
            crossDomain:true,
          success:function(result){//传入的是评论
          //  window.location.reload();

            alert("发表成功");
              $(".comment_write").val("");
              $("#count1").html("300");
            // showAssess(result.comment,result.comment_num)//显示评论
            options={
                  "id":"page1",//显示页码的元素
                  "data":result,//显示数据
                  "maxshowpageitem":5,//最多显示的页码个数
                  "pagelistcount":5,//每页显示数据个数
                  "callBack":function(rr){
                    showAssess(rr,result.length);
                  }
                };
               page1.init(result.length,1,options);//评论部分的分页
              //ulAlignCenter1(result.length,1,options);
            }
          })
      }
    }
    else{
      alert("请先登录");
      window.location.href = BASE_URL+"/login.html";
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

  // function returnMessage(){//回复评论
  //   $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
  //     let value= $(this).parent().parent().children().first().val();
  //     if(value.length>0){
  //       let html=` <div class="ret_message_show"><span class="user_name">${JSON.parse(window.localStorage.data).username}</span><span class="ret_message_show_1">${value}</span></div>`;
  //       alert("回复成功");
  //       $(this).parent().parent().next().prepend(html);
  //       $(this).parent().parent().children().first().val("");
  //       $(this).parent().parent().children().first().next().children().html('300');
  //       $(this).parent().parent().hide();
  //     }
  //   })
  // }

function returnMessage(){//回复评论
    $(".pubic_commet_1").off().on('click','.commit_comment_1',function(){
      var username = sessionStorage.getItem("username");
      let value= $(this).parent().parent().children().first().val();
      if(username)
      {
      if(value.length>0){
        $.ajax({                                    //回复评论的ajax请求   需要所有的评论，以及评论的总个数
          type:'POST',
          url:BASE_URL+"/playlistDetail.html/retmessage",
          data:{
              dissid:window.location.search.split("=")[1],//歌曲id
              nick:$(this).parent().parent().parent().children('.user').text(),//主评论
              commentid:$(this).parent().parent().parent().children(".comment_2").attr("value"),//主评论id
              replydNick:username,//回复评论name
              subcommentcontent: $(this).parent().parent().children().first().val()//回复评论内容

          },
          datatype:'JSON',
          crossDomain:true,
          success:function(result){//目前是直接在当前节点插入显示，后期可以调整为局部刷新。
               alert("回复成功");
            // showAssess(result.comment,result.comment_num)//显示评论
              $(this).parent().parent().children().first().val("");
              $(this).parent().parent().children('.count_comment_1').children('.count').html("300");
              // showAssess(result.comment,result.comment_num)//显示评论
              options={
                  "id":"page1",//显示页码的元素
                  "data":result,//显示数据
                  "maxshowpageitem":5,//最多显示的页码个数
                  "pagelistcount":5,//每页显示数据个数
                  "callBack":function(rr){
                      showAssess(rr,result.length);
                  }
              };
               page1.init(result.length,1,options);//评论部分的分页
              //ulAlignCenter1(result.length,1,options);
            //  window.location.reload();
          }
      })
      }
}
    else{
      alert("请先登录");
      window.location.href = BASE_URL+"/login.html";
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

  //统计字符
  var getLength = function (str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  };
  // 截取字符串
  // str:要截取的字符串
  // len:需要截取的长度
  function cutstr(str, len) {
    // str =str.replace(/\s+/g,"&lt;br&gt;");
     // str.replace("\\n", " \n ");
     var str_length = 0;
     var str_len = 0;
     str_cut = new String();
     str_len = str.length;
     for (var i = 0; i < str_len; i++) {
      a = str.charAt(i);
      str_length++;
      if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_length++;
              }
              str_cut = str_cut.concat(a);
              if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
              }
            }
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str_length < len) {
          return str;
        }
      }
