const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './src/public/main/main.ts',
    },
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    output: {
      path: `${__dirname}/dist`,
      filename: '[name]/[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/main/main.html',
            filename: `${__dirname}/dist/main/main.html`,
            chunks: ['main'],
        })
    ]
}
