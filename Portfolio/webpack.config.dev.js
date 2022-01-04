const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/public/index.ts',
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            filename: `${__dirname}/dist/index.html`,
            chunks: ['index'],
        }),
    ],
};
