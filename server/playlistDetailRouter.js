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
        playlist.findOne({"dissid":values.dissid},function (err,docs) {
            res.send(docs);
        });
    });
});


router.post('/publicmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
            let commID=getCommentID(values.dissid);
            if(result["comment"]===null){
                result["comment"]=[{"commentid":commID,"nick":values["nick"],"rootCommentContent":values["rootCommentContent"],"middleCommentContent":null}];
            }else{
                result["comment"].push({"commentid":commID,"nick":values["nick"],"rootCommentContent":values["rootCommentContent"],"middleCommentContent":null});
            }
            playlist.update({"dissid":values["dissid"]},{$set : {"comment":result["comment"],"comment_num":result.comment_num++}},function (err,r) {
            });
            res.send(result["comment"]);
        });
    });
});

router.post('/retmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.findOne({"dissid":values["dissid"]},function (err,result)  {
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
            playlist.update({"dissid":values["dissid"]},{$set : {"comment":result["comment"]}},function (err,r) {
                res.send(result["comment"]);
            });
        });
    });
});


function getCommentID(dissid) {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `toplist_${dissid}_${r}`;
    return id;
}


module.exports = router;