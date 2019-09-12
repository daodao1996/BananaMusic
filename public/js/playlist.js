let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

window.onload = function(){
    playlist_click();
    ifLogged();
};

$("#nav-logo").click(function () {
    window.location.href=BASE_URL+"/mainPage.html";
});

$("#nav-mainpage").click(function () {
    window.location.href=BASE_URL+"/mainPage.html";
});

$("#nav-singer").click(function () {
    window.location.href=BASE_URL+"/singer.html";
});

$("#nav-music").click(function () {
    window.location.href=BASE_URL+"/playlist.html";
});
$("#nav-login").click(function () {
    window.location.href=BASE_URL+"/login.html";
});
$("#nav-mymusic").click(function () {
    if(sessionStorage.getItem("username")){
        window.location.href=BASE_URL+"/mymusic.html";
    }else{
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    }
});

$("#nav-search img").click(function (){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
});


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

function jiazai(data2){
  layui.use(['laypage', 'layer'], function(){
  var laypage = layui.laypage
  ,layer = layui.layer;
    laypage.render({
    elem: 'page_up_down'
	,layout: ['count', 'prev', 'page', 'next',  'skip']
    ,first: '首页'
    ,last: '尾页'
    ,prev: '<em>←</em>'
    ,next: '<em>→</em>'
    ,count: data2.length
    ,limit: 16
    ,theme: '#FF9800'
    ,jump: function(obj){
      //模拟渲染
      document.getElementById('singer_list').innerHTML = function(){
        // console.log(data2.length);
        var arr = []
        ,thisData = data2.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
        var x = 0;
        layui.each(thisData, function(index, item){
        //    console.log(item);
          //  console.log(x);
           if(((x+1)%4) != 0){
        arr.push(`<a href="${BASE_URL}/playlistDetail.html?dissid=${data2[(x+(obj.curr-1)*16)].dissid}"><li>`+`<img src=${data2[(x+(obj.curr-1)*16)].imgurl} style="width:100%;height:100%;"/>
                      <div class="text-style">${data2[(x+(obj.curr-1)*16)].dissname}</div></li></a>`);
          }
          else{
            arr.push(`<a href="${BASE_URL}/playlistDetail.html?dissid=${data2[(x+(obj.curr-1)*16)].dissid}"><li style="margin-right: 0px;">`+`<img src=${data2[(x+(obj.curr-1)*16)].imgurl} style="width:100%;height:100%;"/>
                      <div class="text-style">${data2[(x+(obj.curr-1)*16)].dissname}</div></li></a>`);
          }
          x++;

        });
        x = 0;
        // console.log(arr);
        return arr.join('');
      }();
    }
    
  });
});
}


function playlist_click(){
  $.ajax({
  type:"GET",
  url:BASE_URL+"/playlist.html/publiclist",
  datatype:'JSON',
  crossDomain:true,
  success:function(result){
      jiazai(result);
  }
  })
}
