var sqlMap = {
  // 用户
  user: {
    add: 'insert into user(name,age) values(?,?)',
    get: 'select * from `user`'
  }
}

module.exports = sqlMap
