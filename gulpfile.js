'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var webpack = require('webpack-stream');
var clearWebpack = require('webpack');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var webpackConfig = require("./webpack.config.js");
  // jade = require('jade'),
  // modRewrite = require('connect-modrewrite'),
  // webpack = require('gulp-webpack');


gulp.task('sass', function () {
	return gulp.src('./src/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());
});

gulp.task('sass:watch', function () {
	gulp.watch('./src/styles/*.scss', ['sass']);
});

gulp.task('webpack', function () {
	return gulp.src ('src/entry.js')
		.pipe(webpack (webpackConfig))
		.pipe(gulp.dest ('dist/'))
		.pipe(connect.reload ());
})

gulp.task('webpack:watch', function () {
	gulp.watch('./src/**/*.*js', ['webpack']);
});

gulp.task('connect', function() {
	connect.server({
		livereload: true,
	});
});

gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new clearWebpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new clearWebpack.optimize.DedupePlugin(),
		new clearWebpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	clearWebpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// Default Task (Dev environment)
gulp.task('default', ['webpack:build', 'sass', 'connect']);

// Production build
gulp.task('build', ['webpack:build', 'sass',]);

// Development
gulp.task('dev', ['webpack', 'webpack:watch', 'sass', 'sass:watch', 'connect', ]);
