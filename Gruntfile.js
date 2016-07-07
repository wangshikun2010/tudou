module.exports = function(grunt) {

    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 清除文件
        clean: {
            build: ['build/**']
        },

        // 复制
        copy: {
            ejs: {
                files: [{
                    expand: true,
                    cwd: 'views/',
                    src: '**/*.ejs',
                    dest: 'build/views'
                }]
            }
        },

        // 编译less
        less: {
            build: {
                options: {
                    paths: ['src/css/'],    // css目录
                    compress: true         // 压缩css
                },
                files: [{
                    expand: true,
                    cwd: 'src/css/',
                    src: ['**/*.less'],
                    dest: 'src/css/',
                    ext: '.css'
                }]
            }
        },

        // 压缩css
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/css/lib/',
                    src: ['**/*.css'],
                    dest: 'build/css/lib/'
                }]
            }
        },

        // 根据文件生成md5
        rev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        'build/css/**/*.css', '!build/css/lib/*.css'
                    ]
                }]
            }
        },

        useminPrepare: {
            html: 'build/views/**/*.ejs',
            options: {
                dest: 'build',
                flow: {
                    steps: {
                        js: ['uglify']
                    },
                    post: {}
                }
            }
        },

        usemin: {
            css: {
                files: {
                    src: ['build/css/**/*.css']
                }
            },
            html: 'build/views/**/*.ejs',
            options: {
                assetsDirs: ['build']
                // patterns: {
                //     js: [
                //         [/(img\.png)/, 'Replacing reference to image.png']
                //     ]
                // }
            }
        }


        // uglify: {
        //     my_target: {
        //         files: [{
        //             expand: true,

        //             //为了合并时不影响到v1下面的JS
        //             cwd: 'src/v2/js',       // js目录
        //             src: '**/**/*.js',      // js文件
        //             dest: 'build/v2/js'     // 输出目录
        //         }]
        //     }
        // },

        // // 使用requirejs合并amd格式的js模块
        // requirejs: {
        //     compile: {
        //         options: {
        //             appDir: 'src/v2/js/',
        //             baseUrl: './',
        //             paths: {
        //                 highcharts: 'empty:',
        //                 u: '../../js/utils',
        //                 c: '../../js/site',
        //                 comp: '../../components',
        //                 v2: '.'
        //             },
        //             dir: 'build/v2/js',         // 导出模块
        //             optimize: 'uglify',         // 使用uglify压缩文件

        //             // 指定文件合并时指定模块不合并
        //             modules: [{
        //                     name: 'company/company',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'company/view',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'company/review',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'ugc/main-complete',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'ugc/ugc-salary',
        //                     exclude: ['c/widgets', 'c/auth_dialog', 'u/validator']
        //                 }, {
        //                     name: 'ugc/ugc_common',
        //                     exclude: ['c/widgets', 'u/validator']
        //                 }, {
        //                     name: 'ugc/ugc_review',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'ugc/ugc_interview',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'search/search-company',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'search/search-interview',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'search/search-jobs',
        //                     exclude: ['c/widgets', 'c/auth_dialog', 'c/company/salary_desc', 'u/webuploader']
        //                 }, {
        //                     name: 'search/search-salary',
        //                     exclude: ['c/widgets', 'c/auth_dialog', 'c/company/salary_desc']
        //                 }, {
        //                     name: 'job/job-detail',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'job/job_detail',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 },
        //                 //活动start
        //                 {
        //                     name: 'activity/jinping/list',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'activity/jinping/reason',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'activity/jinping/qifu1',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 },
        //                 //活动end
        //                 {
        //                     name: 'company5/company5',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'company5/special1',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'company5/special2',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'auth/auth',
        //                     exclude: ['c/widgets', 'c/auth_dialog']
        //                 }, {
        //                     name: 'profile/create-haitou',
        //                     exclude: ['c/widgets', 'c/auth_dialog', 'u/webuploader', 'u/My97DatePicker/WdatePicker', 'u/validator']
        //                 }, {
        //                     name: 'profile/haitou',
        //                     exclude: ['c/widgets', 'v2/profile/create-haitou']
        //                 }
        //             ],
        //             onModuleBundleComplete: function(data) {
        //                 // console.log(data.name.green + ' compress Complete');
        //             }
        //         }
        //     }
        // },

        // ejs: {
        //     all: {
        //         options: {
        //             //修改生成的html的CSS路径
        //             previewUrl: '../../..',
        //             isLogin: true
        //         },
        //         cwd: 'src/v2/ejs',
        //         src: ['**/*.ejs'],
        //         dest: 'src/v2/html/',
        //         expand: true,
        //         ext: '.html'
        //     }
        // },

        // watch: {
        //     ejs: {
        //         files: [],
        //         tasks: []
        //     },
        //     less: {
        //         files: ['**/*.less'],
        //         tasks: ['less:build2']
        //     }
        // }
    });

    // 加载任务
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-requirejs');
    // grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'copy', 'less:build', 'cssmin', 'rev']);
};