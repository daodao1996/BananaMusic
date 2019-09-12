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
        const toplist = client.db(dbName).collection('toplist');
        toplist.findOne({"listName":values.listName},function (err,docs) {
            res.send(docs);
        });
    });
});

router.post('/publicmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const toplist = client.db(dbName).collection('toplist');
        toplist.findOne({"listName":values["listName"]},function (err,result)  {
            let commID=getCommentID();
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
            toplist.update({"listName":values["listName"]},{$set : {"comment":result["comment"],"comment_num":result.comment_num++}},function (err,r) {
            });
            let s = {"comment":result["comment"],"comment_num":result["comment_num"]};
            res.send(s);
        });
    });
});

router.post('/retmessage',urlencodedParser,function (req,res) {
    let values = req.body;
    console.log(values);
    MongoClient.connect(url, function(err, client) {
        const toplist = client.db(dbName).collection('toplist');
        toplist.findOne({"listName":values["listName"]},function (err,result)  {
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
            toplist.update({"listName":values["listName"]},{$set : {"comment":result["comment"]}},function (err,r) {
                res.send(result["comment"]);
            });
        });
    });
});

function getCommentID() {
    let r=(Math.random()*10000000).toString(16).substr(0,4)+'_'+(new Date()).getTime()+'_'+Math.random().toString().substr(2,5);
    let id = `toplist_${r}`;
    return id;
}
module.exports = router;