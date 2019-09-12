let express = require('express');
let app = express();
var http = require('http');
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('../public'));
app.all('*', function (req, res, next)
{ res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let tryRouter = require('./tryRouter');
app.use('/try.html',tryRouter);

let albumDetailRouter = require('./albumDetailRouter');
app.use('/album.html',albumDetailRouter);

let mainPageRouter = require('./mainPageRouter');
app.use('/mainPage.html',mainPageRouter);

let toplistRouter = require('./toplistRouter');
app.use('/toplist.html',toplistRouter);

let newsongRouter = require('./newsongRouter');
app.use('/newsong.html',newsongRouter);

let songDetailRouter = require('./songDetailRouter');
app.use('/songDetail.html',songDetailRouter);

let singerRouter = require('./singerRouter');
app.use('/singer.html',singerRouter);

let playlistRouter = require('./playlistRouter');
app.use('/playlist.html',playlistRouter);

let searchResultRouter = require('./searchResultRouter');
app.use('/searchResult.html',searchResultRouter);

let editPlaylistRouter = require('./editPlaylistRouter');
app.use('/editPlaylist.html',editPlaylistRouter);

let mymusicRouter = require('./mymusicRouter');
app.use('/mymusic.html',mymusicRouter);

let loginRouter = require('./loginRouter');
app.use('/login.html',loginRouter);

let singerDetailRouter = require('./singerDetailRouter');
app.use('/singerDetail.html',singerDetailRouter);

let userConfigRouter = require('./userConfigRouter');
app.use('/myMusic-userConfig.html',userConfigRouter);

let topRouter  =require('./topRouter');
app.use('/top.html',topRouter);

let registerRouter = require('./registerRouter');
app.use('/register.html',registerRouter);

let playlistDetailRouter = require('./playlistDetailRouter');
app.use('/playlistDetail.html',playlistDetailRouter);

let saveToMusicListRouter = require('./saveToMusicListRouter');
app.use('/saveToMusicList.html',saveToMusicListRouter);

let resetPasswordRouter = require('./resetPasswordRouter');
app.use("/resetPassword.html",resetPasswordRouter);


var server = app.listen(9696,'localhost',function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
