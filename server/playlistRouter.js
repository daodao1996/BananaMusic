var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.get('/publiclist',urlencodedParser,function (req,res) {
    MongoClient.connect(url, function(err, client) {
        const playlist = client.db(dbName).collection('playlist');
        playlist.find({"state":"public"}).toArray(function (err,docs) {
            let result=[];
            docs.forEach(item => {
                result.push({"dissid":item["dissid"],"dissname":item["dissname"],"imgurl":item["imgurl"]});
            });
            res.send(result);
        });
    });
});


module.exports = router;