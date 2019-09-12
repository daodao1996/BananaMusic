var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.post('/allPlaylist',urlencodedParser,function (req,res) {         //查询当前用户所有歌单
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.find({"creatorName":values.username}).toArray(function (err,result)  {
            //let aaa=[];
            if(result.length==0){
                res.send("null");
            }
            else
                res.send(result);
        });
    });
});

router.post('/userInfo',urlencodedParser,function (req,res) {         //查询当前用户信息
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values.username},function (err,result)  {
            res.send(result);
        });
    });
});

router.post('/editMusicListIntro',urlencodedParser,function (req,res) {         //修改歌单简介
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.update({"dissid":values["dissid"]},{$set : {"desc":values["desc"]}},function (err,result)  {
                playlist.findOne({"dissid":values["dissid"]},function (err,ress) {
                    res.send(ress.desc);
                });
        });
    });
});

router.post('/editMusicListName',urlencodedParser,function (req,res) {         //歌单重命名
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.update({"dissid":values["dissid"]},{$set : {"dissname":values["dissname"]}},function (err,result)  {
            playlist.findOne({"dissid":values["dissid"]},function (err,ress) {
                res.send(ress.dissname);
            });
        });
    });
});


router.post('/deleteMusicList',urlencodedParser,function (req,res) {         //删除歌单
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.remove({"dissid":values["dissid"]},function (err,result)  {
            playlist.find({"creatorName":values.creatorName}).toArray(function (err,r) {
                res.send(r);
            });
        });
    });
});


router.post('/deleteRemark',urlencodedParser,function (req,res) {         //删除评论
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            let comment=[];
            result["comment"].filter(item => {
                if(item["commentid"]!==values["commentid"]){
                    comment.push(item);
                }
            });
            playlist.update({"dissid":values["dissid"]},{$set:{"comment":comment,"comment_num":result.comment_num++}},function (err,resss) {
                res.send({"comment":comment});
            });
        });
    });
});

router.post('/replyRemark',urlencodedParser,function (req,res) {     //回复评论
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            result["comment"].forEach(item => {
                if(item["commentid"] === values["commentid"]){
                    if(item["middleCommentContent"]===null){
                        item["middleCommentContent"] = [{"replyedNick":values["nick"],"subcommentcontent":values["rootCommentContent"]}];
                    }
                    else{
                        item["middleCommentContent"].push({"replyedNick":values["nick"],"subcommentcontent":values["rootCommentContent"]});
                    }
                }
            });
            playlist.update({"dissid":values["dissid"]},{$set : {"comment":result["comment"]}},function (err,r) {
                res.send({"comment":result["comment"]});
            });
        });
    });
});


router.post('/addMusicList',urlencodedParser,function (req,res) {         //添加歌单
    let values = req.body;
    console.log(values);
    let listInfo={
        "dissid":getPlaylistID(),
        "dissname":values.dissname,
        "creatorName":values.creatorName,
        "createTime":values.createDate,
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
                res.send(docs);
            });
        });
    });
});

router.post('/OnePlaylist',urlencodedParser,function (req,res) {         //添加歌单
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            res.send(result);
        });
    });
});

router.post('/deleteSong',urlencodedParser,function (req,res) {         //删除歌曲
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        let songCollection = client.db(dbName).collection('song');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            let songs=[];
            result["songlist"].forEach(item => {
                if(item["songmid"]!==values["songmid"]){
                    songs.push(item);
                }
            });
            if(songs.length>0){
                songCollection.findOne({"songmid":songs[songs.length-1].songmid},function (err,re) {
                    playlist.update({"dissid":values["dissid"]},{$set:{"songlist":songs,"imgurl":re.song_pic}},function (err,resss) {
                        playlist.findOne({"dissid":values.dissid},function(err,rrrrr){
                          res.send(rrrrr);
                        });
                    });
                });
            }else{
                playlist.update({"dissid":values["dissid"]},{$set:{"songlist":songs,"imgurl":"./img/changpian.PNG"}},function (err,resss) {
                  playlist.findOne({"dissid":values.dissid},function(err,rrrrrr){
                    res.send(rrrrrr);
                  });
                });
            }
        });
    });
});

router.post('/shareMusicList',urlencodedParser,function (req,res) {         //修改歌单状态
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.update({"dissid":values["dissid"]},{$set:{"state":values.state}},function (err,result)  {
            res.send(result);
        });
    });
});

function getPlaylistID() {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `playlist_${r}`;
    return id;
}

module.exports = router;
