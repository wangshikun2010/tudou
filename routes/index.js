
// 引入库
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 请求首页
router.get('/', function(req, res, next) {
    console.log('request home page');

    // 首页
    res.render('index', {
        title: '土豆装修工作室',
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

// 装修案例
router.get('/show', function(req, res, next) {
    console.log('request show page');

    // 首页
    res.render('show', {
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
});

module.exports = router;