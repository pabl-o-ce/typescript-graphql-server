const webpackConfig = require('./webpack/webpack.common');
const { merge } = require('webpack-merge');
const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = (process.env.NODE_ENV === 'development') ? 'dev' : (process.env.NODE_ENV === 'production') ? 'prod' : process.env.NODE_ENV;

const addons = (addonsArgs) => {
    let addons = [].concat.apply([], [addonsArgs]).filter(Boolean);
    return addons.map((addonsName) => require(`./webpack/addons/webpack.${addonsName}.js`))
}

module.exports = (env) => {
    const envConfig = require(`./webpack/webpack.${nodeEnv}`);
    return merge(webpackConfig, envConfig); //, ...addons(env.addons)
};
