var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.post('/singer',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        var reg = new RegExp(values.keyword,'i');
        singer.find({"singer_name":{$regex : reg}}).toArray(function (err,docs) {
            let result=[];
            docs.forEach(item => {
                result.push({"singer_mid":item["singer_mid"],"singer_name":item["singer_name"],"singer_pic":item["singer_pic"]});
            });
            res.send(result);
        });
    });
});

router.post('/music',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const song = client.db(dbName).collection('song');
        var reg = new RegExp(values.keyword,'i');
        song.find({"songname":{$regex : reg}}).toArray(function (err,docs) {
            let result=[];
            docs.forEach(item => {
                result.push({"songmid":item["songmid"],"songname":item["songname"],"singer_name":item["singer_name"],"song_time":item["song_time"],"singer_mid":item["signer_mid"]});
            });
            res.send(result);
        });
    });
});

router.post('/playlist',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        var reg = new RegExp(values.keyword,'i');
        playlist.find({"dissname":{$regex : reg},"state":"public"}).toArray(function (err,docs) {
            let result=[];
            docs.forEach(item => {
                result.push({"dissname":item["dissname"],"dissid":item["dissid"],"imgurl":item["imgurl"]});
            });
            res.send(result);
        });
    });
});

router.post('/collection',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        const song = client.db(dbName).collection('song');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            let flag=true;
            for(let item of result.songlist){
                if(item.songmid === values.songmid){
                    flag = false;
                    break;
                }
            }
            if(flag === true){
                song.findOne({"songmid":values.songmid},function (err,docs) {
                    let songInfo={
                        "songmid":values.songmid,
                        "songname":docs.songname,
                        "singer_mid":docs.singer_mid,
                        "singer_name":docs.singer_name,
                        "songTime":docs.song_time
                    };
                    result.songlist.push(songInfo);
                    playlist.update({"dissid":values.dissid},{$set:{"songlist":result.songlist,"imgurl":docs.song_pic}},function(err,rrr){
                        res.send(true);
                    });
                });

            }else{
                res.send(false);
            }

        });
    });
});
module.exports = router;
