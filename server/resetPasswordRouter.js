var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const nodemailer = require("nodemailer");
const url = 'mongodb://localhost:27017';
const dbName = 'singer';
const SMSClient = require('@alicloud/sms-sdk');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'pls replace with your access Id';
const secretAccessKey = 'pls replace with your secret access key';
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey});

router.post('/enterEmail',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values.username},function (err,docs) {
            if(docs.email!==values.Num){
                res.send(false);
            }
            else{
                let word = getNumber();
                sendCode(word,values.Num);
                res.send(word);
            }
        });
    });
});

router.post('/enterPhone',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values.username},function (err,docs) {
            if(docs.phone!==values.Num){
                res.send(false);
            }
            else{
                let word = getNumber();
                sendMessage(word,values.Num);
                res.send(word);
            }
        });
    });
});

router.post('/updateInfo',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.update({"username":values.username},{$set:{"password":values.password}},function (err,docs) {
            res.send(docs);
        });
    });
});

//邮件发送验证码
function sendCode(vcode,cod) {
    const smtpTransport = nodemailer.createTransport({
        service: '163',
        port: 465,
        secureConnection: true,
        auth: {
            user: 'banana_music@163.com',
            pass: 'bananamusic07'//注：此处为授权码，并非邮箱密码
        }
    });
    smtpTransport.sendMail({
        from: 'banana_music@163.com',//发件人邮箱
        to: cod,//收件人邮箱，多个邮箱地址间用','隔开
        subject: '欢迎注册布拿拿音乐网',//邮件主题
        text: 'Hello!You are resetting the password,your verification code is [' + vcode + '].This verification code is valid for five minutes.'//text和html两者只支持一种
    }, function (err, res) {
        console.log(err, res);
    });
}

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

module.exports = router;
