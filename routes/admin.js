
// 引入库
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var myDb = openDb();

// 请求首页
router.get('/', function(req, res, next) {

    console.log('访问录入页');

    // 定位到input
    res.render('admin/input', {
        title: '录入页'
    });

});

function openDb() {

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

    // Schema 结构
    var mongooseSchema = new mongoose.Schema({
        title    : {type : String},
        content  : {type : String},
        time     : {type : Date, default: new Date().getTime()},
    });

    // // 添加 mongoose 实例方法
    // mongooseSchema.methods.findbyusername = function(username, callback) {
    //     return this.model('mongoose').find({username: username}, callback);
    // }

    // // 添加 mongoose 静态方法，静态方法在Model层就能使用
    mongooseSchema.statics.findbytitle = function(title, callback) {
        return this.model('mongoose').find({title: title}, callback);
    }

    // model
    var mongooseModel = db.model('mongoose', mongooseSchema);

    return {
        db: db,
        mongooseModel: mongooseModel
    };
}

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
    myDb.mongooseModel.create(doc, function(error) {
        if (error) {
            console.log('新增失败');
        } else {
            console.log('新增成功');
        }
    });

});

// 列表
router.get('/list', function(req, res) {
    myDb.mongooseModel.find(function(error, result) {
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
        myDb.mongooseModel.find({ _id: req.query.id }, function(error, result) {
            if (error) {
                console.log(error);
            } else {
                console.log(result);

                res.render('admin/edit', {
                    title: '详情页',
                    data: {
                        id: result[0].id,
                        title: result[0].title,
                        content: result[0].content
                    }
                });
            }
        });
    }

});

// 修改
router.get('/update', function(req, res, next) {
    // console.log(req);
    // console.log(req.query);
    // console.log('id: ' + req.id);
    // console.log('content: ' + req.icontentd);
    // console.log('title: ' + req.title);

    var conditions = {
        // _id: 'ObjectId('+req.query.id+')'
        _id: req.query.id
    };

    // console.log(conditions);

    var update = {
        $set: {
            title: req.query.title,
            content: req.query.content
        }
    };

    var options = {
        upsert: true
    };

    myDb.mongooseModel.update(conditions, update, options, function(error) {
        if (error) {
            console.log(error);
            console.log('更新失败');

            res.json({
                status: 201,
                description: '更新失败',
                data: {}
            });

        } else {
            console.log('更新成功');

            res.json({
                status: 200,
                description: '更新成功',
                data: {}
            });
        }
    });
});

// 删除
router.get('/delete', function(req, res) {

    var conditions = {
        _id: req.query.id
    };

    myDb.mongooseModel.remove(conditions, function(error) {
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