/**
 * Created by Administrator on 14-10-7.
 */
'use strict';
module.exports = function(grunt) {
	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	var config = {
		app: 'app',
		dist: 'dist'
	};

	// LiveReload的默认端口号，你也可以改成你想要的端口号
	var lrPort = 35729;
	// 使用connect-livereload模块，生成一个与LiveReload脚本
	var lrSnippet = require('connect-livereload')({ port: lrPort });
	// 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
	var lrMiddleware = function(connect) {
		return[
			// 把脚本，注入到静态文件中
			lrSnippet,
//			connect.static('.tmp'),
//			connect().use('/bower_components', connect.static('./bower_components')),
			// 静态文件服务器的路径
			connect.static(config.app)
// 启用目录浏览(相当于IIS中的目录浏览)
//			connect.directory(options.base)
		];
	};
	// 项目配置(任务配置)
	grunt.initConfig({
         config: config,
         pkg: grunt.file.readJSON('package.json'),
         jshint: {
             options: {
                 jshintrc: '.jshintrc',
                 reporter: require('jshint-stylish')
             },
             all: [
                 'Gruntfile.js',
                 '<%= config.app %>/scripts/*.js',
                 '<%= config.dist %>/scripts/*.js',
	             'test/spec/**.js'
             ]
         },
         // Empties folders to start fresh
         clean: {
             dist: {
                 files: [{
	                 dot: true,
	                 src: [
		                 '<%= config.dist %>/*'
	                 ]
                 }]
             }
         },
//		
			// Mocha testing framework configuration options
			mocha: {
				all: {
					options: {
						run: true,
						urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
					}
				}
			},
//	

		// 通过connect任务，创建一个静态服务器
         connect: {
             options: {
				 // 服务器端口号
                 port: 8001,
                 open:true,
                 livereload:lrPort,
				 // 服务器地址(可以使用主机名localhost，也能使用IP)
                 hostname: 'localhost'
				 // 物理路径(默认为. 即根目录)
//                 base: '.'
             },
             livereload: {
                 options: {
					// 通过LiveReload脚本，让页面重新加载。
	                 middleware: lrMiddleware
                 }
             },
			test: {
				options: {
					open: false,
					port: 9001,
					middleware: function(connect) {
						return [
						connect.static('test'),
//						connect().use('/bower_components', connect.static('./bower_components')),
						connect.static(config.app)
						];
					}
				}
			}
         },
		 // 通过watch任务，来监听文件是否有更改
         watch: {
	         js: {
		         files: ['<%= config.app %>/scripts/*.js'],
		         tasks: ['jshint'],
		         options: {
			         livereload: true
		         }
	         },
             livereload: {
				 // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
                 options: {
	                 livereload: lrPort
                 },
				 // '**' 表示包含所有的子目录
				 // '*' 表示包含所有的文件
                 files: [
	                 '<%= config.app %>/scripts/*.js',
	                 '<%= config.app %>/styles/*.css',
	                 '<%= config.app %>/styles/**/*.css',
	                 '<%= config.app %>/*.html'
                 ]
             }
         },
         // The following *-min tasks produce minified files in the dist folder
         imagemin: {
             dist: {
                 files: [{
	                 expand: true,
	                 cwd: '<%= config.app %>/images',
	                 src: ['**/*.{gif,jpeg,jpg,png,ico}','*.{gif,jpeg,jpg,png,ico}'],
	                 dest: '<%= config.dist %>/images'
                 }]
             }
         },
         cssmin: {
            dist: {
              files: [{
                '<%= config.dist %>/styles/main.css': [
                  '<%= config.app %>/styles/*.css'
                ]
              },{
	              '<%= config.dist %>/styles/skin/candySkin.css': [
		              '<%= config.app %>/styles/skin/candySkin.css'
	              ]
              },{
	              '<%= config.dist %>/styles/skin/iceSkin.css': [
		              '<%= config.app %>/styles/skin/iceSkin.css'
	              ]
              }]
            }
         },
		 htmlmin:{
			dist: {                                      // Target
				options: {                                 // Target options
					removeComments: true,
					collapseWhitespace: true
				},
				files: {                                   // Dictionary of files
					'<%= config.dist %>/index.html': '<%= config.app %>/index.html'     // 'destination': 'app'
				}
			}
		 },
         uglify: {
            dist: {
              files: {
                '<%= config.dist %>/scripts/main.js': [
	                '<%= config.app %>/scripts/**/*.js',
	                '<%= config.app %>/scripts/*.js'
                ]
              }
            }
         },
         concat: {
            dist: {}
         },
         // Copies remaining files to places other tasks can use
		copy: {
		 dist: {
		     files: [{
		         expand: true,
		         dot: true,
		         cwd: '<%= config.app %>',
		         dest: '<%= config.dist %>',
		         src: [
		             '*.{ico,png,txt,md,manifest}',
		             'bower_components/**/*.*',
		             '{,*/}*.html',
		             'styles/font/*.*',
		             'styles/font/**/*.*',
		             'styles/font/**/*.*'
		         ]
		     }]
		    }
		}
     });


	grunt.registerTask('live', ['connect:livereload', 'watch']);
	grunt.registerTask('build',[
		'clean:dist',
		'concat',
		'imagemin',
		'cssmin',
		'htmlmin',
		'uglify',
		'copy'
	]);
	grunt.registerTask('test', function () {

	    grunt.task.run([
	      'connect:test',
	      'mocha'
	    ]);
    });
	grunt.registerTask('default', 'start the server and preview your app, --allow-remote for remote access', function () {
		if (grunt.option('allow-remote')) {
			grunt.config.set('connect.options.hostname', '0.0.0.0');
		}
		grunt.task.run([
			               'build',
			               'jshint',
			               'live'
		               ]);
	});
};