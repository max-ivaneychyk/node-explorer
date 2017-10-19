let NODE_ENV = 'development';
let PrettierPlugin = require("prettier-webpack-plugin");


module.exports = {
    entry: "./app/app.jsx", // входная точка - исходный файл
    output:{
        path: "public",     // путь к каталогу выходных файлов - папка public
        filename: "bundle.js"       // название создаваемого файла
    },
    resolve:{
        extensions: ["", ".js", ".jsx"] // расширения для загрузки модулей
    },
    // source map
    devtool: NODE_ENV === 'development' ? 'source-map' : false,
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
        poll: 1000
    },
    module:{
        loaders:[   //загрузчики
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/,
                loader: ["babel-loader"],
                query:{
                    presets:["es2015", 'stage-0', "react"]
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader?url=false&sourceMap=true" },
        ]
    },
    plugins: [
        new PrettierPlugin(
            {
                printWidth: 80,               // Specify the length of line that the printer will wrap on.
                tabWidth: 2,                  // Specify the number of spaces per indentation-level.
                useTabs: false,               // Indent lines with tabs instead of spaces.
                semi: true,                   // Print semicolons at the ends of statements.
                encoding: 'utf-8',            // Which encoding scheme to use on files
                extensions: [ ".js", ".jsx" ]  // Which file extensions to process
            }
        )
    ]
};
