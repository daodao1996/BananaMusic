var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';

router.post('/',urlencodedParser,function (req,res) {
    let values = req.body.value;
    console.log(values);
    let country = values["country"].split(",");
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        singer.find({"country":{$in : country},"gender":values["gender"]}).toArray(function (err,docs) {
            let result=[];
            docs.forEach(item => {
               result.push({"singer_mid":item["singer_mid"],"singer_name":item["singer_name"],"singer_pic":item["singer_pic"]});
            });
            res.send(result);
        });
    });
});

router.get('/recommend',urlencodedParser,function (req,res) {
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        singer.find({}).toArray(function (err,docs) {
            let result=[];
            let index = getRandom();
            index.forEach(item => {
                result.push({"singer_mid":docs[item]["singer_mid"],"singer_name":docs[item]["singer_name"],"singer_pic":docs[item]["singer_pic"]});
            });
            res.send(result);
        });
    });
});

router.get('/hot',urlencodedParser,function (req,res) {
    MongoClient.connect(url, function(err, client) {
        const singer = client.db(dbName).collection('singer');
        singer.find({}).toArray(function (err,docs) {
            let result=[];
            let index = getRandom();
            index.forEach(item => {
                result.push({"singer_mid":docs[item]["singer_mid"],"singer_name":docs[item]["singer_name"],"singer_pic":docs[item]["singer_pic"]});
            });
            res.send(result);
        });
    });
});


function getRandom() {
    let num=[];
    while(num.length<=15){
        let ran=Math.floor(Math.random()*240);
        if(num.indexOf(ran)===-1){
            num.push(ran);
        }
    }
    return num;
}

module.exports = router;