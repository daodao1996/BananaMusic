var triangleClick = 1;
var musicListData = [{}];
var musicListComment = "";
var songList = "";
var musicListAmount = "";
var songAmount = "";
var remarkAmount = 0;
var user = {};
var currentId = 0;
var shareCount = 0;
var is = 1;
var musicList = "";
var uname=sessionStorage.getItem("username");
var did = window.location.search.split("=")[1];
var didis = 0;
//var uname="ZAT";
const BASE_URL = "http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";
window.onload = function () {
    if(!sessionStorage.getItem("username"))
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    initUser();
    loadMusicListData();
    ifLogged();
    //$(".musicListid[value='+did+']").parent().click();
};

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
        $("#nav-login a").attr("href","/mymusic-not_logged.html");
    }
}

function toSearch(){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
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

$("#nav-mymusic").click(function () {
    window.location.href=BASE_URL+"/mymusic.html";
});

$("#nav-music").click(function () {
    window.location.href=BASE_URL+"/playlist.html";
});


function initUser() {
    $.ajax({
        type:"POST",
        url: BASE_URL+"/editPlaylist.html/userInfo",
        data: {"username":uname},
        dataType: "json",
        crossDomain:true,
        success: function (data) {
            console.log(data);
            //$("#img-userIcon").src(data.user_pic);
           document.getElementById("img-userIcon").setAttribute("src",data.user_pic);
            $("#accountCreateTime").val(data.createTime+" 创建");
            $("#p-ownerName").text(data.username);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.readyState);
        },

    });
}
//加载用户
function loadMusicListCommentData(play) {
    // alert("reloadComment");
    musicListComment="";
    remarkAmount=0;
    $.each(play["comment"], function (u, comment) {
        if (comment['middleCommentContent'] != null) {
            if (comment['middleCommentContent'] != null) {

                    musicListComment = musicListComment +
                        `<div class="div-remark" id="div-remark${u}">
                    <input type="hidden" value="${comment['commentid']}" class="comment_id">
                    <ul>
                        <li>
                            <p class="p-remarkContent"><span class="span-uname">${comment['nick']}</span>:${comment['rootCommentContent']}</p>
                        </li>`;
                         $.each(comment['middleCommentContent'], function (t, middleComment) {
                             musicListComment = musicListComment +
              `<li>
                   <p class="p-replayContent">回复 : ${middleComment["replyedNick"]}:${middleComment["subcommentcontent"]}</p>
              </li>`
               })
                musicListComment = musicListComment +`<li>
                        <div class="div-remarkOperation">
                            <p class="p-deleteRemark">删除</p> |
                            <p class="p-replyRemark">回复</p>
                        </div>
                        </li>
                    </ul>
                    </div>`;

            }
            remarkAmount = u+1;
        }
        else {
            musicListComment = musicListComment +
                `<div class="div-remark" id="div-remark${u}">
                    <input type="hidden" value="${comment['commentid']}" class="comment_id">
                    <ul>
                        <li>
                            <p class="p-remarkContent"><span class="span-uname">${comment['nick']}</span>:${comment['rootCommentContent']} </p>
                        </li>
              <li>
                        <div class="div-remarkOperation">
                            <p class="p-deleteRemark">删除</p>|
                            <p class="p-replyRemark">回复</p>
                        </div>
                        </li>
                    </ul>
                    </div>`;
            remarkAmount = u+1;
        }

    });
    $('#div-remarkContent').html(musicListComment);
    $("#p-remarkAmount").text("共" + remarkAmount + "条评论");
}                                                          //加载评论

function loadMusicListSongData(play) {
    songList = "";
    songAmount = 0;
    if (play["songlist"].length == 0) {
        $("#div-noMusic").show();
    }
    else {
        $("#div-noMusic").hide();
    }
    $.each(play["songlist"], function (j, song) {
        var st = song['songTime'];
        var h = st / 60;
        h = parseInt(h);
        var m = st % 60;

        function p(s) {
            return s < 10 ? '0' + s : s;
        }

        h = p(h);
        m = p(m);
        songList = songList +
            `<tr id="song${j}"><input type="hidden" value="${song["songmid"]}" class="songid">
                                  <td><p class="p-num">${j + 1}</p><a href="${BASE_URL}/songDetail.html?songmid=${song["songmid"]}"><img src="img/play10.png" class="img-playIcon"></a></td>
                                  <td><a href="javascript:void(0);" class="a-songname">${song['songname']}</a></td>
                                  <td><a href="javascript:void(0);" class="a-singer_name">${song['singer_name']}</a></td>
                                  <td>${h}:${m}</td>
                                  <td><img src="img/delete.png" class="img-deleteIcon"></td>
                             </tr>`;
        songAmount = j+1;
    });
    $(".table-data").html(songList);
    $("#p-musicAmount").text(songAmount + "首歌");
}                                                             //加载歌曲

function loadMusicListDataSub(data) {
    $(".div-collapse-content:gt(0)").remove();
    musicList="";
    is=1;
    fl=0;

    didis=0;
    // alert(did);
    $.each(data, function (i, play) {
            if (play["dissname"] == "我喜欢的音乐") {
                // alert("123");
                var ur = "url('" + play['imgurl'] + "')";
                $(".div-background").css("background-image", ur);
                $("#div-musicList-0").find(".li-musicListSongAmount").html(play["songlist"].length + "首歌");
                $("#div-musicList-0").find(".musicListid").attr("value", play["dissid"])
                fl=0;
                if(didis==0){
                  $("#div-musicListCover img").attr("src", "../img/heart1.png");
                  $("#div-musicListCover img").css("opacity","0.6");
                }

                // alert(1);
            }
            else {
              // alert(2);
              fl=is;
                musicList = musicList +
                    `<div class="div-collapse-content" id="div-musicList-${is}">
                     <input type="hidden" class="musicListid" value="${play["dissid"]}">
                <img src="${play["imgurl"]}" class="img-collapse-musicListCover">
                <ul>
                    <li class="li-musicListName">${play["dissname"]}</li>
                    <li class="li-musicListSongAmount">${play["songlist"].length}首歌</li>
                </ul>
                <div class="div-collapse-musicListOperation">
                    <img src="img/edit.png" class="img-collapse-editIcon">
                    <img src="img/delete.png" class="img-collapse-deleteIcon">
                </div>
            </div>`;
            }

        if(play["dissid"] == did){
          var sta="";
          if(play['state']=="public")
          {
            sta="已分享";
          }
          else{
            sta="分享";
          }
          $("#button-shareMusicList").find("#p-shareMusicList").text(sta);

            if (play["songlist"].length == 0) {
                $("#div-noMusic").show();
            }
            else {
                $("#div-noMusic").hide();
            }
            $("#p-musicListName").text(play['dissname']);
            $("#p-textarea").text(play["desc"]);
            // alert(didis);
            if(play["dissname"] != "我喜欢的音乐")
            {
                $("#div-musicListCover img").attr("src", play['imgurl']);
                $("#div-musicListCover img").css("opacity","1");
            }
            $("#p-createTime").text(`${play["createTime"]} 创建`);

            loadMusicListSongData(play);

            loadMusicListCommentData(play);
            didis=fl;
            currentId=didis;
            // alert(didis);
        }
            is++;
        // didis = is-1;
    });
    musicListAmount = is-1;
    $('#div-musicList-0').after(musicList);
    $("#div-musicList-"+didis).find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
    $('#p-musicListAmount').text(musicListAmount);
}                                                              //加载歌单

function loadMusicListData() {
    $.ajax({
        type:"POST",
        url: BASE_URL+"/editPlaylist.html/allPlaylist",
        data: {"username":uname},
        success: function (data) {
            if(data===null){
                var act=$("#accountCreateTime").val();
                $("#p-musicAmount").text("0首歌");
                $("#p-remarkAmount").text("共0条评论");
                $("#p-ownerName").text(uname);
                $("#p-createTime").text(act);
                $("#div-noMusic").show();

            }
            else {
                loadMusicListDataSub(data);
            }
        },
        dataType: "json"
    });
}                                                                     //加载页面

$(".div-collapse").on("click", ".div-collapse-content", function () {
    var iid = $(this).attr("id");
    var i = parseInt(iid.slice(14));
    $("#div-musicList-" + currentId).find(".li-musicListName,.li-musicListSongAmount").css("color", "#333");
    currentId = i;
    var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
    $.ajax({
        type:"POST",
        url: BASE_URL+"/editPlaylist.html/OnePlaylist",
        data: {"dissid":dissid},
        success: function (play) {
            $("#p-musicListName").text(play['dissname']);
            $("#p-textarea").text(play["desc"]);
            var sta="";
            if(play['state']=="public")
            {
              sta="已分享";
            }
            else{
              sta="分享";
            }
            $("#button-shareMusicList").find("#p-shareMusicList").text(sta);
            // $("#div-musicListCover img").attr("src", play['imgurl']);
            $("#p-createTime").text(`${play["createTime"]} 创建`);

            if(play["dissname"] != "我喜欢的音乐")
            {
                $("#div-musicListCover img").attr("src", play['imgurl']);
                $("#div-musicListCover img").css("opacity","1");
            }
            else{
                $("#div-musicListCover img").attr("src", "../img/heart1.png");
                $("#div-musicListCover img").css("opacity","0.6");
                var ur = "url('" + play['imgurl'] + "')";
                $(".div-background").css("background-image", ur);
            }
            loadMusicListSongData(play);
            loadMusicListCommentData(play);
        },
        dataType: "json"
    });
    if (songAmount[i] == 0) {
        $("#div-noMusic").show();
    }
    else {
        $("#div-noMusic").hide();
    }
    $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
})                             //歌单切换

function initTime() {
    function p(s) {
        return s < 10 ? '0' + s : s;
    }
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    return year + '-' + p(month) + "-" + p(date);
}                                                                              //获取时间

$(".div-collapse-top").on("click", function () {
    if (triangleClick % 2 == 1) {
        $(this).find(".div-triangle-collapse").css({"border-color": "#fff #fff #fff #333", "top": "0px"});
    }
    else {
        $(this).find(".div-triangle-collapse").css({"border-color": "#333 #fff #fff #fff", "top": "3px"});
    }
    triangleClick++;
})                                                  //三角形

$(".div-collapse").on("mouseover mouseout", '.div-collapse-content', function (event) {
    var iid = $(this).attr("id");
    var i = parseInt(iid.slice(14));
    if (event.type == "mouseover") {
        $(this).find(".div-collapse-musicListOperation").find("img").show();
        if (i != currentId) {
            $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
        }
    } else if (event.type == "mouseout") {
        $(this).find(".div-collapse-musicListOperation").find("img").hide();
        if (i != currentId) {
            $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#333");
        }
    }
});          //歌单操作

$("#img-editMusicListIntro").on("click", function () {
    var a = $(this);
    layer.open({
        type: 2,
        title: ['歌单简介', 'background-color:#ff9800;color:white;'],
        area: ['500px', '275px'],
        content: ['subHtml/editTextarea.html', 'no'],
        skin: 'layer-add',
        btnAlign: 'c',
        success: function (layero, index) {
            var body = layer.getChildFrame('body', index);
            var t = $('#p-textarea').text();
            body.find('#t1').text(t);
        },
        btn: ['确定', '取消'],
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var tvalue = body.find('#t1').val();
            if (tvalue == "") {
                tvalue = "说点什么吧";
            }
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
            var musicListDetail = {
                "dissid": dissid,
                "desc": tvalue
            };
            $.ajax({
                type:"POST",
                url: BASE_URL+"/editPlaylist.html/editMusicListIntro",
                data: musicListDetail,
                dataType: "text",
                success:function(data){
                    $('#p-textarea').text(data);
                }
            });
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                                            //歌单简介

$(".div-collapse").on("click", ".img-collapse-editIcon", function () {
    var a = $(this);
    var iid = $(this).parent().parent().attr("id");
    var i = parseInt(iid.slice(14));
    layer.open({
        type: 2,
        title: ['重命名', 'background-color:#ff9800;color:white;'],
        area: ['500px', '275px'],
        content: ['subHtml/add.html', 'no'],
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var tvalue = body.find('input').val();
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
            var musicListDetail = {
                "dissid": dissid,
                "dissname": tvalue
            }
            $.ajax({
                type:"post",
                url: BASE_URL+"/editPlaylist.html/editMusicListName",
                data: musicListDetail,
                dataType: "text",
                success:function (data) {
                    a.parent().parent().find(".li-musicListName").text(data);
                    if(currentId==i){
                        $("#p-musicListName").text(data);
                    }
                }
            });
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                            //歌单重命名

$(".div-collapse").on("click", ".img-collapse-deleteIcon", function () {
    var a = $(this);
    layer.open({
        title: ['删除歌单', 'background-color:#ff9800;color:white;'],
        area: ['275px', '175px'],
        content: '确定要删除么?',
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
            var musicListDetail = {
                "dissid": dissid,
                "creatorName":uname
            }
            $.ajax({
                type:"post",
                url: BASE_URL+"/editPlaylist.html/deleteMusicList",
                data: musicListDetail,
                dataType: "json",
                success:function (data) {
                  did=$("#div-musicList-0").find(".musicListid").val();
                    loadMusicListDataSub(data);
                }
            });
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                          //删除歌单

$("#div-remarkContent").on("click", ".p-deleteRemark", function () {
    var a = $(this);
    layer.open({
        title: ['删除评论', 'background-color:#ff9800;color:white;'],
        area: ['275px', '175px'],
        content: '确定要删除么?',
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var commentid = a.parent().parent().parent().parent().find(".comment_id").attr("value");
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");

            var commentDetail = {
                "commentid": commentid,
                "dissid": dissid
            }
            $.ajax({
                type:"post",
                url: BASE_URL+"/editPlaylist.html/deleteRemark",
                data: commentDetail,
                dataType: "json",
                success:function (play) {
                    loadMusicListCommentData(play);
                }
            });
            a.parent().parent().parent().parent().remove();
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                              //删除评论

$("#div-remarkContent").on("click", ".p-replyRemark", function () {
    var a = $(this);
    layer.open({
        type: 2,
        title: ['回复评论', 'background-color:#ff9800;color:white;'],
        area: ['500px', '325px'],
        content: ['subHtml/reply.html', 'no'],
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var tvalue = body.find('textarea').val();
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
            var commentid = a.parent().parent().parent().parent().find(".comment_id").attr("value");
            var replyCommentDetail = {
                "nick": uname,
                "rootCommentContent": tvalue,
                "dissid": dissid,
                "commentid": commentid
            }
            $.ajax({
                type:"post",
                url: BASE_URL+"/editPlaylist.html/replyRemark",
                data: replyCommentDetail,
                dataType: "json",
                success:function (play) {
                    loadMusicListCommentData(play);
                }
            });
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                               //回复评论

$("#button-addMusicList").on("click", function () {
    layer.open({
        type: 2,
        title: ['新建歌单', 'background-color:#ff9800;color:white;'],
        area: ['500px', '275px'],
        content: ['subHtml/add.html', 'no'],
        skin: 'layer-add',
        btn: ['新建', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var tvalue = body.find('input').val();
            if (tvalue == "") {
                tvalue = "未命名";
            }
            var mtime = initTime();
            var newMusicList = {
                "dissname": tvalue,
                "creatorName": uname,
                "createDate": mtime
            }
            $.ajax({
                type:"post",
                url: BASE_URL+"/editPlaylist.html/addMusicList",
                data: newMusicList,
                dataType: "json",
            success:function(data){
                   loadMusicListDataSub(data);
            }
            });
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                                               //添加歌单

$(".table-data").on("click", ".img-deleteIcon", function () {
    var a = $(this);
    layer.open({
        title: ['删除歌曲', 'background-color:#ff9800;color:white;'],
        area: ['275px', '175px'],
        content: '确定要删除么?',
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var num = $('#p-musicAmount').text();
            var nm = parseInt(num);
            nm--;
            $('#div-musicList-' + currentId).find(".li-musicListSongAmount").text(nm.toString() + "首歌");
            var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
            var songmid = a.parent().parent().find(".songid").attr("value");
            var songdetail = {
                "songmid": songmid,
                "dissid": dissid
            }
            $.ajax({
                type:"post",
                url:BASE_URL+ "/editPlaylist.html/deleteSong",
                data: songdetail,
                dataType: "json",
                success:function(play){
                    console.log(play);
                    loadMusicListSongData(play);
                    // alert(play['imgurl']+" "+play["dissname"]);s
                    if(play["dissname"] != "我喜欢的音乐")
                    {
                        $("#div-musicListCover img").attr("src", play['imgurl']);
                        $("#div-musicListCover img").css("opacity","1");
                    }
                    else{
                        $("#div-musicListCover img").attr("src", "../img/heart1.png");
                        $("#div-musicListCover img").css("opacity","0.6");
                        var ur = "url('" + play['imgurl'] + "')";
                        $(".div-background").css("background-image", ur);
                    }
                    $("#div-musicList-"+currentId).find(".img-collapse-musicListCover").attr("src", play["imgurl"]);

                }
            });
            a.parent().parent().remove();
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
})                                     //删除歌曲

$("#div-remarkContent").on("mouseover mouseout", '.div-remarkOperation p', function (event) {

    if (event.type == "mouseover") {
        $(this).css("color", "#ff9800");
    } else if (event.type == "mouseout") {
        $(this).css("color", "#333");
    }
});    //评论操作

$("#button-shareMusicList").on("click", function () {
    if ($(this).find("#p-shareMusicList").text()=="分享") {
        $(this).find("#p-shareMusicList").text("已分享");
        var state = {
            "state": "public",
            "dissid":$("#div-musicList-" + currentId).find(".musicListid").attr("value")
        }
        $.ajax({
            type:"post",
            url: BASE_URL+"/editPlaylist.html/shareMusicList",
            data: state
        });
    }
    else {
        $(this).find("#p-shareMusicList").text("分享");
        var state = {
            "state": "private",
            "dissid":$("#div-musicList-" + currentId).find(".musicListid").attr("value")
        }
        $.ajax({
            type:"post",
            url: BASE_URL+"/editPlaylist.html/shareMusicList",
            data: state
        });
    }

})                                             //分享歌单
