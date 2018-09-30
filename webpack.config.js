const webpackConfig = require('./webpack/webpack.common');
const webpackMerge = require('webpack-merge');

const dotenv = require('dotenv');

dotenv.config();

const addons = (addonsArgs) => {
	let addons = [].concat.apply([], [addonsArgs]).filter(Boolean);
	return addons.map((addonsName) => require(`./webpack/addons/webpack.${addonsName}.js`))
}

module.exports = (env) => {
	const envConfig = require(`./webpack/webpack.${process.env.NODE_ENV}`);
	return webpackMerge(webpackConfig, envConfig); //, ...addons(env.addons)
};
