var models = require('../db')
var express = require('express')
var router = express.Router()
var mysql = require('mysql')
var $sql = require('../sqlMap')

// 连接数据库
var conn = mysql.createConnection(models.mysql)

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

// 增加用户接口
router.post('/addUser', (req, res) => {
  const sql = $sql.user.add
  const params = req.body
  console.log(params)
  conn.query(sql, [params.name, params.age], function (err, result) {
    if (err) {
      console.log('添加失败' + err)
      // jsonWrite(res, err)
      res.json({
        code: '1',
        status: '200',
        message: '操作失败，已存在同名'
      })
    }
    if (result) {
      // jsonWrite(res, result)
      res.json({
        code: '000000',
        status: '200',
        message: '操作成功'
      })
    }
  })
})

// 查询用户接口
router.get('/getUser', (req, res) => {
  const sql = $sql.user.get
  // const params = req.body
  // console.log(params)
  conn.query(sql, function (err, result) {
    if (err) {
      console.log('添加失败' + err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})
module.exports = router
