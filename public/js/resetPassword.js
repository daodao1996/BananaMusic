let BASE_URL = "http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

$(document).ready(function () {
    ifLogged();
    //注册信息填写判断
    $('#defaultForm').bootstrapValidator({
        message: 'This value is not valid',
        excluded: [':disabled'],
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
            resetSel: {
                message: '！请选择验证方式',
                validators: {
                    callback: {
                        message: '请选择验证方式',
                        callback: function (value, validator) {
                            if (value == 0) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    }
                }
            },
            sel: {
                validators: {
                    notEmpty: {
                        message: '！邮箱/手机号不能为空'
                    },
                    regexp:{
                        regexp:/^[1][3,4,5,7,8][0-9]{9}$|^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                        message: '！请输入有效的手机号/邮箱'
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
            captcha: {
                validators: {
                    notEmpty: {
                        message: '！请输入验证码'
                    },
                    callback: {
                        message: '！验证码错误',
                        callback: function (value, validator) {
                            var sel = document.getElementById('Sel').selectedIndex;//获取选中项的索引
                            if (sel == 1 || sel==2) {
                                return value == code;
                            }
                        }
                    }
                }
            }
        }
    });
});

function ifLogged() {
    let uname = sessionStorage.getItem("username");
    if (uname !== null) {
        $("#nav-login p").html("注销");
        $("#nav-login").click(function () {
            sessionStorage.removeItem("username");
            window.location.reload();
        });
    }
    else {
        $("#nav-login p").html("登录");
        $("#nav-login a").attr("href", "login.html");
    }
}

function toSearchResult() {
    let text = document.getElementById("keyword0");
    if(text.value!=""){
    window.location.href = encodeURI(BASE_URL + '/searchResult.html?keyword=' + text.value);
    }
};

function toMainpage() {
    window.location.href = BASE_URL + "/mainPage.html";
};

function toSinger() {
    window.location.href = BASE_URL + "/singer.html";
};

function toMymusic() {
    if (sessionStorage.getItem("username")) {
        window.location.href = BASE_URL + "/mymusic.html";
    } else {
        window.location.href = BASE_URL + "/mymusic-not_logged.html";
    }
};

function toPlaylist() {
    window.location.href = BASE_URL + "/playlist.html";
};

let code = "";
let vcode = "";
let cap = document.getElementById('cap').value;

var wait = 60;

function time(o) {
    if (wait == 0) {
        o.removeAttr("disabled");
        o.html("获取验证码");
        o.css("background-color", "#ff9800");
        o.css("color", "#ffffff");
        wait = 60;
    } else {
        o.attr("disabled", true);
        o.html(wait + "秒后重新获取");
        o.css("background-color", "#bebbb5");
        o.css("color", "#484444");
        wait--;
        setTimeout(function () {
            time(o)
        }, 1000)
    }
}


//获取验证码按钮
$("#dataBtn").click(function () {
    // confirm();
    if(document.getElementById('uname').value==""){
        alert("请填写用户名!")
        window.location.reload();
    }else{
    var sel = document.getElementById('Sel').selectedIndex;//获取选中项的索引
    var inputsel = document.getElementById('inputSel').value;
    if (sel == 0) {
        alert("请选择验证方式！");
        window.location.reload();
    }
    else {
        if (sel == 1) {//选择邮箱验证
            var checkEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
            if (!checkEmail.test(inputsel)) {
                alert("请输入有效的邮箱！");
                window.location.reload();
            }
            else {
                $.ajax({
                    type: 'POST',
                    async: false,
                    url: BASE_URL + "/resetPassword.html/enterEmail",
                    data: {
                        username: document.getElementById('uname').value,
                        Num: document.getElementById('inputSel').value
                    },
                    datatype: 'JSON',
                    crossDomain: true,
                    success: function (res) {
                        if (res == false) {
                            alert("请填写已绑定的邮箱！");
                            window.location.reload();
                        }
                        else {
                            code = res;
                            time($("#dataBtn"));
                        }
                    }
                });
            }
        } else if (sel == 2) {//选择手机验证
            var checkPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!checkPhone.test(inputsel)) {
                alert("请输入有效的手机号！");
                window.location.reload();
            }
            else {
                $.ajax({
                    type: 'POST',
                    async: false,
                    url: BASE_URL + "/resetPassword.html/enterPhone",
                    data: {
                        username: document.getElementById('uname').value,
                        Num: document.getElementById('inputSel').value
                    },
                    datatype: 'JSON',
                    crossDomain: true,
                    success: function (res) {
                        if (res == false) {
                            alert("请填写注册过的手机号！");
                            window.location.reload();
                        }
                        else {
                            code = res;
                            time($("#dataBtn"));
                        }
                    }
                });
            }
        }

    }
    }
});


//确定按钮
$("#btn0").click(function () {
    cap = document.getElementById('cap').value;
    // $('#defaultForm').bootstrapValidator('validate');
    if (cap != "") {
        var sel = document.getElementById('Sel').selectedIndex;//获取选中项的索引
        if (sel == 1) {
            if (cap == code) {
                //sessionStorage.setItem("username", $("#uname").val());
                alert("恭喜您密码修改成功！");
                savePassword();
                window.location.href=BASE_URL+"/login.html";
                window.event.returnValue=false;
            }
        } else if (sel == 2) {
            if (cap == code) {
                //sessionStorage.setItem("username", $("#uname").val());
                alert("恭喜您密码修改成功！");
                savePassword();
                window.location.href=BASE_URL+"/login.html";
                window.event.returnValue=false;
            }
        }

    }
    else{
        window.location.reload();
    }
});

//保存修改后的密码
function savePassword() {
    $.ajax({
        type: 'POST',
        url: BASE_URL + "/resetPassword.html/updateInfo",
        data: {
            username: document.getElementById('uname').value,
            password: document.getElementById('pass').value,
        },
        datatype: 'JSON',
        crossDomain: true,
        success: function (result) {
        }
    })
}
