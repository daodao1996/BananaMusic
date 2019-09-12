var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.get('/toplist',urlencodedParser,function (req,res) {
    MongoClient.connect(url, function(err, client) {
        const toplist = client.db(dbName).collection('toplist');
        toplist.find({},{limit:3}).toArray(function (err,docs) {
            res.send(docs);
        });
    });
});


module.exports = router;