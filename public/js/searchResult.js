
let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";
let options = {};
let type="";

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

window.onload = function () {
    ifLogged();

    if(window.location.search.split("=").length === 2){
        document.getElementById("keyword").value=decodeURI(window.location.search.split("=")[1]);
        document.getElementById("keyword0").value=decodeURI(window.location.search.split("=")[1]);
        searchMusic()
    }
    else{
        let tt = window.location.search.split("=")[1].split("&&")[0];
        document.getElementById("keyword").value=decodeURI(window.location.search.split("=")[2]);
        document.getElementById("keyword0").value=decodeURI(window.location.search.split("=")[2]);
        if(tt === "music")
            searchMusic();
        else if(tt === "playlist")
            searchPlaylist();
        else
            searchSinger();
    }

};

//播放、添加图标的隐藏和显示
function brandPicTurn() {
    $(".icon1").hide();
    $(".brand").hover(
        function () {
            $(this).children(".icon0").hide();
            $(this).children(".icon1").show();
        }
        , function () {
            $(this).children(".icon1").hide();
            $(this).children(".icon0").show();
        }
    );
}

function loadMusic_null() {
    $('#search_result').empty();
    let p = $(`<p class="list_null">很抱歉，暂时没有找到与您的搜索相关的结果</p><p class="list_null">布拿拿音乐建议你：请检查输入的关键字是否有误或过长</p>`);
    $("#search_result").css({"margin-top": "100px", "margin-bottom": "232px"});
    $("#search_result").append(p);
}

function searchResult(data) {
    let str = "<div id = \"result\">";
    for (let i in data) {
        if (i % 2 == 0) {
            str = str + `<div class = "one" onmouseover = "over1()" onmouseout = "out1()">
    <div class = "row" style = "margin-left: 26px">
    <div class = "col-sm-5">
    <a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}"><p id="word">${data[i].songname}</p></a>
    <div class = "img1">
    <div class = "brand">
    <img src = "./img/add0.png" class = "icon0" style = "margin-left: 20px;cursor: pointer" onclick="collection(this)" value="${data[i].songmid}">
    <img src = "./img/add1.png" class = "icon1"alt = "" style = "margin-left: 20px;cursor: pointer" onclick="collection(this)" value="${data[i].songmid}">
    </div>
    <div class = "brand">
    <a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}" class = "icon0"><img src = "./img/play0.png" style = "margin-left: 375px;"></a>
    <a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}" class = "icon1"><img src = "./img/play1.png" style = "margin-left: 375px;"></a>
    </div>
    </div>
    </div>
    <div class = "col-sm-3"><a href = "${BASE_URL}/singerDetail.html?singer_mid=${data[i].singer_mid}">${data[i].singer_name}</a></div>
<div class = "col-sm-3">${toHourMinute(parseInt(data[i].song_time))}</div>
</div>

</div>`;

        }
        else {
            str = str + `<div class = "two" onmouseover = "over2()" onmouseout = "out2()">
    <div class = "row" style = "margin-left: 26px">
    <div class = "col-sm-5"><a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}">${data[i].songname}</a>
    <div class = "img1">
    <div class = "brand">
    <img src = "./img/add0.png" class = "icon0" style = "margin-left: 20px;cursor: pointer" onclick="collection(this)" value="${data[i].songmid}">
    <img src = "./img/add1.png" class = "icon1" alt = "" style = "margin-left: 20px;cursor: pointer"onclick="collection(this)" value="${data[i].songmid}">
    </div>
    <div class = "brand">
    <a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}" class = "icon0"><img src = "./img/play0.png" style = "margin-left: 375px;"></a>
    <a href = "${BASE_URL}/songDetail.html?songmid=${data[i].songmid}" class = "icon1"><img src = "./img/play1.png" style = "margin-left: 375px;"></a>
    </div>
    </div>
    </div>
    <div class = "col-sm-3"><a href = "${BASE_URL}/singerDetail.html?singer_mid=${data[i].singer_mid}">${data[i].singer_name}</a></div>
<div class = "col-sm-3">${toHourMinute(parseInt(data[i].song_time))}</div>
</div>
</div>`;
        }
    }
    $("#result").html(str);
}

//
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

function reSearuchMusic() {
    if(window.location.search.split("=").length === 2) {
        window.location.reload();
    }else{
        window.location.href=BASE_URL+"/searchResult.html?type=music&&keyword="+window.location.search.split("=")[2];
    }
}

function searchMusic() {
    $("#music").css("color","#ff9800");
    $("#singer").css("color","#484444");
    $("#playlist").css("color","#484444");
    type="music";
    let kk = window.location.search.split("=");
    $.ajax({//搜索歌曲ajax请求
        type: 'POST',
        url: BASE_URL + "/searchResult.html/music",
        data: {
            keyword: decodeURI(kk[kk.length-1])
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            options = {
                "id": "page",//显示页码的元素
                "data": result,//显示数据
                "maxshowpageitem": 3,//最多显示的页码个数
                "pagelistcount": 15,//每页显示数据个数
                "callBack": function (res) {
                    $(document).ready(function () {
                        // 判断img轮转，实现a跳转
                        // 翻转效果
                        brandPicTurn();
                    });
                    searchResult(res);
                }
            };
            if (result != "") {
                page.init(result.length, 1, options);
                $(document).ready(function () {
                    // 判断img轮转，实现a跳转
                    // 翻转效果
                    brandPicTurn();
                });
            }
            else {
                loadMusic_null();
            }

        }
    })
}


function loadPlaylist_null() {
    $('#search_result').empty();
    $('#page').empty();
    let p = $(`<p class="list_null">很抱歉，暂时没有找到与您的搜索相关的结果</p><p class="list_null">布拿拿音乐建议你：请检查输入的关键字是否有误或过长</p>`);
    $("#search_result").css({"margin-top": "100px", "margin-bottom": "232px"});
    $("#search_result").append(p);
}

function showPlayList(data) {

    let str = "<div class = \"row\" style = \"text-align: center\">";
    for (let i in data) {
        str = str + `<div class = "col-xs-6 col-sm-6 col-lg-3">
                <div class = "result" value="${data[i].dissid}" onclick="">
                     <a href = "${BASE_URL}/playlistDetail.html?dissid=${data[i].dissid}"><img src = "${data[i].imgurl}" alt = "" width="200px" height="200px"></a>
                    <a href = "${BASE_URL}/playlistDetail.html?dissid=${data[i].dissid}"><p><nobr>${data[i].dissname}</nobr></p></a>
                </div>
            </div>`;
    }
    $("#search_result").html(str);
}


function searchPlaylist() {
    $("#playlist").css("color","#ff9800");
    $("#music").css("color","#484444");
    $("#singer").css("color","#484444");
    let kk = window.location.search.split("=");
    type="playlist";
    $.ajax({//搜索歌单ajax请求
        type: 'POST',
        url: BASE_URL + "/searchResult.html/playlist",
        data: {
            keyword: decodeURI(kk[kk.length-1])
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            options = {
                "id": "page",//显示页码的元素
                "data": result,//显示数据
                "maxshowpageitem": 3,//最多显示的页码个数
                "pagelistcount": 16,//每页显示数据个数
                "callBack": function (res) {
                    showPlayList(res);
                }
            };
            if (result != "") {
                page.init(result.length, 1, options);
            }
            else {
                loadPlaylist_null();
            }
        }
    })
}


function loadSingerlist_null() {
    $('#search_result').empty();
    $('#page').empty();
    let p = $(`<p class="list_null">很抱歉，暂时没有找到与您的搜索相关的结果</p><p class="list_null">布拿拿音乐建议你：请检查输入的关键字是否有误或过长</p>`);
    $("#search_result").css({"margin-top": "100px", "margin-bottom": "232px"});
    $("#search_result").append(p);
}

function showSingerList(data) {
    let str = "<div class = \"row\" style = \"text-align: center\">";
    for (let i in data) {
        str = str + `
    <div class = "col-sm-6 col-lg-3">
    <div class = "result" value="${data[i].singer_mid}" onclick="">
    <a href = "${BASE_URL}/singerDetail.html?singer_mid=${data[i].singer_mid}"><img src = "${data[i].singer_pic}" width="200px" height="200px" style="border-radius: 50%"></a>
    <a href = "${BASE_URL}/singerDetail.html?singer_mid=${data[i].singer_mid}"><p><nobr>${data[i].singer_name}</nobr></p></a></div>
</div>
`;
    }
    $("#search_result").html(str);
}

function search0(){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
}

function search1(){
    let text =document.getElementById("keyword");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?type=' + type + '&&keyword=' + text.value);
    }
}

function searchSinger() {
    $("#singer").css("color","#ff9800");
    $("#music").css("color","#484444");
    $("#playlist").css("color","#484444");
    type="singer";
    let kk = window.location.search.split("=");
    $.ajax({//搜索歌手ajax请求
        type: 'POST',
        url: BASE_URL + "/searchResult.html/singer",
        data: {
            keyword: decodeURI(kk[kk.length-1])
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            options = {
                "id": "page",//显示页码的元素
                "data": result,//显示数据
                "maxshowpageitem": 3,//最多显示的页码个数
                "pagelistcount": 16,//每页显示数据个数
                "callBack": function (res) {
                    showSingerList(res);
                }
            };
            if (result != "") {
                page.init(result.length, 1, options);
            } else {
                loadSingerlist_null();
            }
        }
    })
}

function collection(eve){//收藏
    let username=sessionStorage.getItem("username");
    if(username){
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
                    $.ajax({
                        type:"post",
                        data:{
                            "songmid":$(eve).attr("value"),//歌曲名
                            "dissid":tvalue,//歌单
                            // username:username//用户名
                        },
                        url:BASE_URL+"/searchResult.html/collection",
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

    }else{
        alert("请先登录");
        window.location.href=BASE_URL+"/login.html";
    }
}