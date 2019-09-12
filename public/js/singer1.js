            window.onload = function () {
                ifLogged();
               // list(singer_data2,"remengeshou");
                singer_recommend();

            };
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

            function list(data){
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
                      ,count: data.length
                      ,limit: 16
                      ,theme: '#FF9800'
                      ,jump: function(obj){
                        //模拟渲染
                        
                        document.getElementById('middle-right').innerHTML = function(){
                          // console.log(data2.length);
                          var arr = []
                          ,thisData = data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                            
                          var x = 0;
                          layui.each(thisData, function(index, item){
                                      if(((x+1)%4) != 0){



                        
                        arr.push(
                        `
                        <div class="float-left-div">
                            <a href="${BASE_URL}/singerDetail.html?singer_mid=${data[(x+(obj.curr-1)*16)].singer_mid}">
                            <div>
                            <div style="width:180px;height:180px;">
                            <img src='${data[(x+(obj.curr-1)*16)].singer_pic}' style="width:100%;height:100%;"/>
                            </div>
                            <div class="singer-name">
                                ${data[(x+(obj.curr-1)*16)].singer_name}
                            </div>
                           
                            </div>
                            </a>
                        </div>
                        `
    
                        );
            
                            }
                            else{
                              arr.push(
                                `
                                <div class="float-left-div" style = "margin-right:0px;">
                                    <a href="${BASE_URL}/singerDetail.html?singer_mid=${data[(x+(obj.curr-1)*16)].singer_mid}">
                                    <div >
                                    <div style="width:180px;height:180px;">
                                    <img src='${data[(x+(obj.curr-1)*16)].singer_pic}' style="width:100%;height:100%;"/>
                                    </div>
                                    <div class="singer-name">
                                        ${data[(x+(obj.curr-1)*16)].singer_name}
                                    </div>
                                    </div>
                                    </a>
                                </div>
                                `
                              );
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


            
           