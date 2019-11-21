var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment')
var logger = require('morgan')
var fs = require('fs')
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
    next()
});



app.use(logger('dev'))
var accessLogStream = fs.createWriteStream(path.join(__dirname, `logs`,`'${date}'.log`), { flags: 'a' })
var configlog = `[${time}] [ip]: :remote-addr :remote-user [method]: :method [url]: :url HTTP/:http-version [status]: :status [response-time]: :response-time ms [client]: :user-agent`
app.use(logger(configlog, {
  stream: accessLogStream
}))
//user web
var show = require('./route/showdata');
app.use(version+'user',show)
//product web
var product = require('./route/product');
app.use(version+'product',product)
//promotion web
var promotion = require('./route/promotion');
app.use(version+'promotion',promotion)
//user app
var user_app = require('./route/user_app');
app.use(version+'user_app',user_app)
//promotion app
var app_pro = require('./route/app_pro');
app.use(version+'app_pro',app_pro)

var app_sum = require('./route/app');
app.use(version+'app',app_sum)

var pos = require('./route/pos');
app.use(version+'pos',pos)

var course = require('./route/course');
app.use(version+'course',course)

app.listen(port,function(){
    console.log("test app port"+port)
})


// const admin = require('firebase-admin')
// const { google } = require('googleapis')
// const axios = require('axios')

// const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
// const SCOPES = [MESSAGING_SCOPE]

// const serviceAccount = require('./fitness-be533-firebase-adminsdk-3r3lu-78ceb8607b.json')
// const databaseURL = 'https://fitness-be533.firebaseio.com'
// const URL =
//   'https://fcm.googleapis.com/v1/projects/fitness-be533/messages:send'
// const deviceToken =
//   'eGmWRtaXPx8:APA91bEraoM65o-tSf4XF3OpMBwzQrN87wZiq5HnFPaFbE9j2CXpPjh2i_cvL_8KCpWfuKVbStj29yeaEk1eclHqLPsUaPKeQi-PSnOB2gOu2iXZkuY7_5bm2ls6yE_7TCSlQCE6oCL9'

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: databaseURL
// })

// function getAccessToken() {
//   return new Promise(function(resolve, reject) {
//     var key = serviceAccount
//     var jwtClient = new google.auth.JWT(
//       key.client_email,
//       null,
//       key.private_key,
//       SCOPES,
//       null
//     )
//     jwtClient.authorize(function(err, tokens) {
//       if (err) {
//         reject(err)
//         return
//       }
//       resolve(tokens.access_token)
//     })
//   })
// }

// async function init() {
//   const body = {
//     message: {
//       data: { key: 'value' },
//       notification: {
//         title: 'Notification title',
//         body: 'Notification body'
//       },
//       webpush: {
//         headers: {
//           Urgency: 'high'
//         },
//         notification: {
//           requireInteraction: 'true'
//         }
//       },
//       token: deviceToken
//     }
//   }

//   try {
//     const accessToken = await getAccessToken()
//     console.log('accessToken: ', accessToken)
//     const { data } = await axios.post(URL, JSON.stringify(body), {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`
//       }
//     })
//     console.log('name: ', data.name)
//   } catch (err) {
//     console.log('err: ', err.message)
//   }
// }

// init()