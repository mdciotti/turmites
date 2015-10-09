module.exports = {
	entry: {
		main: './src/main.js',
		frame: './src/frame.js'
	},
	output: {
		path: './js',
		filename: '[name].js'
	},
	devtool: 'source-map',
	extensions: ['js'],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	},
	plugins: [],
	resolve: {
		modulesDirectories: ['node_modules', 'bower_components']
	}
}
