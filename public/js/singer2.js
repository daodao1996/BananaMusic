var a = $("#click-1");
let BASE_URL="http://bananamusic.s1.natapp.cc";//"http://127.0.0.1:9696";
            a.css("border", "1px solid #e2e2e2");
            a.css("color", "#ff9800");
            a.css("background", "url('../img/orange_point.png')no-repeat 6px 12px");

            function abc() {
                $(".title-two").on('click', '.li-two-div-unclicked', function () {
                    a.css("border", "1px solid #fffffa");
                    a.css("color", "black");
                    a.css("background", "url('../img/point.png')no-repeat 6px 12px");
                    $(this).css("border", "1px solid #e2e2e2");
                    $(this).css("color", "#ff9800");
                    $(this).css("background", "url('../img/orange_point.png')no-repeat 6px 12px");
                    a = $(this);
                })
            }

            function getValue(num) {
                let res={
                    country:"",
                    gender:""
                };
                let c=parseInt(num.split("_")[0]);
                let g = parseInt(num.split("_")[1]);
                switch (c){
                    case 1:
                        res["country"]="内地,台湾,香港";
                        break;
                    case 2:
                        res["country"]="美国,英国,澳大利亚,波多黎各,加拿大,俄罗斯,挪威,德国,爱尔兰,丹麦,芬兰";
                        break;
                    case 3:
                        res["country"]="韩国";
                        break;
                    case 4:
                        res["country"]="新加坡,日本,马来西亚,";
                        break;
                    default:
                        res["country"]="韩国";
                        break;
                }
                switch (g){
                    case 1:
                        res["gender"]="男";
                        break;
                    case 2:
                        res["gender"]="女";
                        break;
                    case 3:
                        res["gender"]="组合";
                        break;
                    default:
                        res["gender"]="";
                        break;
                }
                return res;
            }

			function singer_click(){
				abc() ;
				$(".title-two").on("click",".singer_click",function(){
				<!-- alert($(this).attr("value")); -->
				$.ajax({
				type:"POST",
				url:BASE_URL+"/singer.html",
				data:{
					value:getValue($(this).attr("value"))
                    //country:"内地",
                    //gender:"男"
				},
				datatype:'JSON',
				crossDomain:true,
				success:function(result){
				list(result);//,result.kind);
				}
				})
				})
			}

function singer_recommend(){
        abc() ;
        $.ajax({
            type:"GET",
            url:BASE_URL+"/singer.html/recommend",
            datatype:'JSON',
            crossDomain:true,
            success:function(result){
                list(result);
            }
        })
}

function singer_hot(){
    abc() ;
    $.ajax({
        type:"GET",
        url:BASE_URL+"/singer.html/hot",
        datatype:'JSON',
        crossDomain:true,
        success:function(result){
            list(result);
        }
    })
}