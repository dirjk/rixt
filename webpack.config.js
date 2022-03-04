const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
    entry: {
        index: './demo/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.join( __dirname, '/dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [ '@babel/preset-env'],
                    plugins: [ '@babel/plugin-transform-react-jsx']
                }
            },
            {
                test: /\.css$/i,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }

        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve( __dirname, 'index.html'),
            filename: 'index.html'
        })
    ]
}