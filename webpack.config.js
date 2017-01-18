var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer');
var precss = require('precss');


module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		// 'react-hot-loader/patch',
		'webpack-hot-middleware/client',
		'babel-polyfill',
		'./src/entry'
	],
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'bundle.js',
		// publicPath: '/dist/',
		publicPath: '/',
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		// new NpmInstallPlugin(),
		// new webpack.NoErrorsPlugin() //if no React-hot-eloader?
	],
	module: {
		preLoaders: [
			{
				test: /\.js$/,
				loaders: ['eslint'],
				include: [
					path.resolve(__dirname, "src"),
				],
			}
		],
		loaders: [
			{
				loaders: [/*'react-hot-loader/webpack',*/ 'react-hot', 'babel-loader'],
				include: [
					path.resolve(__dirname, "src"),
				],
				test: /\.js$/,
				plugins: ['transform-runtime'],
			},
			{
				test: /\.less$/,
				loader: "style!css!less"
			},
			{
				test:   /\.css$/,
				loader: "style-loader!css-loader!css-loader",
			}
		]
	},
	postcss: function () {
		return [autoprefixer, precss];
	}
}
