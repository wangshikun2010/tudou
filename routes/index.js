
// 引入库
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 请求首页
router.get('/', function(req, res, next) {
    // 首页
    res.render('index', {
        title: '土豆装修工作室'
    });

});

// 装修案例
router.get('/show', function(req, res, next) {
    res.render('show', {
        title: '装修案例'
    });
});

// 关于我们
router.get('/about', function(req, res, next) {
    res.render('about');
});

module.exports = router;