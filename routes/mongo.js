// 使用mongoose插件
var mongoose = require('mongoose');

// 连接数据库
var db = mongoose.connect('mongodb://@localhost:10001/tudou').connection;

// 打开
db.once('open', function() {
    console.log("mongodb connection success");
});

// 错误
db.on('error', function(error) {
    console.log(error);
    console.log('mongodb connection error');
});

module.exports = mongoose;