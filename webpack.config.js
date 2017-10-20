let NODE_ENV = 'development';
let webpack = require('webpack');
let PrettierPlugin = require("prettier-webpack-plugin");
let path = require("path");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let WebpackDeleteAfterEmit = require('webpack-delete-after-emit');


module.exports = {
    entry: { // входная точка - исходный файл
       bundle: "./app/app.jsx",
       style: './app/less/index.less'
    },
    output:{
        path: path.join(__dirname, 'public'),     // путь к каталогу выходных файлов - папка public
        publicPath: '/public/',
        filename: "[name].js"       // название создаваемого файла
    },
    resolve:{
        extensions: [".js", ".jsx", ".less", ".css"] // расширения для загрузки модулей
    },
    // source map
    devtool: NODE_ENV === 'development' ? 'source-map' : false,
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        poll: 1000
    },
    module:{
        loaders: [
            {
                test: /\.jsx$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },{
                test: /\.js$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1']
                }
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader", options: {
                            sourceMap: true,
                            url: false
                        }
                    }, {
                        loader: "autoprefixer-loader", options: {
                            browsers: 'last 40 version'
                        }
                    }, {
                        loader: "less-loader", options: {
                            sourceMap: true
                        }
                    }]
                })
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // output css folder and name file
        // остановить сборку при ошибках
        new webpack.NoErrorsPlugin(),
        // глобальная переменные для разработки: c NODE_ENV js файлах
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new ExtractTextPlugin({
          filename: "style.css"
        })
/*        new PrettierPlugin(
            {
                printWidth: 80,               // Specify the length of line that the printer will wrap on.
                tabWidth: 2,                  // Specify the number of spaces per indentation-level.
                useTabs: true,               // Indent lines with tabs instead of spaces.
                semi: true,                   // Print semicolons at the ends of statements.
                encoding: 'utf-8',            // Which encoding scheme to use on files
                extensions: [ ".js", ".jsx" ]  // Which file extensions to process
            }
        )*/
    ],
    devServer: {
        port: 9000,
        contentBase: path.join(__dirname, "public"),
        proxy: {
            "**": "http://localhost:3000"
        },
        historyApiFallback: true,
        noInfo: true
    }
};
