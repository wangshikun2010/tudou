var mongoose = require('mongoose');

// 连接数据库
var db = mongoose.connect('mongodb://@localhost:10001/test').connection;

// 打开
db.once('open', function() {
    console.log("mongodb connection open");
});

// 错误
db.on('error', function(error) {
    console.log(error);
    console.log('错误');
});

module.exports = mongoose;



// function openDb() {

    // // 连接数据库
    // var db = mongoose.connect('mongodb://@localhost:10001/test').connection;

    // // 打开
    // db.once('open', function() {
    //     console.log("mongodb connection open");
    // });

    // // 错误
    // db.on('error', function(error) {
    //     console.log(error);
    //     console.log('错误');
    // });

    // // Schema 结构
    // var mongooseSchema = new mongoose.Schema({
    //     title    : {type : String},
    //     content  : {type : String},
    //     time     : {type : Date, default: new Date().getTime()},
    //     image    : {type : String}
    // });

    // // 添加 mongoose 实例方法
    // mongooseSchema.methods.findbyusername = function(username, callback) {
    //     return this.model('mongoose').find({username: username}, callback);
    // }

    // // 添加 mongoose 静态方法，静态方法在Model层就能使用
    // mongooseSchema.statics.findbytitle = function(title, callback) {
    //     return this.model('mongoose').find({title: title}, callback);
    // }

    // model
    // var mongooseModel = db.model('mongoose', mongooseSchema);

    // return {
        // db: db,
        // mongooseModel: mongooseModel
    // };
// }

// module.exports = mongooseModel;