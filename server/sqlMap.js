var sqlMap = {
  // 用户
  user: {
    add: 'insert into user(name,age) values(?,?)',
    get: 'select * from `user`'
  },
  // 设备
  device: {
    add: 'insert ignore into device(vid,token,device_name) values(?,?,?)',
    get: 'select * from `device`'
  }
}

module.exports = sqlMap
