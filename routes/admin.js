// 引入库
var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var formidable = require('formidable');
var gm = require('gm').subClass({imageMagick: true});
var mongo = require('./mongo');
var moment = require('moment');

var baseDir = process.env.PWD + "/src";

// mongoose model
var tudouModel = mongo.model('tudou_images');

var sequenceId = 0;

function getNextSequenceValue(callback) {
    var countersModel = mongo.model('counters');
    countersModel.update({_id: "product_id"}, {
        $inc:{sequence_value:1}
    }, {upsert: false}, function(error) {
        console.log('update success');

        countersModel.find({ _id: 'product_id' }, function(error, result) {
            console.log(result);
            console.log('new value: ' + result[0].sequence_value);
            sequenceId = result[0].sequence_value;
            callback();
        });
    });
}

// 请求首页
router.get('/', function(req, res, next) {
    res.render('admin/input', {
        title: '列表页'
    });
    next();
}, function(req, res) {
    console.log('请求录入页完成');
});

// 新增页
router.get('/add', function(req, res, next) {
    res.render('admin/input', {
        title: '录入页'
    });
});

// 列表
router.get('/list', function(req, res) {
    tudouModel.find(function(error, result) {
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
        tudouModel.find({ _id: req.query.id }, function(error, result) {
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

/**
 * 压缩图片
 * @param  {string} oldurl 旧地址
 * @param  {string} newurl 新地址
 * @return {}
 */
function resizeImage(oldurl, newurl) {
    var maxWidth = 1120,
        maxHeight = 1000,
        fixedWidth = 280,
        fixedHeight = 250,
        scale = maxWidth / maxHeight;

    gm(oldurl).size(function(err, val) {
        // console.log(val);

        var x = 0, y = 0;

        // 横向图片
        if (val.width >= val.height) {
            if (val.width >= maxWidth) {
                x = (val.width - maxWidth) / 2;
            }

            if (val.height > maxHeight) {
                y = (val.height - maxHeight) / 2;
            } else {
                maxHeight = val.height;
                maxWidth = parseInt(maxHeight * scale);
                x = (val.width - maxWidth) / 2;
            }
        // 竖向图片
        } else {
            if (val.height >= maxHeight) {
                y = (val.height - maxHeight) / 2;
            }

            if (val.width > maxWidth) {
                x = (val.width - maxWidth) / 2;
            } else {
                maxWidth = val.width;
                maxHeight = parseInt(maxWidth / scale);
                y = (val.height - maxHeight) / 2;
            }
        }

        // console.log(maxWidth, maxHeight, x, y);

        // 调节图片质量，剪切并缩放图片
        gm(oldurl)
        .quality(80)
        .crop(maxWidth, maxHeight, x, y)
        .resize(fixedWidth, fixedHeight)
        .autoOrient()
        .write(newurl, function (err) {
            if (!err) {
                console.log('image crop and resize complate');
            }
        });
    });
}

// 新增数据
router.post('/add', function(req, res) {
    console.log('request add interface');

    var form = new formidable.IncomingForm();
    form.uploadDir = baseDir + "/images/show/";
    form.parse(req, function(error, fields, files) {

        var path = files.image.path;

        // 判断图片大小
        if (files.image.size > 1 * 1024 * 1024) {
            // 删除用户上传的图片
            fs.unlink(path, function() {
                res.json({
                    status: 201,
                    description: '图片太大，不能超过1M',
                    data: {}
                });
            });
        } else {
            var suffix = files.image.name.substring(files.image.name.lastIndexOf('.')),
                newUrl = path + suffix,
                small = path + '_small' + suffix;

            console.log(suffix);

            // 给图片重命名
            fs.renameSync(path, newUrl);

            if (suffix.toUpperCase() != '.PNG') {
                gm(newUrl)
                .quality(30)
                .write(newUrl, function (err) {
                    if (!err) {
                        console.log('image min complate');
                    }

                    resizeImage(newUrl, small);
                });
            } else {
                resizeImage(newUrl, small);
            }

            // 获取下一个序列值并存入数据库
            getNextSequenceValue(function() {
                console.log('new id' + sequenceId);

                var doc = {
                    _id: sequenceId,
                    title: fields.title,
                    content: fields.content,
                    time: new Date().getTime(),
                    image: path.replace(baseDir, "") + suffix,
                    image_s: path.replace(baseDir, "") + '_small' + suffix
                };

                tudouModel.create(doc, function(error) {
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
            });
        }
    });
});

// 修改
router.post('/update', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = baseDir + "/images/show/";
    form.parse(req, function(error, fields, files) {

        if (files.image) {
            var path = files.image.path;

            // 判断图片大小
            if (files.image.size > 1 * 1024 * 1024) {
                fs.unlink(path, function() {    //fs.unlink 删除用户上传的文件
                    res.json({
                        status: 201,
                        description: '图片太大，不能超过1M',
                        data: {}
                    });
                });
            } else {

                var suffix = files.image.name.substring(files.image.name.lastIndexOf('.')),
                    newUrl = path + suffix,
                    small = path + '_small' + suffix;

                console.log(suffix);

                // 给图片重命名
                fs.renameSync(path, newUrl);

                if (suffix.toUpperCase() != '.PNG') {
                    gm(newUrl)
                    .quality(30)
                    .write(newUrl, function (err) {
                        if (!err) {
                            console.log('image min complate');
                        }

                        resizeImage(newUrl, small);
                    });
                } else {
                    resizeImage(newUrl, small);
                }

                var conditions = {
                    _id: fields.id
                };

                // 查询之前词条数据上传的图片
                var oldImage, oldImage_s;
                tudouModel.find(conditions, function(error, result) {
                    oldImage = baseDir + result[0].image;
                    oldImage_s = baseDir + result[0].image_s;
                });

                var update = {
                    $set: {
                        title: fields.title,
                        content: fields.content,
                        time: new Date().getTime(),
                        image: path.replace(baseDir, "") + suffix,
                        image_s: path.replace(baseDir, "") + '_small' + suffix
                    }
                };

                var options = {
                    upsert: true
                };

                tudouModel.update(conditions, update, options, function(error) {
                    if (error) {
                        console.log(error);
                        res.json({
                            status: 201,
                            description: '更新失败',
                            data: {}
                        });
                    } else {
                        // 删除之前上传的图片
                        fs.exists(oldImage, function(exists) {
                            if (exists) {
                                fs.unlinkSync(oldImage);
                            }
                        });
                        fs.exists(oldImage_s, function(exists) {
                            if (exists) {
                                fs.unlinkSync(oldImage_s);
                            }
                        });

                        res.json({
                            status: 200,
                            description: '更新成功',
                            data: {}
                        });
                    }
                });
            }
        } else {
            var conditions = {
                _id: fields.id
            };

            var update = {
                $set: {
                    title: fields.title,
                    content: fields.content,
                    time: new Date().getTime()
                }
            };

            var options = {
                upsert: true
            };

            tudouModel.update(conditions, update, options, function(error) {
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

    tudouModel.find(conditions, function(error, result) {

        // 同时删除上传的图片
        fs.exists(baseDir + result[0].image, function(exists) {
            if (exists) {
                fs.unlinkSync(baseDir + result[0].image);
            }
        });
        fs.exists(baseDir + result[0].image_s, function(exists) {
            if (exists) {
                fs.unlinkSync(baseDir + result[0].image_s);
            }
        });

        // 删除此条数据
        tudouModel.remove(conditions, function(error) {
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