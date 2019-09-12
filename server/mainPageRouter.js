var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.get('/hot',urlencodedParser,function (req,res) {
    /*let values = req.body;
    console.log(values);*/
    MongoClient.connect(url, function(err, client) {
        const songCollection = client.db(dbName).collection('song');
        songCollection.find({}).toArray(function (err,docs) {
            let result=[];
            let index = getRandom();
            index.forEach(item => {
                result.push({"songmid":docs[item].songmid,"songname":docs[item].songname,"singer_name":docs[item].singer_name,"song_pic":docs[item].song_pic});
            });
            res.send(result);
        });
    });
});

function getRandom() {
    let num=[];
    while(num.length<8){
        let ran=Math.floor(Math.random()*240);
        if(num.indexOf(ran)===-1){
            num.push(ran);
        }
    }
    return num;
}


module.exports = router;