const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// 接受post请求参数
// web please setting request header application/x-www-form-urlencoded

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, accept, origin, content-type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("X-Powered-By",'3.2.1');
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 引入主路由
var routers = require('./routers/index.js')
app.use('/api', routers)

app.listen(3000, '127.0.0.1', function () {
  console.log('node server start success')
});
