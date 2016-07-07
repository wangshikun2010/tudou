var gulp = require('gulp'),
    less = require('gulp-less'),                // 编译less
    sourcemaps = require('gulp-sourcemaps'),    // 生成sourcemap文件
    debug = require('gulp-debug'),              // 调试信息
    cached = require('gulp-cached'),            // 缓存文件信息
    progeny = require('gulp-progeny'),          //
    plumber = require('gulp-plumber');

gulp.task('default', function() {
    console.log('exec default task');
});

gulp.task('')

// 编译css目录下less到build目录
gulp.task('css', function() {
    gulp.src(['src/css/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('build/css'))
});

// 编译css目录下的less
gulp.task('c', function() {
    return gulp
        .src('src/css/**/*.less')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cached('less'))
        .pipe(progeny({
            regexp: /^\s*@import\s*(?:\(\w+\)\s*)?['"]([^'"]+)['"]/
        }))
        .pipe(debug({ title: 'LESS' }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('../css'))
        .pipe(gulp.dest('src/css'));
});

// 监听less文件变动并执行编译任务
gulp.task('watch', function() {
    gulp.watch('src/css/**/*.less', ['c']);
});