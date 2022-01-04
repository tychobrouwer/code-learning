const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        home: './src/public/home/home.ts',
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
        filename: 'public/[name]/[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/home/home.html',
            filename: `${__dirname}/dist/public/home/home.html`,
            chunks: ['home'],
        }),
    ],
};
