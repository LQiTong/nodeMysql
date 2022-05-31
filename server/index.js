const userApi = require('./api/userApi')
const deviceApi = require('./api/userDevice')
// const fs = require('fs')
// const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

// 获取 req.body 参数的处理放在 api 前面
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// 后端api路由
app.use('/api/user', userApi)
app.use('/api/device', deviceApi)

// 监听端口
app.listen(8001)
console.log('success listen at port:8001......')
