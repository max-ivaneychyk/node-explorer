let bodyParser = require("body-parser");
let log = require("./log/index")(module);
let diskinfo = require("diskinfo");
let fsExtra = require("fs-extra");
let path = require("path");
let fs = require("fs");
// подключение express
let express = require("express");
// создаем объект приложения
let app = express();
// создаем парсер для данных application/x-www-form-urlencoded
let urlencodedParser = bodyParser.urlencoded({extended: false});

const PORT = 3000;

///////////////     DISKS   INFO
let disks = [];
diskinfo.getDrives(function (err, aDrives) {
    disks = aDrives.map((disk) => {
        disk.format = 'drive';
        return disk;
    });
});

// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
    fs.readFile("public/index.html", "utf8", function (error, page) {
        response.send(page);
    });
});

let getDriversInfo = function () {
    return new Promise((resolve) => {
        resolve(disks);
    })
};

let readDir = function (dir) {
    let currentDirPath = dir.replace(/\$plus/gim, "+");
    let list = [];

    return new Promise((resolve, reject) => {
        fs.readdir(dir, function (err, files) {
            if (err) {
                reject(err);
                return;
            }

            files.forEach(function (name) {
                // .SYS  не обрабативаем, нет прав
                let filePath = path.join(currentDirPath, name);
                let stat;

                try {
                    stat = fs.statSync(filePath);
                } catch (errFile) {
                    //console.log('Cant read system file ', errFile);
                    return;
                }

                if (stat.isFile()) {
                    list.push({name: name, stat: stat, format: "file"});
                } else if (stat.isDirectory()) {
                    list.push({name: name, stat: stat, format: "directory"});
                }
            });

            // send data to client
            resolve(list);
        });
    })
};

let getFilesInfo = function (dir) {
    return fsExtra.pathExists(dir)
        .then(exists => {
            return readDir(dir);
        });
};

app.get("/files", function (req, res) {
    let pathExplorer = req.query.path.trim();
    pathExplorer = pathExplorer || 'drivers';

    if (pathExplorer === 'drivers') {

        getDriversInfo()
            .then((list) => {
                res.json(list);
            })
            .catch((err) => {

                let message = "Not found path ";
                res.statusCode = 404;
                res.send(message);

                log.error(message + pathExplorer, err);
            });

    } else {

        getFilesInfo(pathExplorer)
            .then((list) => {
                res.json(list);
            })
            .catch(() => {

                let message = "Not found path ";
                res.statusCode = 404;
                res.send(message);

                log.error(message + pathExplorer, err);
            });

    }
});

app.post("/file", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let dir = req.body.dir;

    fsExtra
        .ensureDir(dir)
        .then(() => {
            log.info("CREATE-NEW-FOLDER ", dir);
            res.json({dir})
        })
        .catch(err => {
            log.error("ERROR-CREATE-NEW-FOLDER ", dir);
            res.json({err})
        });
});

app.delete('/file', function (req, res) {
    let filename = req.query.dir;

    fsExtra.remove(filename)
        .then(() => {
            res.json({dir})
        })
        .catch((err) => {
            res.json({err})
        });
});

app.put('/file', urlencodedParser, function (req, res) {
   let path = req.body.path;
   let newPath = req.body.newPath;

    fsExtra.rename(path, newPath)
        .then(() => {
            res.json({path, newPath})
        })
        .catch((err) => {
            res.json({err})
        });
});

app.use(express.static(__dirname + "/public"));
// начинаем прослушивать подключения на 3000 порту
app.listen(PORT);
