

   function layuitest(){
    layer.open({
        type: 2,
        title: ['意见反馈', 'background-color:#ff9800;color:white;'],
        area: ['530px','400px'],
        content: ['content.html', 'no'],
        skin: 'layer-add',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var body = layer.getChildFrame('body', index);
            var tvalue1 = body.find('#text1').val();
            var tvalue2 = body.find('#text2').val();
            var username=sessionStorage.getItem("username");
             var usermessage={
                 "useridea":tvalue1,
                 "userconnection":tvalue2,
                 "username":username
             }
             
             // $.ajax({
             //     type:"post",
             //     data:usermessage,
             //     url:"save",
             //     dataType:"json"
             // })
             alert("感谢您的意见，我们会尽快处理！")
            layer.close(index);
        },
        btn2: function (index, layero) {
            layer.close(index);
        }
    });

}

