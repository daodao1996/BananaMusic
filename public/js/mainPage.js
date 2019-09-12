let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";
window.onload=function(){
    hotajax();
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

function jumpLogin() {
    window.location.href=BASE_URL+"/login.html";
};
function jumpSearchResult(){
    let text =document.getElementById("keyword0");
    console.log(text);
    if(text.value!=""){
    window.location.href=encodeURI(BASE_URL+'/searchResult.html?keyword='+text.value);
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

function creat_list1(list1){
    let str="";
    for(let i in list1){

        if(i%4==0){
            str=str+`<div class="hots" style="position:relative;"> 
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}"><img src="${list1[i].song_pic}" alt="" width="203px" height="203px"/></a>
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}" style="color: #484444"><p align="center" style="margin: 10px auto 0 auto">${list1[i].songname}</p></a>
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}"><img style="position:absolute;bottom:0px;" src="./img/play(2).png"></a>
</div>`;
        }
        else
            str=str+`<div class="hots" style="position:relative;margin-left: 58px"> 
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}"><img src="${list1[i].song_pic}" width="203px" height="203px" alt=""/></a>
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}" style="color: #484444"><p align="center" style="margin: 10px auto 0 auto">${list1[i].songname}</p></a>
<a href="${BASE_URL}/songDetail.html?songmid=${list1[i].songmid}"><img style="position:absolute;bottom:0px;" src="./img/play(2).png"></a>
</div>`;
    }
    $("#hotdiv").html(str)
}

function hotajax(){
    $.ajax({
        type:"GET",
        url:BASE_URL+"/mainPage.html/hot",
        datatype:"JSON",
        crossDomain:true,
        success:function(result){
            creat_list1(result);}
    });
}


