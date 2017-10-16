let bodyParser = require("body-parser");
let diskinfo = require('diskinfo');
let fsExtra = require('fs-extra');
let path = require('path');
let fs = require('fs');

const PORT = 3000;

// подключение express
let express = require("express");

let Emitter = require("events");
let ee = new Emitter();

// создаем объект приложения
let app = express();
// создаем парсер для данных application/x-www-form-urlencoded
let urlencodedParser = bodyParser.urlencoded({extended: false});

///////////////     DISKS   INFO    ///////////////////////////
let disks = [];
diskinfo.getDrives(function (err, aDrives) {
    disks = aDrives;
});


ee.on('get-disks', function (data) {
    // GET DISK
    data.callback(disks);
});


ee.on('get-files-from-dir', function (data) {
    // кодирование плюсов
    let currentDirPath = data.path.replace(/\$plus/gim, '+');
    let list = [];

    console.log(currentDirPath);
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
                console.log('Cant read system file ', errFile);
                return;
            }

            if (stat.isFile()) {
                list.push({name: name, stat: stat, format: 'file'});
            } else if (stat.isDirectory()) {
                list.push({name: name, stat: stat, format: 'directory'});
            }
        });
        // send data to client
        data.callback(list);
    });
});


// СОЗДАТЬ ДИРЕКТОРИЮ
ee.on('create-folder', function (data) {
    let dir = data.dir;

    fsExtra.ensureDir(dir)
        .then(() => {
            data.callback('success');
        })
        .catch(err => {
            data.callback('error', err);
        });
});
//ee.emit('create-folder', {dir: 'C:\\\\test.txt'});

// ПРОВЕРИТЬ ПУТЬ НА СУЩЕСТВОВАНИЕ
ee.on('path-exists', function (data) {
    // Promise usage:
    fsExtra.pathExists(data.dir)
        .then(exists => {
            data.callback(exists);
        }) // => false
        .catch(err => {
            data.callback('error', err);
        });
});
/*ee.emit('path-exists', {dir: 'C:\\\\test.tx', callback: function (status) {
    console.log(status);
}});*/


ee.on('ensure-dir', function (data) {
    let dir = data.dir;
// With Promises:
    fsExtra.ensureDir(dir)
        .then(() => {
            data.callback(true)
        })
        .catch(err => {
            data.callback(false, err)
        })
});


ee.on('rename-file', function (data) {

});

// todo cool
ee.on('delete', function (data) {
    let files = JSON.parse(data.files || '[]');
    files.forEach(function (filename) {
        fs.unlink(filename);
    });
    data.callback();
});




app.post('/ls/', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let url = req.body.url;
    if (!url) {
        url = 'drivers';
    }
    let eventName = url === 'drivers' ? 'get-disks' : 'get-files-from-dir';

    ee.emit(eventName, {
        path: url, callback: function (list) {
            list = JSON.stringify(list);
            res.setHeader('Content-Type', 'application/json');
            res.end(list);
        }
    });

});

app.post('/command/', urlencodedParser, function (req, res) {
    const events = [
        'create-folder',
        'delete'
    ];

    if (!req.body) return res.sendStatus(400);

    let eventName = req.body.event;
    if (events.indexOf(eventName) === -1) {
        let data = JSON.stringify({status: 'error', desc: 'Bad code in command'});
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
        return;
    }

    console.log(req.body);

    ee.emit(eventName, {
        dir: req.body.dir,
        files: req.body.files,
        callback: function (status) {
            let data = JSON.stringify({status: status});
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        }
    });

});


// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
    fs.readFile("public/index.html", "utf8", function (error, page) {
        response.send(page);
    })
});

app.use(express.static(__dirname + "/public"));
// начинаем прослушивать подключения на 3000 порту
app.listen(PORT);


