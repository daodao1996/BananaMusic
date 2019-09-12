window.onload = function () {
    // initUser();
    loadMusicListData();
}
var is = 0;
currentId = 0;


const BASE_URL = "http://bananamusic.s1.natapp.cc";//'http://127.0.0.1:9696';

function loadMusicListData() {
    let username=sessionStorage.getItem("username");
    $.ajax({
        type: "post",
        data: {
            "username":username
        },
        url:BASE_URL+"/saveToMusicList.html",
        dataType: "json",
        crossDomain:true,
        success: function (data) {
            console.log(data);
            var musicList = "";
            is=1;
            $.each(data, function (i, play) {
                //console.log(play["creatorName"]);
                if (play["creatorName"] ==username) {
                    if (play["dissname"]=="我喜欢的音乐") {
                         console.log("1");
                        // console.log(play['imgurl']);
                        // console.log(play["songlist"].length + "首歌");
                        var u = "url('" + play['imgurl'] + "')";
                        $("#div-musicList-0").find(".div-background").css("background-image", u);
                        $("#div-musicList-0").find(".li-musicListSongAmount").html(play["songlist"].length + "首歌");
                        $("#div-musicList-0").find(".musicListid").attr("value", play["dissid"]);
                        $("#div-musicList-0").find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
                        $("#cid").val(play["dissid"]);
                    }
                    else {
                        console.log("2");

                        musicList = musicList +
                            `<div class="div-blank"></div><div id="div-musicList-${is}" class="div-content">
                     <input type="hidden" class="musicListid" value="${play["dissid"]}">
                    <img src="${play['imgurl']}" class="img-musicListCover">
                <ul>
                    <li class="li-musicListName">${play["dissname"]}</li>
                    <li class="li-musicListSongAmount">${play["songlist"].length}首歌</li>
                </ul>
            </div>`;
                    }
                    is++;
                }
            });
            $('#div-musicList-0').after(musicList);
        }
    })
}

function initTime() {
    function p(s) {
        return s < 10 ? '0' + s : s;
    }

    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    return year + '-' + p(month) + "-" + p(date);
}                                                                      //初始化时间

$("#div-container").on("click", '.div-content', function () {
    var iid = $(this).attr("id");
    var i = parseInt(iid.slice(14));
    $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
    $("#div-musicList-" + currentId).find(".li-musicListName,.li-musicListSongAmount").css("color", "#333");
    currentId = i;
    var dissid = $("#div-musicList-" + currentId).find(".musicListid").attr("value");
    $("#cid").val(dissid);
});                            //切换歌单，改变颜色

$("#div-container").on("mouseover mouseout", '.div-content', function (event) {
    var iid = $(this).attr("id");
    var i = parseInt(iid.slice(14));
    if (i != currentId) {
        if (event.type == "mouseover") {
            $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#ff9800");
        } else if (event.type == "mouseout") {
            $(this).find(".li-musicListName,.li-musicListSongAmount").css("color", "#333");
        }
    }
});          //鼠标悬浮,改变颜色

$("#div-container").on("click", '#img-add,#p-title', function () {//新建歌单
    layer.open({
        type: 2,
        title: ['新建歌单', 'background-color:#ff9800;color:white;'],
        area: ['320px', '143px'],
        content: ['subHtml/addSmall.html', 'no'],
        skin: 'layer-add',
        btn: ['确定', '取消'],
        shade: 0,
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
                "creatorName":sessionStorage.getItem("username"),
                "createTime": mtime
            }
            $.ajax({
                type:"POST",
                url: BASE_URL+"/saveToMusicList.html/addMusicList",
                data: newMusicList,
                dataType: "json"
            });
            console.log("3"+newMusicList);
           // loadMusicListData();
            window.location.reload();
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });
});                       //添加歌单
