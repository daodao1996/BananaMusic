let BASE_URL = "http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

$(document).ready(function () {
    ifLogged();
    //注册信息填写判断
    $('#defaultForm').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '！用户名无效',
                validators: {
                    notEmpty: {
                        message: '！用户名不能为空'
                    },
                    stringLength: {
                        min: 2,
                        max: 12,
                        message: '！用户名必须大于2，小于12个字'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9\u4e00-\u9fa5_\.]+$/,
                        message: '！用户名只能由汉字、字母、数字、点和下划线组成'
                    },
                    different: {
                        field: 'password',
                        message: '！用户名和密码不能相同'
                    }
                }
            },
            tophone: {
                validators: {
                    notEmpty: {
                        message: '！手机号不能为空'
                    },
                    regexp: {
                        regexp: /^[1][3,4,5,7,8][0-9]{9}$/,
                        message: '！请输入有效的手机号'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '！密码不能为空'
                    },
                    different: {
                        field: 'username',
                        message: '！用户名和密码不能相同'
                    },
                    stringLength: {
                        min: 6,
                        message: '！密码长度必须大于6位'
                    }
                }
            },
            confirm_pwd: {
                validators: {
                    notEmpty: {
                        message: '！密码不能为空'
                    },
                    identical: {
                        field: 'password',
                        message: '！两次密码不一致'
                    },
                    different: {
                        field: 'username',
                        message: '！用户名和密码不能相同'
                    }
                }
            },
            'sure[]': {
                validators: {
                    notEmpty: {
                        message: '！请阅读并勾选同意注册协议'
                    }
                }
            },
            captcha: {
                validators: {
                    notEmpty: {
                        message: '！请输入验证码'
                    },
                    callback: {
                        message: '！验证码错误',
                        callback: function(value, validator) {
                            return value == code;
                        }
                    }
                }
            }
        }
    });
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

function search0(){
    let text =document.getElementById("keyword0");
    if(text.value!="") {
        window.location.href = encodeURI(BASE_URL + 'archResult.html?keyword=' + text.value);
    }
};

function toMainpage() {
    window.location.href=BASE_URL+"/mainPage.html";
};

function toSinger() {
    window.location.href=BASE_URL+"/singer.html";
};
function toMymusic() {
    if(sessionStorage.getItem("username")){
        window.location.href=BASE_URL+"/mymusic.html";
    }else{
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    }
};
function toPlaylist() {
    window.location.href=BASE_URL+"/playlist.html";
};
function toLogin() {
    window.location.href=BASE_URL+"/login.html";
};

let code = "";
let cap = document.getElementById('cap').value;

var wait = 60;

function time(o) {
    if (wait == 0) {
        o.removeAttr("disabled");
        o.html("获取验证码");
        o.css("background-color" , "#ff9800");
        o.css("color" , "#ffffff");
        wait = 60;
    } else {
        o.attr("disabled", true);
        o.html(wait + "秒后重新获取") ;
        o.css("background-color" , "#bebbb5");
        o.css("color" , "#484444");
        wait--;
        setTimeout(function () {
            time(o)
        }, 1000)
    }
}

//获取验证码按钮
$("#dataBtn").click(function () {
    if(document.getElementById('uname').value==""||document.getElementById('pass').value==""||document.getElementById('phone').value==""){
        $("#dataBtn").attr("disabled", true);
    }else{
    $.ajax({
        type: 'POST',
        async:false,
        url: BASE_URL + "/register.html/enter",
        data: {
            username: document.getElementById('uname').value,
            phoneNum: document.getElementById('phone').value
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (res) {
            if (res == "phoneNum") {
                alert("该手机号已注册过！");
            }
            else if (res == "username") {
                alert("该用户名已被占用！");
            }
            else {
                code=res;
                time($("#dataBtn"));
            }
        }
    });
    }
});



$("#btn0").click (function() {
    cap = document.getElementById('cap').value;
    $('#defaultForm').bootstrapValidator('validate');
    if (cap!== "" && cap == code) {
        sessionStorage.setItem("username", $("#uname").val());
        alert("恭喜您注册成功！");
        window.location.href = BASE_URL + "/mainPage.html";
        saveUser();
    }
});

function saveUser() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/register.html/insertInfo",
        data: {
            username: document.getElementById('uname').value,
            password: document.getElementById('pass').value,
            phoneNum: document.getElementById('phone').value
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
        }
    })
}
