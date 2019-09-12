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
        const album = client.db(dbName).collection('album');
        album.findOne({"albumMID":values["albumID"]},{},function (err,result)  {
            album.find({"singer_MID":result["singer_MID"]}).toArray(function (err,simi) {
                    let similar=[];
                    simi.forEach(item => {
                        if(item["albumMID"]!==result["albumMID"] && similar.length<3){
                            similar.push({"albumMID":item["albumMID"],"albumName":item["albumName"],"album_pic":item["album_pic"]});
                        }
                    });
                result["similar"] = similar;
                res.send(result);
            });
        });
    });
});


router.post('/publicmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const album = client.db(dbName).collection('album');
        album.findOne({"albumMID":values["albumMID"]},function (err,result)  {
            let commID=getCommentID(result["songid"]);
            if(result["comment"]===null || result["comment"]===undefined){
                result["comment"]=[{"commentid":commID,"nick":values["nick"],"rootCommentContent":values["rootCommentContent"],"middleCommentContent":null}];
            }else {
                result["comment"].push({
                    "commentid": commID,
                    "nick": values["nick"],
                    "rootCommentContent": values["rootCommentContent"],
                    "middleCommentContent": null
                });
            }
            album.update({"albumMID":values["albumMID"]},{$set : {"comment":result["comment"],"comment_num":result.comment_num++}},function (err,r) {
            });
            let s = {"comment":result["comment"],"comment_num":result["comment_num"]};
            res.send(s);
        });
    });
});

router.post('/retmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    MongoClient.connect(url, function(err, client) {
        const album = client.db(dbName).collection('album');
        album.findOne({"albumMID":values["albumMID"]},function (err,result)  {
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
            album.update({"albumMID":values["albumMID"]},{$set : {"comment":result["comment"]}},function (err,r) {
                res.send(result["comment"]);
            });
        });
    });
});

/*function getRandom(n) {
    let num=[];
    while(num.length<=4){
        let ran=Math.floor(Math.random()*n);
        if(num.indexOf(ran)===-1){
            num.push(ran);
        }
    }
    return num;
}*/

function getCommentID(songid) {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `song_${songid}_${r}`;
    return id;
}

module.exports = router;