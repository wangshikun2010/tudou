
// 引入库
var express = require('express');
var router = express.Router();
var mongo = require('./mongo');
var moment = require('moment');

// Schema 结构
var mongooseSchema = new mongo.Schema({
    title    : {type : String},
    content  : {type : String},
    time     : {type : String, default: new Date().getTime()},
    image    : {type : String},
    image_s  : {type : String}
});

// 添加 mongoose 静态方法，静态方法在Model层就能使用
mongooseSchema.statics.findbytitle = function(title, callback) {
    return this.model('mongoose').find({title: title}, callback);
}

// model
var mongooseModel = mongo.model('mongoose', mongooseSchema);

// 请求首页
router.get('/', function(req, res, next) {
    res.render('index', {
        title: ''
    });
});

// 装修案例
router.get('/show', function(req, res, next) {
    mongooseModel.find(function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);

            // 定位到list
            res.render('show', {
                title: '列表页',
                list: result
            });
        }
    });
});

// 关于我们
router.get('/about', function(req, res, next) {
    res.render('about');
});

module.exports = router;