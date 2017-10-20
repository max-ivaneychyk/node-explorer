let NODE_ENV = 'development';

let PrettierPlugin = require("prettier-webpack-plugin");
let path = require("path");
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let WebpackDeleteAfterEmit = require('webpack-delete-after-emit');


module.exports = {
    entry: ["./app/app.jsx", './app/less/index.less'], // входная точка - исходный файл
    output:{
        path: path.resolve(__dirname, './public'),     // путь к каталогу выходных файлов - папка public
        publicPath: '/public/',
        filename: "[name]"       // название создаваемого файла
    },
    resolve:{
        extensions: [".jsx", ".js", ".less", ".css"] // расширения для загрузки модулей
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
                test: /\.jsx?$/,
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
        // output css folder and name file
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
    ]
};
