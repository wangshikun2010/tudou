
// 引入库
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 请求首页
router.get('/', function(req, res, next) {
    console.log('request home page');

    // 定位到首页
    res.render('news', {
        title: '挺好的',
        data: [
            {
                id: 1,
                content: ''
            },
            {
                id: 2,
                content: ''
            }
        ]
    });

});

// 关于我们
router.get('/about', function(req, res, next) {
    console.log('request about page');

    // 定位到首页
    res.render('about', {
        title: '关于我们',
        data: [
            {
                id: 1,
                content: '这是第一行字'
            },
            {
                id: 2,
                content: '这是第二行字'
            }
        ]
    });


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
    //     username : {type : String, default : '匿名用户'},
    //     title    : {type : String},
    //     content  : {type : String},
    //     time     : {type : Date, default: Date.now},
    //     age      : {type : Number}
    // });

    // // 添加 mongoose 实例方法
    // mongooseSchema.methods.findbyusername = function(username, callback) {
    //     return this.model('mongoose').find({username: username}, callback);
    // }

    // // 添加 mongoose 静态方法，静态方法在Model层就能使用
    // mongooseSchema.statics.findbytitle = function(title, callback) {
    //     return this.model('mongoose').find({title: title}, callback);
    // }

    // // model
    // var mongooseModel = db.model('mongoose', mongooseSchema);

    // 增加记录 基于 entity 操作
    // var doc = {
    //     username : 'wangshikun',
    //     title : '王仕昆',
    //     content : '前端开发工程师',
    //     age: 20
    // };
    // var mongooseEntity = new mongooseModel(doc);
    // mongooseEntity.save(function(error) {
    //     if(error) {
    //         console.log('保存失败');
    //     } else {
    //         console.log('保存成功');
    //     }
    //     // 关闭数据库链接
    //     db.close();
    // });

});

module.exports = router;