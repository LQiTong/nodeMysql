var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = null
conn = mysql.createConnection(models.dev)
if (process.env.NODE_ENV === 'production') conn = mysql.createConnection(models.prod)

conn.connect()
var jsonWrite = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '1',
      msg: '操作失败'
    })
  } else {
    res.json(ret)
  }
}

// 增加vid \ token \ deviceName
router.post('/addDevice', (req, res) => {
  const sql = $sql.device.add
  const params = req.body
  console.log('====================================');
  console.log('req.body --> ', req.body);
  console.log('====================================');
  conn.query(sql, [params.vid, params.token, params.deviceName], (err, result) => {
    if (err) {
      console.log('添加device失败：' + err);
      res.json({
        code: '000001',
        status: '200',
        message: err
      })
    }
    if (result) {
      res.json({
        code: '000000',
        status: '200',
        message: '添加成功'
      })
    }
  })
})

// 查询用户接口
router.get('/getDevice', (req, res) => {
  const sql = $sql.device.get
  const params = req.query.device_name
  console.log('====================================');
  console.log(`查询参数 ${new Date().toLocaleTimeString()} --> `, params)
  console.log('====================================');
  conn.query(`${sql} where device_name='${params}'`, (err, result) => {
    if (err) {
      console.log('====================================');
      console.log(`查询失败 ${new Date().toLocaleTimeString()} --> ` + err)
      console.log('====================================');
    }
    if (result) {
      console.log('====================================');
      console.log(`查询结果 ${new Date().toLocaleTimeString()} --> `, result[0])
      console.log('====================================');
      jsonWrite(res, result[0])
    }
  })
})
module.exports = router
