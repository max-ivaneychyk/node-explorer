let bodyParser = require("body-parser");
let log = require("./log/index")(module);
let diskinfo = require("diskinfo");
let fsExtra = require("fs-extra");
let path = require("path");
let fs = require("fs");

const PORT = 3000;

// подключение express
let express = require("express");

let Emitter = require("events");
let ee = new Emitter();

// создаем объект приложения
let app = express();
//app.use(express.methodOverride()); // поддержка put и delete
// создаем парсер для данных application/x-www-form-urlencoded
let urlencodedParser = bodyParser.urlencoded({extended: false});

///////////////     DISKS   INFO
let disks = [];
diskinfo.getDrives(function (err, aDrives) {
    disks = aDrives.map((disk) => {
        disk.format = 'drive';
        return disk;
    });
});

/*log.info('GET-FILES-DISKS ');
log.debug('GET-FILES-DISKS ');
log.error('GET-FILES-DISKS ');
log.info('GET-FILES-DISKS ');*/

ee.on("get-disks", function (data) {
    // GET DISK
    console.log("GET-FILES-DISKS ");
    data.callback(disks);
});

ee.on("get-files-from-dir", function (data) {
    // кодирование плюсов
    let currentDirPath = data.path.replace(/\$plus/gim, "+");
    let list = [];

    fs.readdir(currentDirPath, function (err, files) {
        if (err) {
            console.log(err);
            data.callback({error: err});
            return;
        }

        files.forEach(function (name) {
            // .SYS  не обрабативаем, нет прав
            var filePath = path.join(currentDirPath, name);
            var stat;
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
        console.log("GET-FILES-FROM ", currentDirPath);
        // send data to client
        data.callback(list);
    });
});

// СОЗДАТЬ ДИРЕКТОРИЮ
ee.on("create-folder", function (data) {
    let dir = data.path;

    fsExtra
        .ensureDir(dir)
        .then(() => {
            console.log("CREATE-NEW-FOLDER ", dir);
            data.callback("success");
        })
        .catch(err => {
            data.callback("error", err);
        });
});
//ee.emit('create-folder', {dir: 'C:\\\\test.txt'});

// ПРОВЕРИТЬ ПУТЬ НА СУЩЕСТВОВАНИЕ
ee.on("path-exists", function (data) {
    // Promise usage:
    fsExtra
        .pathExists(data.dir)
        .then(exists => {
            data.callback(exists);
        }) // => false
        .catch(err => {
            data.callback("error", err);
        });
});

ee.on("rename-file", function (data) {
    fs.rename(data.path, data.newPath, err => {
        if (err) {
            return console.log(err);
        }
        console.log("RENAME-FILE ", data.path, " TO ", data.newPath);
        data.callback(true);
    });
});

ee.on("delete", function (data) {
    let files = JSON.parse(data.files || "[]");
    files.forEach(function (filename) {
        console.log("DELETE-FILE ", filename);
        fsExtra.removeSync(filename);
    });
    data.callback();
});

app.post("/ls/", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let url = req.body.url;
    if (!url) {
        url = "drivers";
    }
    let eventName = url === "drivers" ? "get-disks" : "get-files-from-dir";

    ee.emit(eventName, {
        path: url,
        callback: function (list) {
            if (url === "drivers") {
                list.forEach(data => (data.format = "drive"));
            }

            list = JSON.stringify(list);
            res.setHeader("Content-Type", "application/json");
            res.end(list);
        }
    });
});

app.post("/command/", urlencodedParser, function (req, res) {
    const events = ["create-folder", "rename-file", "delete"];

    if (!req.body) return res.sendStatus(400);

    let eventName = req.body.event;
    if (events.indexOf(eventName) === -1) {
        let data = JSON.stringify({status: "error", desc: "Bad code in command"});
        res.setHeader("Content-Type", "application/json");
        res.end(data);
        return;
    }

    ee.emit(eventName, {
        path: req.body.path,
        newPath: req.body.newPath,
        files: req.body.files,
        callback: function (status) {
            let data = JSON.stringify({status: status});
            res.setHeader("Content-Type", "application/json");
            res.end(data);
        }
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
            }).catch((err) => {

            let message = "Not found path ";
            res.statusCode = 404;
            res.send(message);

            log.error(message + pathExplorer, err);
        });

    } else {

        getFilesInfo(pathExplorer).then((list) => {
            res.json(list);
        }).catch(() => {

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
        }).
    catch((err) => {
        res.json({err})
    });
});

app.use(express.static(__dirname + "/public"));
// начинаем прослушивать подключения на 3000 порту
app.listen(PORT);
