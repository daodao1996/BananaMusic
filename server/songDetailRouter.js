var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';
let request = require('request');

router.post('/',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.findOne({"songmid":values["song_mid"]},function (err,docs) {
            docs["lan"] = getLan(docs["lan"]);
            songCollection.find({"singer_name":docs["singer_name"]}).toArray(function (err,rrr) {
                let recommend=[];
                if(rrr.length>3){
                    let recommendIndex = getRandom(rrr.length);
                    recommendIndex.forEach(item => {
                        if(rrr[item]["songmid"]!==values["song_mid"] && recommend.length<3){
                            recommend.push({"songmid":rrr[item]["songmid"],"songname":rrr[item]["songname"],"song_pic":rrr[item]["song_pic"]});
                        }
                    });
                }
                else{
                    recommend=[
                        {"songmid":"0016aHoC1IyI1d","song_pic":"http://y.gtimg.cn/music/photo_new/T002R300x300M000003vsrnW4bOLik.jpg?max_age=2592000","songname":"白羊"},
                        {"songmid":"003aJ2DY1waVeQ","song_pic":"http://y.gtimg.cn/music/photo_new/T002R300x300M000004aFe9C3WQken.jpg?max_age=2592000","songname":"我们的明天 (Live in Shanghai)"},
                        {"songmid":"003vtGKL1lEqOC","song_pic":"http://y.gtimg.cn/music/photo_new/T002R300x300M00000425tWT362jqF.jpg?max_age=2592000","songname":"新不了情 (Live in Guangzhou)"}
                    ];
                }
                docs["recommend"] = recommend;
                res.send(docs);
            })
        });
    });
});


router.post('/lyric',urlencodedParser,function (req,res) {
    let values = req.body;
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.update({"songmid":values["song_mid"]},{$set : {"lyric":values["lyric"]}},function (err,result)  {
            res.send(true);
        });
    });
});

router.post('/publicmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.findOne({"songmid":values["song_mid"]},function (err,result)  {
            let commID=getCommentID(result["songid"]);
            if(result["comment"]===null){
                result["comment"]=[{"commentid":commID,"nick":values["nick"],"rootCommentContent":values["rootCommentContent"],"middleCommentContent":null}];
            }else {
                result["comment"].push({
                    "commentid": commID,
                    "nick": values["nick"],
                    "rootCommentContent": values["rootCommentContent"],
                    "middleCommentContent": null
                });
            }
            songCollection.update({"songmid":values["song_mid"]},{$set : {"comment":result["comment"],"comment_num":result.comment_num++}},function (err,r) {
            });
            let s = {"comment":result["comment"],"comment_num":result["comment_num"]};
                res.send(s);
        });
    });
});

router.post('/retmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.findOne({"songmid":values["song_mid"]},function (err,result)  {
            result["comment"].forEach(item => {
                if(item["commentid"] === values["commentid"]){
                    if(item["middleCommentContent"]===null){
                        item["middleCommentContent"] = [{"replyedNick":values["replydNick"],"subcommentcontent":values["subcommentcontent"]}];
                    }
                    else{
                        item["middleCommentContent"].push({"replyedNick":values["replydNick"],"subcommentcontent":values["subcommentcontent"]});
                    }
                }
            });
            songCollection.update({"songmid":values["song_mid"]},{$set : {"comment":result["comment"]}},function (err,r) {
                res.send(result["comment"]);
            });
        });
    });
});

router.post('/songnamepic',urlencodedParser,function (req,res) {
    let values = req.body;
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.findOne({"songmid":values["song_mid"]},function (err,result)  {
            let rrr = {"songname":result["songname"],"song_pic":result["song_pic"]};
            res.send(rrr);
        });
    });
});

router.post('/songsrc',urlencodedParser,function (req,res) {
    let values = req.body;
    let urll = getURL(values["song_mid"]);
    request(urll,(error, response, body)=>{
        if(!error && response.statusCode == 200){
            let ress = JSON.parse(body.substring("MusicJsonCallback06459212607938936(".length,body.length-1));
            let filename = ress["data"]["items"][0]["filename"];
            let vkey = ress["data"]["items"][0]["vkey"];
            let songsrc = `http://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&fromtag=66`;
            res.send(songsrc);
        }else{
            console.log("error");
        }
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

function getURL(songmid){
    let aaa="https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=872989112&jsonpCallback=MusicJsonCallback06459212607938936&loginUin=11297258&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&callback=MusicJsonCallback06459212607938936&uin=11297258&songmid="+songmid+"&filename=C100"+songmid+".m4a&guid=9136027940";
    return aaa;
}

function getCommentID(songid) {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `song_${songid}_${r}`;
    return id;
}

function getRandom(n) {
    let num=[];
    while(num.length<=4){
        let ran=Math.floor(Math.random()*n);
        if(num.indexOf(ran)===-1){
            num.push(ran);
        }
    }
    return num;
}

function getLan(num){
    let lan="";
    switch (num){
        case 0:
            lan="国语";
            break;
        case 1:
            lan="粤语";
            break;
        case 2:
            lan="闽南语";
            break;
        case 3:
            lan="日语";
            break;
        case 4:
            lan="韩语";
            break;
        case 5:
            lan="英语";
            break;
        case 6:
            lan="法语";
            break;
        case 9:
            lan="纯音乐";
            break;
        case 10:
            lan="德语";
            break;
        case 11:
            lan="俄语";
            break;
        case 16:
            lan="西班牙语";
            break;
        case 19:
            lan="意大利语";
            break;
        case 25:
            lan="藏语";
            break;
        case 27:
            lan="阿拉伯语";
            break;
        default:
            lan="暂无";
    }
    return lan;
}
module.exports = router;