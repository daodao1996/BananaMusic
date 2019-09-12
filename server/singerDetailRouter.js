var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.post('/',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        singer.findOne({"singer_mid":values.singer_mid},function (err,docs) {
            let sendRes="";
            if(docs === null){
                sendRes="no singer";
            }else{
                sendRes=docs;
            }
               res.send(sendRes);
        });
    });
});

router.post('/albumInfo',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        const album = client.db(dbName).collection('album');
        singer.findOne({"singer_mid": values.singer_mid}, function (err, docs) {
            album.find({"albumMID": {$in: docs["album_list"]}}).toArray(function (err, result) {
                let rr = [];
                result.forEach(item => {
                    rr.push({
                        "albumMID": item.albumMID,
                        "albumName": item.albumName,
                        "aDate": item.pubTime,
                        "lan": item.lan,
                        "company": item.company,
                        "album_pic":item.album_pic
                    });
                });
                res.send(rr);
            });
        });
    });
});

router.post('/songlist',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const song = client.db(dbName).collection('song');
        song.find({"signer_mid":values.singer_mid}).toArray(function (err,result) {
            let rr = [];
            result.forEach(item => {
                rr.push({"songmid":item.songmid,"songname":item.songname,"albumname":item.albumname,"song_time":item.song_time,"albumMID":item.albummid});
            });
            res.send(rr);
        });
    });
});

router.post('/collectionsinger',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        const user = client.db(dbName).collection('user');
        singer.findOne({"singer_mid":values.singer_mid},function (err,result) {
            if(result.fans===undefined){
                result.fans=[values.username];
            }else{
                result.fans.push(values.username);
            }
            singer.update({"singer_mid":values.singer_mid},{$set:{"fans":result.fans}});
            user.findOne({"username":values.username},function (err,docs) {
                docs.singer_id.push({"singer_mid":values.singer_mid,"singer_name":result.singer_name,"singer_pic":result.singer_pic});
                user.update({"username":values.username},{$set: {"singer_id":docs.singer_id}});
            });
        });
        res.send(true);
    });
});

module.exports = router;