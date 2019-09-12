let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";

function jumpSearch(){

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

function ifLogged() {
    let uname = sessionStorage.getItem("username");
    if(uname !== null){
        $("#nav-login p").html("注销");
        $("#nav-login").click(function () {
            sessionStorage.removeItem("username");
            window.location.href=BASE_URL+"mymusic-not_logged.html";
        });
    }
    else{
        $("#nav-login p").html("登录");
        $("#nav-login a").attr("href","login.html");
    }
}

$(function () {
    $("#file_upload").change(function () {
        var $file = $(this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $("#user_pic");

        if (fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src', dataURL);
        } else {
            dataURL = $file.val();
            var imgObj = document.getElementById("user_pic");
            imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
            imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

        }
    });
});
var uname;
window.onload = function () {
    if(!sessionStorage.getItem("username"))
        window.location.href=BASE_URL+"/mymusic-not_logged.html";
    uname=sessionStorage.getItem("username");
    //sessionStorage.setItem("username","西农王丽坤999");
    loadUserData();
    ifLogged();
    $('#userForm').bootstrapValidator({
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
                    }
                }
            },
            email: {
                validators: {
                    emailAddress: {
                        message: '！请输入有效的邮箱'
                    }
                }
            }
        }
    });
};

function loadUserData() {
    $.ajax({
        type:"POST",
        url: BASE_URL+"/editPlaylist.html/userInfo",
        data: {"username":uname},
        dataType: "json",
        crossDomain:true,
        success: function (data) {
            if (data["username"] != null) {
                $("#username").attr("value", data["username"]);
                $("#oldusername").attr("value", data["username"]);
            }
            if (data["user_pic"] != null) {
                $("#user_pic").attr("src", data["user_pic"]);
            }
            else {
                $("#user_pic").attr("src", "img/pic2.png");
            }
            if (data["email"] != null) {
                $("#email").val(data["email"]);
            }
            if (data["desc"] != null) {
                $("#desc").text(data["desc"]);
            }
            else {
                $("#desc").text("介绍一下自己吧");
            }
            if (data["gender"] != null) {

                if (data["gender"] == "男") {
                    $("#male").attr('checked', 'true');
                }
                else if (data["gender"] == "女") {
                    $("#female").attr('checked', 'true');
                }
                else {
                    $("#secret").attr('checked', 'true');
                }
            }
            if (data["country"] != null) {
                var province = data["country"].split(" ")[0];
                var city = data["country"].split(" ")[1];
                $("#province").val(province);
                selectprovince2(province);
                $("#city").val(city);
            }
            if (data["birthday"] != null) {
                laydate.render(
                    {
                        elem: "#birthday",
                        value: data["birthday"],
                        theme: '#ff9800'
                    }
                )

            }
            else {
                laydate.render(
                    {
                        elem: "#birthday",
                        theme: '#ff9800'
                    }
                )
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.readyState);
        },

    });

    // $("#middle-div").show();

}
var t=0;
var options = {
    url: BASE_URL+'/myMusic-userConfig.html/upload',
    type: 'post',
    dataType: 'json',
    //clearForm: true,
    success: function (data) {
        alert("修改成功");
        window.location.reload();
    }
};

$("form").submit(function () {
    let flag=true;
    if(t==0){
      $.ajax({
          type: 'POST',
          async:false,
          url: BASE_URL + "/myMusic-userConfig.html/enterUsername",
          data: {
              username: document.getElementById('username').value,
              oldusername:document.getElementById('oldusername').value
          },
          datatype: 'JSON',
          crossDomain: true,
          success: function (res) {
              flag=res;
          },
      });
      if (flag !== true) {
          alert("用户名已存在");
      }else{
          sessionStorage.setItem("username",$("#username").val());
          $(this).ajaxSubmit(options);

      }
      t++;
      return false;
    }

});
