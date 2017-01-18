'use strict';

var gulp = require('gulp');
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var webpack = require('webpack');
// var webpack = require('webpack-stream');
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
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

// gulp.task('webpack', function () {
// 	return gulp.src ('src/entry.js')
// 		.pipe(webpack (require ('./webpack.config.js')))
// 		.pipe(gulp.dest ('dist/'))
// 		.pipe(connect.reload ());
// })

// gulp.task('webpack:watch', function () {
// 	gulp.watch('./src/**/*.*js', ['webpack']);
// });

gulp.task('connect', function() {
	// connect.server({
	// 	livereload: true,
	// });
});

/*gulp.task("webpack-dev-server", function(callback) {
	// Start a webpack-dev-server
	var compiler = webpack({
		// configuration
	});

	new WebpackDevServer(compiler, {
		// server and middleware options
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		// Server listening
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

		// keep the server alive or continue?
		// callback();
	});
});*/











// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function() {
	gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});


gulp.task("webpack:build", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("webpack:build-dev", function(callback) {
	// run webpack
	devCompiler.run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

gulp.task("webpack-dev-server", function(callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = "eval";
	myConfig.debug = true;

	// Start a webpack-dev-server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: "/" + myConfig.output.publicPath,
		stats: {
			colors: true
		}
	}).listen(8080, "localhost", function(err) {
		if(err) throw new gutil.PluginError("webpack-dev-server", err);
		gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
	});
});












// Default Task (Dev environment)
gulp.task('default', ['webpack-dev-server', 'sass', ]);//'connect', 'webpack',

// Development Build
gulp.task('build-dev', ['webpack-dev-server', 'webpack:build-dev',  'sass:watch'], function() {
	gulp.watch(['app/**/*'], ['webpack:build-dev']);
});

// Production Build
gulp.task('build', ['webpack:build','sass']);

// Development
gulp.task('dev', ['webpack-dev-server', 'connect', 'webpack', 'webpack:watch', 'sass', 'sass:watch']);








/*
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del', 'browser-sync']
});

// Constants
var BUILD_DIR = 'build/';
var TMP_DIR = '../public/';

// Webpack
gulp.task('webpack:vendor', function() {
  return gulp.src('app/scripts/vendor.js')
    .pipe(webpack({
      output: {
        filename: "vendor.js"
      }
    }))
    .pipe(gulp.dest(TMP_DIR + 'scripts/'))
});

gulp.task('webpack', function() {
  return gulp.src('app/scripts/entry.js')
    .pipe(webpack({
      module: {
        loaders: [
          { test: /\.json$/, loader: "json-loader" }
        ]
      },
      output: {
        filename: "app.js"
      }
    }))
    .pipe(gulp.dest(TMP_DIR + 'scripts/'))
    .pipe($.browserSync.reload({stream:true}));
});

// Views
gulp.task('jade:dev', function(){
  return gulp.src('app/views/!**!/!*.jade')
    .pipe($.jade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest(TMP_DIR + 'views'));
});

gulp.task('jade:dist', function(){
  return gulp.src('app/views/!**!/!*.jade')
    .pipe($.jade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest(BUILD_DIR + 'views'));
});

// Html
gulp.task('html:dev', ['jade:dev'], function() {
  return gulp.src(TMP_DIR + 'views/index.html')
    .pipe(gulp.dest(TMP_DIR))
    .pipe($.browserSync.reload({stream:true}));
});

gulp.task('html:dist', ['jade:dist'], function() {
  return gulp.src(BUILD_DIR + 'views/index.html')
    .pipe(gulp.dest(BUILD_DIR))
});

// Sass
gulp.task('sass', function () {
  return $.rubySass('app/styles/app.scss')
    .on('error', function (err) {
      console.error('Error!', err.message);
    })

    .pipe(gulp.dest(TMP_DIR + 'styles'))
    .pipe($.browserSync.reload({stream:true}));
});

// img
gulp.task('img', function () {
  return gulp.src('app/img/!**!/!*')
    .pipe(gulp.dest(BUILD_DIR + 'img/'))
    .pipe($.browserSync.reload({stream:true}));
});

// fonts
gulp.task('fonts', function () {
  return gulp.src('app/fonts/!**!/!*')
    .pipe(gulp.dest(BUILD_DIR + 'fonts/'))
    .pipe($.browserSync.reload({stream:true}));
});

// .htaccess
gulp.task('htaccess', function () {
  return gulp.src('.htaccess')
    .pipe(gulp.dest(BUILD_DIR));
});

// Static server
gulp.task('serve:dev', ['dev'], function() {
  $.browserSync({
    server: {
      baseDir: [".", TMP_DIR, "app"],
      middleware: [
        modRewrite([
          '!\\.html|\\.js|\\.css|\\.png|\\.ttf|\\.woff|\\.jpg|\\.gif|\\.svg|\\.txt$ /index.html [L]'
        ])
      ]
    }
  });
  // connect.server({
  //   port: 8000,
  //   livereload: true,
  //   root: [".", TMP_DIR, "app"]
  // });
});

gulp.task('serve:dist', function() {
  $.browserSync({
    server: {
      baseDir: [BUILD_DIR],
      middleware: [
        modRewrite([
          '!\\.html|\\.js|\\.css|\\.png|\\.jpg|\\.gif|\\.svg|\\.txt$ /index.html [L]'
        ])
      ]
    }
  });
});

// e2e tests
gulp.task('webdriver-update', $.protractor.webdriver_update);
gulp.task('protractor', ['webdriver-update'], function () {
  gulp.src(['test/e2e/!**!/!*.js'])
    .pipe($.protractor.protractor({
      configFile: "test/protractor.config.js",
      args: ['--baseUrl', 'http://localhost:3000']
    }))
    .on('error', function (e) {
      throw e
    });
});

// Clean
gulp.task('clean', function () {
  $.del.sync([TMP_DIR + '*', BUILD_DIR + '*']);
});

// Development
gulp.task('dev', ['webpack', 'webpack:vendor', 'sass', 'html:dev']);

// Default Task (Dev environment)
gulp.task('default', ['serve:dev'], function() {
  // Scripts
  gulp.watch(['config.json', 'app/scripts/!**!/!*.js'], ['webpack']);

  // Views
  $.watch('app/views/!**!/!*.jade')
    .pipe($.jadeFindAffected())
    .pipe($.jade({jade: jade, pretty: true}))
    .pipe(gulp.dest(TMP_DIR + 'views'));

  // Htmls
  gulp.watch(TMP_DIR + 'views/!**!/!*.html', ['html:dev']);

  // Styles
  gulp.watch('app/styles/!**!/!*.*', ['sass']);
});

gulp.task('deps', ['html:dist'], function () {
  var assets = $.useref.assets();

  return gulp.src([BUILD_DIR + 'index.html'])
    // Concatenates asset files from the build blocks inside the HTML
    .pipe(assets)
    // Appends hash to extracted files app.css → app-098f6bcd.css
    // .pipe($.rev())
    // Adds AngularJS dependency injection annotations
    .pipe($.if('*.js', $.ngAnnotate()))
    // Uglifies js files
    .pipe($.if('*.js', $.uglify()))
    // Minifies css files
    .pipe($.if('*.css', $.csso()))
    // Brings back the previously filtered HTML files
    .pipe(assets.restore())
    // Parses build blocks in html to replace references to non-optimized scripts or stylesheets
    .pipe($.useref())
    // Rewrites occurences of filenames which have been renamed by rev
    .pipe($.revReplace())
    // Minifies html
    .pipe($.if('*.html', $.htmlmin({
      collapseWhitespace: true,
      removeComments: true
    })))
    // Creates the actual files
    .pipe(gulp.dest(BUILD_DIR))
    // Print the file sizes
    .pipe($.size({ title: BUILD_DIR, showFiles: true }));
});

// Distribution
gulp.task('prepare', ['dev', 'img', 'fonts', 'htaccess']);
gulp.task('dist', ['prepare', 'deps']);
*/
