var express = require('express');
let router = express.Router();
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';


/*router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});*/

    router.post('/',urlencodedParser,function (req,res) {
        let values = req.body;
        //console.log(values);
        MongoClient.connect(url, function (err, client) {
            const singer = client.db(dbName).collection('singer');
            singer.findOne({"singer_mid":values.singer_mid},function (err, result) {
                if(result.fans===undefined){
                    res.send(true);
                }
                else{
                    res.send(false);
                }

            })
        })
    });



module.exports = router;