const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const config = {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new WebpackNotifierPlugin({
			title: 'Graphql API',
			contentImage: path.join(__dirname, '../logo.png')
		}),
		new NodemonPlugin({
			watch: path.resolve(__dirname, '../', 'dist'),
			ignore: ['*.js.map'],
			verbose: true,
			script: `${path.resolve(__dirname, '../', 'dist')}/main.js`
		})
	]
}

module.exports = config;
