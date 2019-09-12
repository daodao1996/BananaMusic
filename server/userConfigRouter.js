var express = require('express');
let router = express.Router();
var multer  = require('multer');
var fs = require('fs');
var bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: true });
let MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'singer';
var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};
var uploadFolder = '../public/img/upload/';
createFolder(uploadFolder);
var storage = multer.diskStorage({  // 通过 filename 属性定制
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        let tuozhan = file.originalname.split(".");
        cb(null, `${file.fieldname}_${Date.now()}.${tuozhan[tuozhan.length-1]}`);        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    }
});
var upload = multer({ storage: storage });  // 通过 storage 选项来对 上传行为 进行定制化
router.post('/upload', upload.single('userIcon'), function(req, res, next){
    var file = req.file;
    let values = req.body;
    console.log(file);
    console.log(values);
    MongoClient.connect(url, function(err, client) {
      const user = client.db(dbName).collection('user');
      const playlist = client.db(dbName).collection('playlist');
    if(file!==undefined){
        let back = "./img/upload/"+file.filename;
            user.update({"username":values.oldusername},{$set : {"username":values.username,"desc":values.desc,"gender":values.gender,"country":`${values.province} ${values.city}`,"birthday":values.birthday,"user_pic":back,"email":values.email}},function (err,docs) {
            });
    }
    else{
            user.update({"username":values.oldusername},{$set : {"username":values.username,"desc":values.desc,"gender":values.gender,"country":`${values.province} ${values.city}`,"birthday":values.birthday,"email":values.email}},function (err,docs) {
            });
    }
    playlist.find({"creatorName":values.oldusername}).toArray(function(err,res){
      let dissidArr = [];
      res.forEach(item => {
        playlist.update({"dissid":item.dissid},{$set:{"creatorName":values.username}},function(err,a){
        });
      })
    });
    });
    res.send(true);
});

router.post('/enterUsername', urlencodedParser, function(req, res){
    let values = req.body;
    console.log(values);
    if(values.oldusername == values.username){
        res.send(true);
    }
    else{
        MongoClient.connect(url, function(err, client) {
            const user = client.db(dbName).collection('user');
            user.findOne({"username":values.username},function (err,docs) {
                if(docs === null){
                    res.send(true);
                }else{
                    res.send(false);
                }
            });
        });
    }

});


module.exports = router;
