
const BASE_URL = "http://bananamusic.s1.natapp.cc";//'http://127.0.0.1:9696';

window.onload = function(){
    if(!sessionStorage.getItem("username"))
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    loadUserInfo();
    getPlaylist();
    loadRecommend();
    ifLogged();
};

var optionsPlaylist={};
var optionsSinger = {};

$("#nav-search img").click(function (){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
});

$("#nav-logo").click(function () {
    window.location.href=BASE_URL+"/mainPage.html";
});

$("#nav-mainpage").click(function () {
   window.location.href=BASE_URL+"/mainPage.html";
});

$("#nav-singer").click(function () {
    window.location.href=BASE_URL+"/singer.html";
});
$("#nav-mymusic").click(function () {
    if(sessionStorage.getItem("username")){
        window.location.href=BASE_URL+"/mymusic.html";
    }else{
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    }
});
$("#nav-music").click(function () {
    window.location.href=BASE_URL+"/playlist.html";
});
$("#nav-login").click(function () {
    window.location.href=BASE_URL+"/login.html";
});

function ifLogged() {
    let uname = sessionStorage.getItem("username");
    if(uname !== null){
        $("#nav-login p").html("注销");
        $("#nav-login").click(function () {
            sessionStorage.removeItem("username");
            window.location.href=BASE_URL+"/mymusic-not_logged.html";
        });
    }
    else{
        $("#nav-login p").html("登录");
        $("#nav-login a").attr("href","/login.html");
    }
}
function loadUserInfo() {
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/mymusic.html/userInfo',
            data:{
                username:sessionStorage.getItem("username")
            },
            dataType:'JSON',
            crossDomain:true,
            success:function (data) {
                $("#user_photo span").text(data["username"]+" ");
                $("#user_photo>img").attr("src", data["user_pic"]);

                if(data["singer_id"].length >0){
                     optionsSinger = {
                        "id":"pageSinger",//显示页码的元素
                        "data":data["singer_id"],//显示数据
                        "maxshowpageitem":3,//最多显示的页码个数
                        "pagelistcount":4,//每页显示数据个数
                        "callBack":function(result){
                            showSinger(result);
                        }
                    };
                    pageSinger.init(data["singer_id"].length,1,optionsSinger);
                }
                else{
                    showSinger_null();
                    $("#pageSinger").hide();
                }
            }});
}

function getPlaylist() {
    $.ajax(
        {
            type:'POST',
            url:BASE_URL+'/mymusic.html/playlist',
            data:{
                username:sessionStorage.getItem("username")
            },
            dataType:'JSON',
            crossDomain:true,
            success:function (data) {
                if(data.length>0){
                    optionsPlaylist={
                        "id":"pagePlaylist",//显示页码的元素
                        "data":data,//显示数据
                        "maxshowpageitem":3,//最多显示的页码个数
                        "pagelistcount":4,//每页显示数据个数
                        "callBack":function(result){
                            showPlaylist(result);
                        }
                    };
                    page.init(data.length,1,optionsPlaylist);
                }
                else{
                    showPlaylist_null();
                    $("#pagePlaylist").hide();
                }
            }});
}

function loadRecommend() {
    $.ajax(
        {
            type:'GET',
            url:BASE_URL+'/mymusic.html/recommend',
            dataType:'JSON',
            crossDomain:true,
            success:function (data) {
                showRecommend(data);
            }});
}

function showPlaylist(data) {
    $('#playlist').empty();
    data.forEach(item => {
        let div1 = $(`<div class="col-sm-6 col-lg-3"></div>`);
        let div2=  $(`<div  class="myList" value="${item["dissid"]}"></div>`);
        let img = $(`<img src="${item["imgurl"]}"  class="img-responsive">`);
        let p = $(`<p>${item["dissname"]}</p>`);
        div2.click(function () {
            window.location.href = BASE_URL+'/myMusic-musicList.html?dissid='+item["dissid"];
        });
        div2.append(img);
        div2.append(p);
        div1.append(div2);
        $("#playlist").append(div1);
    });
}

function showPlaylist_null() {
    $('#playlist').empty();
    let p=$(`<a href="${BASE_URL}/mainPage.html" class="list_null"><p>还没有创建的歌单，戳这里发现好听的音乐创建属于自己的歌单</p></a>`);
    $("#playlist").append(p);
}

function showSinger_null() {
    $('#singer').empty();
    let p=$(`<a href="${BASE_URL}/singer.html" class="list_null"><p>还没有关注的歌手，戳这里发现感兴趣的歌手</p></a>`);
    $("#singer").append(p);
}

function showSinger(data) {
    $('#singer').empty();
    data.forEach(item => {
        let div1 = $(`<div class="col-sm-6 col-lg-3"></div>`);
        let div2=  $(`<div class="myList" value=${item["singer_mid"]}></div>`);
        div2.click(function () {
            window.location.href = BASE_URL+'/singerDetail.html?singermid='+item["singer_mid"];
        });
        div2.append($(`<img src="${item["singer_pic"]}"  class="img-responsive">`));
        div2.append($(`<p>${item["singer_name"]}</p>`));
        div1.append(div2);
        $("#singer").append(div1);
    })
}

function showRecommend(data) {
    $('#recommend').empty();
    data.forEach(item => {
        let div1 = $(`<div class="col-sm-6 col-lg-3"></div>`);
        let div2 = $(`<div class="myList" value=${item["songmid"]}></div>`);
        div2.click (function () {
            console.log("dianji");
            window.location.href = BASE_URL+'/songDetail.html?songmid='+item["songmid"];
        });
        div2.append($(`<img src="${item["song_pic"]}"  class="img-responsive">`));
        div2.append($(`<p>${item["songname"]}</p>`));
        div1.append(div2);
        $("#recommend").append(div1);
    })
}