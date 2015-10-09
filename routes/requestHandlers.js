var queryString = require('querystring'),
    fs = require('fs'),
    formidable = require('formidable');

function start(response) {
    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" enctype="multipart/form-data" ' +
        'method="post">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="text" name="username" value="wangshikun">' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(body);
    response.end();
}

function upload(response, request) {
    console.log("Request handler 'upload' was called.");

    var form = new formidable.IncomingForm();
    form.uploadDir = "/Users/shikun/develop/tudou/src/images/";
    console.log("about to parse1");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        // console.log(fields);
        // console.log(files);
        console.log(files.upload);
        console.log(files.upload.path);
        fs.renameSync(files.upload.path, files.upload.path + files.upload.name.substring(files.upload.name.lastIndexOf('.')));
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("图片上传成功:<br/>");
        response.write("<img src='/show'/>");
        response.end();
    });
}

function show(response) {
    console.log("Request handler 'show' was called.");
    fs.readFile("/Users/shikun/develop/tudou/src/images/new.png", "binary", function(error, file) {
        if (error) {
            response.writeHead(500, {
                "Content-Type": "text/plain"
            });
            response.write(error + "\n");
            response.end();
        } else {
            response.writeHead(200, {
                "Content-Type": "image/png"
            });
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;