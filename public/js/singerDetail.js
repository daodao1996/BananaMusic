
let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

$(document).ready(function(){

	//已关注

  //淡入播放键
  $('.album-photo').hover(function(){
    $(this).find('.photo-play').fadeIn(500);
  });

  //淡出播放键
  $('.album-photo').on('mouseout',function(){
    $(this).find('.photo-play').fadeOut(500);
  });


  //人物的更多介绍
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

  // //更多
  // $("#song-to-more").on('click',function(){//歌曲的更多
  //   if(Math.ceil(songList.length/10) <= 5)
  //   {
  //     $('.page').css("width",90 + Math.ceil(songList.length/10) * 45 + 'px');
  //   }
  //   else{
  //     $('.page').css("width",'315px')
  //   }
  //   page.init(songList.length,1,options1);
  //   $('.song .chapter-head').css("display",'none');
  //   $('.song-detail .chapter-head').css('display','block');
  //   $('#song-page').css('display','block');
  //   $('.album').css('display','none');
  // });
  $("#song-to-more").on('click',function(){
    // alert( $("#song_tbody").children("tr").length);
    if( $("#song_tbody").children("tr").length>=10){
      for(let i=10;i<=$("#song_tbody").children("tr").length;i++){
        $("#song_tbody tr:eq("+i+")").show();
      }
      $("#song-page").show();
    }
    //    if(Math.ceil(songList.length/10) <= 5)
    // {
    //   $('.page').css("width",90 + Math.ceil(songList.length/10) * 45 + 'px');
    // }
    // else{
    //   $('.page').css("width",'315px')
    // }
    // let value=$("#song_tbody").children("tr").length;
    //  pageSinger.init(value,1,options1);
    $('.song .chapter-head').css("display",'none');
    $('.song-detail .chapter-head').css('display','block');
    $('#song-page').css('display','block');
    // $('.album').css('display','none');
  });


  $("#album-to-more").on('click',function(){//专辑的更多

    if(album.length/10+1 <= 5)
    {
      $('.page').css("width",90 + Math.ceil(album.length/10) * 45 + 'px');
    }
    else{
      $('.page').css("width",'315px')
    }

    for(let i = 3; i < $(".album-item").length; i++)
    {
      $("#row" + i).show();
    }
    $("#album-page").show();

    pageSinger.init(album.length,1,options2);
    $('.song').css('display','none');
    $('#album-head-title').text( $('#album-head-title').text()+ " " + data.album_num )
    $('#album-page').css('display','block');
  });
});


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

//   var options2={
//     "type":"album",
//   "id":"album-page",//显示页码的元素
//   "data":album,//显示数据
//     "maxshowpageitem":5,//最多显示的页码个数
//     "pagelistcount":10,//每页显示数据个数
//     "callBack":function(result){
//     let html = "";
//     for(let i = 0  ; i < result.length/2 ; i ++)
//     {
//       html += `<div class="album-row" id="row${i}">`;
//       for(let j = 0 ; j < 2 ; j++)
//       {
//         if(result.length <= 2 * i + j)
//         {
//           break;
//         }
//         html += `<div class="album-item" id="item{2*i+j}">
//       <div class="album-photo">
//       <div class="album-img">
//       <a href="javascript:;">

//       <img src= ${result[2*i+j].album_pic} width="150px"></a></div>
//       <a href="" class="photo-play">
//       <img src="../img/图片播放.png" width="45px" height="45px"></a>
//               </div>
//       <div class="album-intro">
//       <div class="album-intro-title">
//       <a href=""><p>${result[2*i+j].albumName}</p></a>
//       </div>
//       <div class="album-intro-left">
//       <p>唱片公司:</p>
//       <p>发行时间:</p>
//       <p>语&nbsp;&nbsp;言:</p>
//       </div>
//       <div class="album-intro-right">
//       <p>${result[2*i+j].lan}</p>
//       <a href=""><p>${result[2*i+j].company}</p></a>
//       <p>${result[2*i+j].aDate}</p>

//       </div>
//       </div>
//       </div>`
//       }
//       html += `</div><div class="album-line"><hr></div>`
//     }
//     $(".album-list").html(html);
//     }
// };

let options1={};
let options2={};
  window.onload = function(){//绑定多个事件
  	// createSongList(songList,songList.length);
  	// createIntro(data);
   //  createalbum(album,6);

      createSinger();
      ifLogged();
  };


  // 需要歌曲列表{song_mid: 'ITEM0001',songname: '不爱我就拉倒',albumname: '不爱我就拉倒',song_time:245}
  // 专辑列表 {albumMID:"ALBUM0001",albumName:"不爱我就拉倒",company:",aDate:,lan,album_pic}

  function createSinger() {//介绍，歌曲，专辑 //歌手的所有信息
  //  console.log(window.location.search.split("=")[1]);
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/singerDetail.html",
        data: {
            singer_mid: window.location.search.split("=")[1]
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
          if(result == "no singer")
          {
            $('.my-container').css('display','none');
            $('.no-singer').css('display','block');
            $('.no-singer a').attr('href',document.referrer);
          }
          else{
            $('.to-show').html( "<h3>歌手简介</h3><p>" + result.singer_info +"</p>");
              createIntro(result);
              getSongList();
              getAlbumInfo();
          }

         // createSongList(window.location.search.split("=")[1]);
           //console.log(result);
           // createIntro(result);
           // getSongList(window.location.search.split("=")[1]);
           // getAlbumInfo(result.album_list)
        }
    });
}

function getSongList() {
  $.ajax({                  //发表评论的ajax请求 需要歌曲列表{song_mid: 'ITEM0001',songname: '不爱我就拉倒',albumname: '不爱我就拉倒',song_time:245}
      type: 'POST',
      url: BASE_URL + "/singerDetail.html/songlist",
      data: {
          singer_mid:window.location.search.split("=")[1],
      },
      datatype: 'JSON',
      crossDomain: true,
      success: function (data) {
         options1={
          "type":"song",
        "id":"song-page",//显示页码的元素
        "data":data,//显示数据
        "maxshowpageitem":5,//最多显示的页码个数
          "pagelistcount":20,//每页显示数据个数
          "callBack":function(result){
            var html="";
            for(let i in result){
            html=html+`<tr><td class="song-order">${Number(i)+1}</td>
            <td id="little-btn-play"><a href="${BASE_URL}/songDetail.html?songmid=${result[i].songmid}">${result[i].songname}</a><a href="${BASE_URL}/songDetail.html?songmid=${result[i].songmid}"><img  src="../img/播放_hover.png"></a></td>
            <td><a href="${BASE_URL}/album.html?albumMID=${result[i].albumMID}">${result[i].albumname}</a></td>
            <td>${changeToSeconds(result[i].song_time)}</td></tr>`;
          }
          $("#song_tbody").html(html);
          }
        };
          createSongList(data,data.length);
      }
  });
}

function getAlbumInfo() {
    $.ajax({                                   //发表评论的ajax请求 需要 专辑列表,根据singerid把歌手的所有的专辑穿过来 {albumMID:"ALBUM0001",albumName:"不爱我就拉倒",company:",aDate:,lan,album_pic}
        type: 'POST',
        url: BASE_URL + "/singerDetail.html/albumInfo",
        data: {
          singer_mid:window.location.search.split("=")[1],
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (data) {
           options2={
    "type":"album",
  "id":"album-page",//显示页码的元素
  "data":data,//显示数据
    "maxshowpageitem":5,//最多显示的页码个数
    "pagelistcount":10,//每页显示数据个数
    "callBack":function(result){
    let html = "";
    for(let i = 0  ; i < result.length/2 ; i ++)
    {
      html += `<div class="album-row" id="row${i}">`;
      for(let j = 0 ; j < 2 ; j++)
      {
        if(result.length <= 2 * i + j)
        {
          break;
        }
        html += `<div class="album-item" id="item${2*i+j}">
      <div class="album-photo">
      <div class="album-img">
      <a href="javascript:;">

      <img src= ${result[2*i+j].album_pic} width="150px"></a></div>
       <a href="${BASE_URL}/album.html?albumMID=${result[2*i+j].albumMID}" class="photo-play">
      <img src="../img/图片播放.png" width="45px" height="45px"></a>
              </div>
      <div class="album-intro">
      <div class="album-intro-title">
      <a href="${BASE_URL}/album.html?albumMID=${result[2*i+j].albumMID}"><p>${result[2*i+j].albumName}</p></a>
      </div>
      <div class="album-intro-left">
      <p>唱片公司:</p>
      <p>发行时间:</p>
      <p>语&nbsp;&nbsp;言:</p>
      </div>
      <div class="album-intro-right">
      <p>${result[2*i+j].lan}</p>

      <p>${result[2*i+j].aDate}</p>
      <p>${result[2*i+j].company}</p>

      </div>
      </div>
      </div>`
      }
      html += `</div><div class="album-line"><hr></div>`
    }
    $(".album-list").html(html);
    }
};
            createalbum(data);
        }
    });
}



  function createIntro(data){
    // $(".head-photo").css("background","url(" + data.singer_pic + ") no-repeat");
    let html1=`<img src="${data.singer_pic}">`;
    $(".head-photo").html(html1);
    $('.head-name').text(data.singer_name)
    $("#song-left").text(data.song_num);
    $(".song-detail .chapter-head").text($(".song-detail .chapter-head").text() + data.song_num);
  	$("#song-right").text(data.album_num);
  	//console.log(data.singer_info);
  	if(data.singer_info === null){
  	    $("#singer_info").hide();
    }else{
        $(".singer-intro").text(cutstr(data.singer_info,176));
    }
    let username=sessionStorage.getItem("username");
      console.log("2");
      console.log(data.fans);
  	if(data.fans && data.fans.indexOf(username)!==-1){
  	    console.log("1");
  	    $("#followed1").show();
  	    $("#followed2").hide();
    }
  }

  function createSongList(songList,num){//创建表格加载10条数据点击更多前
    let html="";
  	for(let i = 0 ; i <  num ; i++){
      if(i>9){
        html=html+`<tr style="display:none;"><td class="song-order">${i+1}</td>
        <td id="little-btn-play"><a href="${BASE_URL}/songDetail.html?songmid=${songList[i].songmid}">${songList[i].songname}</a><a href="${BASE_URL}/songDetail.html?songmid=${songList[i].songmid}"><img  src="../img/播放_hover.png"></a></td>
        <td><a href="${BASE_URL}/album.html?albummid=${songList[i].albumMID}">${songList[i].albumname}</a></td>
        <td>${changeToSeconds(songList[i].song_time)}</td></tr>`;
      }else{
        html=html+`<tr><td class="song-order">${i+1}</td>
        <td id="little-btn-play"><a href="${BASE_URL}/songDetail.html?songmid=${songList[i].songmid}">${songList[i].songname}</a><a href="${BASE_URL}/songDetail.html?songmid=${songList[i].songmid}"><img  src="../img/播放_hover.png"></a></td>
        <td><a href="${BASE_URL}/album.html?albummid=${songList[i].albumMID}">${songList[i].albumname}</a></td>
        <td>${changeToSeconds(songList[i].song_time)}</td></tr>`;
      }
  }
    $("#song_tbody").html(html);
  }

//   var options1={
//     "type":"song",
//   "id":"song-page",//显示页码的元素
//   "data":songList,//显示数据
//   "maxshowpageitem":5,//最多显示的页码个数
//     "pagelistcount":10,//每页显示数据个数
//     "callBack":function(result){
//       var html="";
//       for(let i in result){
//       html=html+`<tr><td class="song-order">${Number(i)+1}</td>
//       <td id="little-btn-play"><a href="">${result[i].songname}</a><a href=""><img  src="../img/播放_hover.png"></a></td>
//       <td><a href="">${result[i].albumname}</a></td>
//       <td>${changeToSeconds(result[i].song_time)}</td></tr>`;
//     }
//     $("#song_tbody").html(html);
//     }
// };

  function createalbum(album){
    let html = "";
    for(let i = 0  ; i < album.length/2 ; i ++)
    {
      if(i>2)
      {
        html +=`<div style= "display:none" class="album-row" id="row${i}">`;
      }
      html +=`<div class="album-row" id="row${i}">`;
      for(let j = 0 ; j < 2 ; j++)
      {
        if(2 * i + j >= album.length)
        {
          break;
        }
        html += `<div class="album-item" id="item${2*i+j}" >
      <div class="album-photo">
      <div class="album-img">
      <a href="${BASE_URL}/album.html?albummid=${album[2*i+j].albumMID}">
      <img src= ${album[2*i+j].album_pic} width="150px"></a></div>
      <a href="${BASE_URL}/album.html?albummid=${album[2*i+j].albumMID}" class="photo-play">
      <img src="../img/图片播放.png" width="45px" height="45px"></a>
              </div>
      <div class="album-intro">
      <div class="album-intro-title">
      <a href="${BASE_URL}/album.html?albummid=${album[2*i+j].albumMID}"><p>${album[2*i+j].albumName}</p></a>
      </div>
      <div class="album-intro-left">
      <p>语&nbsp;&nbsp;言:</p>
      <p>发行时间:</p>
      <p>唱片公司:</p>


      </div>
      <div class="album-intro-right">
      <p>${album[2*i+j].lan}</p>
      <p>${album[2*i+j].aDate}</p>
      <p>${album[2*i+j].company}</p>


      </div>
      </div>
      </div>`
      }
      html += `<div class="album-line"><hr></div>
      </div>`
    }
    $(".album-list").html(html);
  }


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


$('.btn-follow').on('click',function(){
    // $('.btn-follow').toggle();
    // $('.btn-follow img').attr('src','../img/已关注.png');
    let username=sessionStorage.getItem("username");
    let item=$(this).children().children("img").attr("src").split("/")[2];
    if(item==="关注.png"){
        if(username){
            $.ajax({
                type:"POST",
                url:BASE_URL+"/singerDetail.html/collectionsinger",
                data:{
                    singer_mid:window.location.search.split("=")[1],
                    username:username
                },
                datatype:'JSON',
                crossDomain:true,
                success:function(result){
                    $('.btn-follow').toggle();
                }
            })
        }else{
            alert("请先登录!!!");
            window.location.href=BASE_URL+"/login.html";
        }
    }


});
