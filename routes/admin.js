// 引入库
var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var gm = require('gm').subClass({imageMagick: true});
var mongo = require('./mongo');

// model
var mongooseModel = mongo.model('mongoose');

// 请求首页
router.get('/', function(req, res, next) {
    // 定位到input
    res.render('admin/input', {
        title: '录入页'
    });
});

// 新增数据
router.get('/add', function(req, res, next) {
    console.log('request add interface');
    console.log(req.query);

    res.json({
        status: 200,
        description: '操作成功',
        data: {}
    });

    // 增加记录 基于 entity 操作
    var doc = {
        title : req.query.title,
        content : req.query.content,
        time: new Date().getTime()
    };

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

    // 增加记录 基于model操作
    mongooseModel.create(doc, function(error) {
        if (error) {
            console.log('新增失败');
        } else {
            console.log('新增成功');
        }
    });

});

// 列表
router.get('/list', function(req, res) {
    mongooseModel.find(function(error, result) {
        if (error) {
            console.log(error);
        } else {
            console.log(result);

            // 定位到list
            res.render('admin/list', {
                title: '列表页',
                list: result
            });
        }
    });
});

// 列表
router.get(/edit.*$/, function(req, res) {

    console.log(req);
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
                            content: result[0].content
                        }
                    });
                }
            }
        });
    }

});

// 修改
router.post('/update', function(req, res, next) {

    var form = new formidable.IncomingForm();
    form.uploadDir = "/Users/shikun/develop/tudou/src/images/show/";
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

            // console.log(files.image);
            fs.renameSync(path, newUrl);

            gm(newUrl).size(function(err, val) {
                // console.log('get image size');
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
                    image: path.replace("/Users/shikun/develop/tudou/src", "") + files.image.name.substring(files.image.name.lastIndexOf('.')),
                    image_s: path.replace("/Users/shikun/develop/tudou/src", "") + '_small' + files.image.name.substring(files.image.name.lastIndexOf('.'))
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

    mongooseModel.remove(conditions, function(error) {
        if (error) {
            console.log(error);
            console.log('删除失败');

            res.json({
                status: 201,
                description: '删除失败',
                data: {}
            });
        } else {
            console.log('删除成功');

            res.json({
                status: 200,
                description: '删除成功',
                data: {}
            });
        }
    });
});

module.exports = router;