var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';
const SMSClient = require('@alicloud/sms-sdk');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAIiaKMFbpcirmq';
const secretAccessKey = '9r8VwXrtOctb62A8xn4RpW1rrNCqgh';
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey});

router.post('/enter',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values.username},function (err,docs) {
            user.findOne({"phone":values.phoneNum},function (err,docsp) {
                let flag="";
                let passCode=getNumber();
                if(docs !== null){
                    flag="username";
                }else if(docsp !== null){
                    flag="phoneNum";
                }else{
                    sendMessage(passCode,values.phoneNum);
                    flag = passCode;
                }
                res.send(flag);
            });
        });
    });
});


router.post('/insertInfo',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let d = new Date();
    let data={
        "username":values.username,
        "password":values.password,
        "phone":values.phoneNum,
        "user_pic":"./img/默认头像.png",
        "desc":null,
        "gender":"保密",
        "birthday":"2000-01-01",
        "country":"陕西省 西安市",
        "singer_id":[],
        "createTime":`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    };
    let playlistInfo={
        "dissid":getPlaylistID(),
        "dissname":"我喜欢的音乐",
        "creatorName":values.username,
        "createTime":`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        "imgurl":"./img/changpian.PNG",
        "state":"private",
        "desc":"",
        "comment_num":0,
        "comment":null,
        "songlist":[]
    };
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        const playlist = client.db(dbName).collection('playlist');
        user.insert(data,function (err,docs) {});
        playlist.insert(playlistInfo,function (err,result) {});
        res.send(true);
    });
});

function getNumber(){
    let num="";
    for(let i=0;i<6;i++){
        num+=Math.floor(Math.random()*10);
    }
    return num;
}

function sendMessage(password,phoneNum){
    //发送短信
    smsClient.sendSMS({
        PhoneNumbers: phoneNum,
        SignName: '布拿拿音乐网',
        TemplateCode: 'SMS_138079198',//'SMS_138069232',
        TemplateParam: `{"code":"${password}"}`
    }).then(function (res) {
        let {Code}=res
        if (Code === 'OK') {
            //处理返回参数
            console.log(res)
        }
    }, function (err) {
        console.log(err)
    });
}

function getPlaylistID() {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `playlist_${r}`;
    return id;
}
module.exports = router;