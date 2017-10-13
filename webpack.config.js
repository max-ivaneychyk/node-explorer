let NODE_ENV = 'development';

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
                    presets:["es2015", "react"]
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader?url=false&sourceMap=true" },
        ]
    }
};
