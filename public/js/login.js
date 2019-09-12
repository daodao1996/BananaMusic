

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
function userLogin(user) {
    var uname = document.getElementById("username").value;
    console.log(uname);
    if (uname == "") {
        alert("用户名不能为空！")
    }
    else {
        var pass = document.getElementById("password").value;
        if (pass == "") {
            alert("密码不能为空！")
        }
    }

    var passwd = document.getElementById("password").value;
    if (user == "no user") {
        alert("该用户不存在！");
    } else {
        if (passwd != user.password) {
            alert("请输入正确的密码！");
        }
        else {
             sessionStorage.setItem("username",$("#username").val());
            alert("登录成功！")
             var lastUrl=document.referrer;
             location.href=lastUrl;
        }
    }
}
const BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

function jumpSearchResult(){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
};

function login() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/login.html",
        data: {
            username: document.getElementById("username").value
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
            console.log(result);
            userLogin(result);
        }
    })
}