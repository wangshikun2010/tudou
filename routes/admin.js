// 引入库
var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var gm = require('gm').subClass({imageMagick: true});
var mongo = require('./mongo');
var moment = require('moment');

var baseDir = "/Users/shikun/develop/tudou/src";

// mongoose model
var mongooseModel = mongo.model('mongoose');

// 请求首页
router.get('/', function(req, res, next) {
    // 定位到input
    res.render('admin/input', {
        title: '录入页'
    });
});

// 新增页
router.get('/add', function(req, res, next) {
    res.render('admin/input', {
        title: '录入页'
    });
});

// 列表
router.get('/list', function(req, res) {
    mongooseModel.find(function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);

            // 格式化时间
            for (var i in result) {
                result[i].time = moment(Number(result[i].time)).format("YYYY-MM-DD HH:mm:ss");
            }

            // 定位到list
            res.render('admin/list', {
                title: '列表页',
                list: result
            });
        }
    });
});

// 编辑详情
router.get(/edit.*$/, function(req, res) {

    console.log(req.query);
    console.log(req.query.id);

    if (req.query.id) {
        mongooseModel.find({ _id: req.query.id }, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                console.log(result);

                if (result.length == 0) {
                    res.status(404).send('<h1>出错了</h1>').end();
                } else {
                    res.render('admin/edit', {
                        title: '详情页',
                        data: {
                            id: result[0].id,
                            title: result[0].title,
                            content: result[0].content,
                            image_s: result[0].image_s
                        }
                    });
                }
            }
        });
    }
});

// 新增数据
router.post('/add', function(req, res) {
    console.log('request add interface');

    var form = new formidable.IncomingForm();
    form.uploadDir = baseDir + "/images/show/";
    form.parse(req, function(error, fields, files) {

        var path = files.image.path;

        // 判断图片大小
        if (files.image.size > 1.5 * 1024 * 1024) {
            // 删除用户上传的图片
            fs.unlink(path, function() {
                res.json({
                    status: 201,
                    description: '图片太大，不能超过1.5M',
                    data: {}
                });
            });
        } else {
            var newUrl = path + files.image.name.substring(files.image.name.lastIndexOf('.')),
                small = path + '_small' + files.image.name.substring(files.image.name.lastIndexOf('.'));

            fs.renameSync(path, newUrl);

            // 压缩出一张缩略图
            gm(newUrl).size(function(err, val) {
                console.log(val);

                gm(newUrl)
                .quality(30)
                .resize(parseInt(val.width / 3), parseInt(val.height / 3))
                .autoOrient()
                .write(small, function (err) {
                    if (!err) console.log('image resize complate');
                });
            });

            var doc = {
                title: fields.title,
                content: fields.content,
                time: new Date().getTime(),
                image: path.replace(baseDir, "") + files.image.name.substring(files.image.name.lastIndexOf('.')),
                image_s: path.replace(baseDir, "") + '_small' + files.image.name.substring(files.image.name.lastIndexOf('.'))
            };

            mongooseModel.create(doc, function(error) {
                if (error) {
                    console.log(error);
                    res.json({
                        status: 201,
                        description: '新增失败',
                        data: {}
                    });
                } else {
                    res.json({
                        status: 200,
                        description: '新增成功',
                        data: {}
                    });
                }
            });
        }
    });
});

// 修改
router.post('/update', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = baseDir + "/images/show/";
    form.parse(req, function(error, fields, files) {

        var path = files.image.path;

        // 判断图片大小
        if (files.image.size > 1.5 * 1024 * 1024) {
            fs.unlink(path, function() {    //fs.unlink 删除用户上传的文件
                res.json({
                    status: 201,
                    description: '图片太大，不能超过1.5M',
                    data: {}
                });
            });
        } else {
            var newUrl = path + files.image.name.substring(files.image.name.lastIndexOf('.')),
                small = path + '_small' + files.image.name.substring(files.image.name.lastIndexOf('.'));

            fs.renameSync(path, newUrl);

            gm(newUrl).size(function(err, val) {
                console.log(val);

                gm(newUrl)
                .quality(30)
                .resize(parseInt(val.width / 3), parseInt(val.height / 3))
                .autoOrient()
                .write(small, function (err) {
                    if (!err) console.log('image resize complate');
                });
            });

            var conditions = {
                _id: fields.id
            };

            var update = {
                $set: {
                    title: fields.title,
                    content: fields.content,
                    time: new Date().getTime(),
                    image: path.replace(baseDir, "") + files.image.name.substring(files.image.name.lastIndexOf('.')),
                    image_s: path.replace(baseDir, "") + '_small' + files.image.name.substring(files.image.name.lastIndexOf('.'))
                }
            };

            var options = {
                upsert: true
            };

            mongooseModel.update(conditions, update, options, function(error) {
                if (error) {
                    console.log(error);
                    res.json({
                        status: 201,
                        description: '更新失败',
                        data: {}
                    });
                } else {
                    res.json({
                        status: 200,
                        description: '更新成功',
                        data: {}
                    });
                }
            });
        }
    });
});

// 删除
router.get('/delete', function(req, res) {

    var conditions = {
        _id: req.query.id
    };

    mongooseModel.find(conditions, function(error, result) {

        // 同时删除上传的图片
        fs.unlinkSync(baseDir + result[0].image);
        fs.unlinkSync(baseDir + result[0].image_s);

        // 删除此条数据
        mongooseModel.remove(conditions, function(error) {
            if (error) {
                res.json({
                    status: 201,
                    description: '删除失败',
                    data: {}
                });
            } else {
                res.json({
                    status: 200,
                    description: '删除成功',
                    data: {}
                });
            }
        });
    });

});

module.exports = router;