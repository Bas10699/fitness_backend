var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment')
var logger = require('morgan')
var fs = require('fs')
var multer = require('multer')
var path = require('path')
var app = express();
var port = 3003
var version ='/api/v1/'

var mm = moment()
 var date = mm.utc(+7).format('DD-MM-YYYY')
 var time = mm.utc(+7).format('HH: mm: ss')
 console.log(date,time)

app.use(bodyParser.json({
    limit:'50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit:'50mb'
}));


app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization, X-Access-Token')
    res.setHeader('Access-Control-Allow-Credentials', true)
  
    // Pass to next layer of middleware
    next()
});

app.post("/upload", multer({dest: "./uploads/"}).array("uploads", 12), function(req, res) {
    var fileInfo = [];
    for(var i = 0; i < req.files.length; i++) {
        fileInfo.push({
            "originalName": req.files[i].originalName,
            "size": req.files[i].size,
            "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
        });
        fs.unlink(req.files[i].path);
    }
    res.send(req.files);
});

app.use(logger('dev'))
var accessLogStream = fs.createWriteStream(path.join(__dirname, `logs`,`'${date}'.log`), { flags: 'a' })
var configlog = `[${time}] [ip]: :remote-addr :remote-user [method]: :method [url]: :url HTTP/:http-version [status]: :status [response-time]: :response-time ms [client]: :user-agent`
app.use(logger(configlog, {
  stream: accessLogStream
}))

var show = require('./route/showdata');
app.use(version+'user',show)

app.listen(port,function(){
    console.log("test app port"+port)
})
