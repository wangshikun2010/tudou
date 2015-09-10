
// 引入库
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// router.use(function timeLog(req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

// var myDb = openDb();

// 请求首页
router.get('/', function(req, res, next) {
    // 定位到input
    res.render('admin/input', {
        title: '输入页'
    });

});

// function openDb() {

//     // 连接数据库
//     var db = mongoose.connect('mongodb://@localhost:10001/test').connection;

//     // 打开
//     db.once('open', function() {
//         console.log("mongodb connection open");
//     });

//     // 错误
//     db.on('error', function(error) {
//         console.log(error);
//         console.log('错误');
//     });

//     // Schema 结构
//     var mongooseSchema = new mongoose.Schema({
//         title    : {type : String},
//         content  : {type : String},
//         time     : {type : Date, default: new Date().getTime()},
//     });

//     // // 添加 mongoose 实例方法
//     // mongooseSchema.methods.findbyusername = function(username, callback) {
//     //     return this.model('mongoose').find({username: username}, callback);
//     // }

//     // // 添加 mongoose 静态方法，静态方法在Model层就能使用
//     mongooseSchema.statics.findbytitle = function(title, callback) {
//         return this.model('mongoose').find({title: title}, callback);
//     }

//     // model
//     var mongooseModel = db.model('mongoose', mongooseSchema);

//     return {
//         db: db,
//         mongooseModel: mongooseModel
//     };
// }

// // 新增数据
// router.get('/add', function(req, res, next) {
//     console.log('request add interface');

//     console.log(req.query);

//     // var myDb = openDb();

//     res.json({
//         status: 200,
//         description: '操作成功',
//         data: {}
//     });

//     // 增加记录 基于 entity 操作
//     var doc = {
//         title : req.query.title,
//         content : req.query.content,
//         time: new Date().getTime()
//     };

//     // var mongooseEntity = new mongooseModel(doc);
//     // mongooseEntity.save(function(error) {
//     //     if(error) {
//     //         console.log('保存失败');
//     //     } else {
//     //         console.log('保存成功');
//     //     }
//     //     // 关闭数据库链接
//     //     db.close();
//     // });

//     // 增加记录 基于model操作
//     myDb.mongooseModel.create(doc, function(error) {
//         if (error) {
//             console.log('新增失败');
//         } else {
//             console.log('新增成功');
//         }

//         // myDb.db.close();
//     });

// });

// // 列表
// router.get('/list', function(req, res) {

//     myDb.mongooseModel.findbytitle('张三', function(error, result) {
//         if (error) {
//             console.log(error);
//         } else {
//             // console.log('search result');
//             console.log(result);

//             // 定位到list
//             res.render('admin/list', {
//                 title: '列表页',
//                 list: result
//             });
//         }

//     });

// });

// // 列表
// router.get('/edit', function(req, res) {

//     // console.log(req);

//     // myDb.mongooseModel.find({id: "55dab7f793eaa78ebd402754"} function(error, result) {
//     //     if (error) {
//     //         console.log(error);
//     //     } else {
//     //         console.log(result);

//             res.render('admin/edit', {
//                 title: '详情页',
//                 data: {
//                     id: '1',
//                     title: '王世坤',
//                     content: '你在干啥呢'
//                 }
//             });
//         // }

//     // });

// });

// // 修改记录
// router.get('/update', function(req, res, next) {
//     var conditions = {
//         title: '王仕昆'
//     };

//     var update = {
//         $set: {
//             title: '张三',
//             content: '张三是个好人'
//         }
//     };

//     var options = {
//         upsert: true
//     };

//     myDb.mongooseModel.update(conditions, update, options, function(error) {
//         if (error) {
//             console.log('更新失败');
//         } else {
//             console.log('更新成功');
//             res.send('更新成功');
//         }
//     });
// });

module.exports = router;