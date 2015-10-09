
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

// model
var mongooseModel = mongo.model('mongoose', mongooseSchema);

// 请求首页
router.get('/', function(req, res, next) {
    res.render('index');
});

// 装修案例
router.get('/show', function(req, res, next) {
    mongooseModel.find(function(error, result) {
        if (error) {
            console.log(error);
        } else {
            res.render('show', {
                title: '列表页',
                list: result
            });
        }
    });
});

// 案例详情
router.get(/show\/.+\.html$/, function(req, res) {
    // console.log(req.url);

    var first = req.url.substr(req.url.lastIndexOf('/') + 1);
    var id = first.substr(0, first.lastIndexOf('.'));

    // console.log(id);

    mongooseModel.find({ _id: id }, function(error, result) {
        if (error) {
            console.log(error);
        } else {
            res.render('detail', {
                title: result[0].title,
                data: result[0]
            });
        }
    });
});

// 最新动态
router.get('/news', function(req, res, next) {
    res.render('news', {
        title: '最新动态'
    });
});

// 关于我们
router.get('/about', function(req, res, next) {
    res.render('about', {
        title: '关于我们'
    });
});

module.exports = router;