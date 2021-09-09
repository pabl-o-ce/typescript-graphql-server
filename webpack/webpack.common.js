const path = require('path');
const getTransformer = require('ts-transform-graphql-tag').getTransformer
const ProgressWebpackPlugin = require('progress-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const root = path.resolve(__dirname, '../', 'dist');

module.exports = {
    context: path.resolve(__dirname, '../','src'),
    entry: () => new Promise((resolve) => resolve([
		'./index.ts',
	])),
    externals: [nodeExternals()],
    output: {
        filename: '[name].js',
        path: root,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							getCustomTransformers: () => ({ before: [getTransformer()] })
						}
					}
				]
            },
            {
				test: /\.(graphql|gql)$/,
				exclude: /node_modules/,
				loader: 'graphql-tag/loader'
			},
            {
				test: /\.html$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'html-loader',
						options: {
								minimize: true,
								removeComments: true,
								collapseWhitespace: true,
								minifyCSS: true,
							}
					}
				]
			},
			{
				test: /\.txt$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'raw-loader'
					}
				]
			},
        ],
    },
	node: {
		global: false,
		__filename: false,
		__dirname: false,
	},
    plugins: [
        new CleanWebpackPlugin({
			verbose: true,
		}),
        new ProgressWebpackPlugin(true)
    ],
    resolve: {
        extensions: ['.ts', '.graphql', '.tsx', '.js', '.json', '.html', 'txt'],
    },
    target: 'node',
};