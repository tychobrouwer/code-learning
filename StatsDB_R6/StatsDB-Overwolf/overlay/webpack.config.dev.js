const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        background: './src/public/background/background.ts',
        desktop: './src/public/desktop/desktop.ts',
        in_game: './src/public/in_game/in_game.ts',
        in_lobby: './src/public/in_lobby/in_lobby.ts',
        settings: './src/public/settings/settings.ts',
        statistics: './src/public/statistics/statistics.ts'
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
            template: './src/public/background/background.html',
            filename: `${__dirname}/dist/background/background.html`,
            chunks: ['background'],
        }),
        new HtmlWebpackPlugin({
            template: './src/public/desktop/desktop.html',
            filename: `${__dirname}/dist/desktop/desktop.html`,
            chunks: ['desktop'],
        }),
        new HtmlWebpackPlugin({
            template: './src/public/in_game/in_game.html',
            filename: `${__dirname}/dist/in_game/in_game.html`,
            chunks: ['in_game'],
        }),
        new HtmlWebpackPlugin({
            template: './src/public/in_lobby/in_lobby.html',
            filename: `${__dirname}/dist/in_lobby/in_lobby.html`,
            chunks: ['in_lobby'],
        }),
        new HtmlWebpackPlugin({
            template: './src/public/settings/settings.html',
            filename: `${__dirname}/dist/settings/settings.html`,
            chunks: ['settings'],
        }),
        new HtmlWebpackPlugin({
            template: './src/public/statistics/statistics.html',
            filename: `${__dirname}/dist/statistics/statistics.html`,
            chunks: ['statistics'],
        })
    ]
}
