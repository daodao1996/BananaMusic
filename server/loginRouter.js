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
        const user = client.db(dbName).collection('user');
        user.findOne({"username":values.username},function (err,docs) {
            let result={};
            if(docs!==null){
                result={"username":docs["username"],"password":docs["password"]};
            }
            else
                result = "no user";

            res.send(result);
        });
    });
});

module.exports = router;