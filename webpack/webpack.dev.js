const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const config = {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new WebpackNotifierPlugin({
			title: 'Graphql API',
			contentImage:  'https://www.carreraestrada.com/img/mini-logo-cye.png',
		}),
        new NodemonPlugin({
            watch: path.resolve(__dirname, '../', 'dist'),
            ignore: ['*.js.map'],
            verbose: true,
            script: path.resolve(__dirname, '../', 'dist/main.js'),
            ext: 'js,json'
        })
    ]
}
module.exports = config;