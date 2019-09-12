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
        const playlist = client.db(dbName).collection('playlist');
        playlist.find({"creatorName":values.username}).toArray(function (err,result)  {
            if(result.length==0){
                res.send("null");
            }
            else
                res.send(result);
        });
    });
});

router.post('/addMusicList',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    let listInfo={
        "dissid":getPlaylistID(),
        "dissname":values.dissname,
        "creatorName":values.creatorName,
        "createTime":values.createTime,
        "imgurl":"./img/changpian.PNG",
        "state":"private",
        "desc":"",
        "comment_num":0,
        "comment":null,
        "songlist":[]
    };
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.insert(listInfo,function (err,result)  {
            playlist.find({"creatorName":values.creatorName}).toArray(function(err,docs){
                let r = [];
                docs.forEach(item => {
                    console.log(item);
                    r.push({"dissid":item.dissid,"dissname":item.dissname,"imgurl":item.imgurl,"songNum":item.songlist.length});
                });
                res.send(r);
            });
        });
    });
});

function getPlaylistID() {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `playlist_${r}`;
    return id;
}
module.exports = router;