var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.post('/userInfo',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values["username"]},function (err,docs) {
            res.send(docs);
        });
    });
});

router.post('/playlist',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.find({"creatorName":values["username"]}).toArray(function (err,docs) {
            let ress=[];
            docs.forEach(item => {
                ress.push({"dissid":item.dissid,"dissname":item.dissname,"imgurl":item.imgurl});
            });
            res.send(ress);
        });
    });
});


router.get('/recommend',urlencodedParser,function (req,res) {
    MongoClient.connect(url, function(err, client) {
        const song = client.db(dbName).collection('song');
        let indexs = getRandom();
        song.find({}).toArray(function (err,docs) {
            let result = [];
            indexs.forEach(item => {
                result.push({"songmid":docs[item]["songmid"],"songname":docs[item]["songname"],"song_pic":docs[item]["song_pic"]});
            });
            res.send(result);
        });
    });
});

function getRandom() {
    let num=[];
    while(num.length<4){
        let ran=Math.floor(Math.random()*7526);
        if(num.indexOf(ran)===-1){
            num.push(ran);
        }
    }
    return num;
}

module.exports = router;