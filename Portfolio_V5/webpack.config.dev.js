const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/public/main.ts',
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
        filename: 'public/[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/main.html',
            filename: `${__dirname}/dist/public/main.html`,
            chunks: ['main'],
        }),
    ],
};
