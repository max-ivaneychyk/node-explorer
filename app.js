let bodyParser = require("body-parser");
let diskinfo = require('diskinfo');
let fsExtra = require('fs-extra');
let fs = require('fs');

// подключение express
let express = require("express");

let cmd = require('./modules/cmd');
require('./modules/ee');

// создаем объект приложения
let app = express();
// создаем парсер для данных application/x-www-form-urlencoded
let urlencodedParser = bodyParser.urlencoded({extended: false});

ee.on('get-files-from-dir', function (data) {
    let list = [];
    let path = data.path;
    console.log(path);
    fs.readdirSync(path).forEach(file => {
        list.push(file);
    });

    data.callback(list);
});

ee.on('get-disks', function (data) {
// GET DISK
    diskinfo.getDrives(function(err, aDrives) {
        let disks = [];
        for (var i = 0; i < aDrives.length; i++) {
            // console.log('Drive ' + aDrives[i].filesystem);
            // console.log('blocks ' + aDrives[i].blocks);
            // console.log('used ' + aDrives[i].used);
            // console.log('available ' + aDrives[i].available);
            // console.log('capacity ' + aDrives[i].capacity);
            // console.log('mounted ' + aDrives[i].mounted);
            disks.push(aDrives[i].mounted);
            // console.log('-----------------------------------------');
        }

        data.callback(disks);
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
    const COMMAND = 'rename c:\\new_folder renamed_folder';
    cmd(COMMAND, function (err, stdout) {
        if (err) throw err;
        // console.log(stdout);
        data.callback();
    });
});

// todo cool
ee.on('delete-file', function (data) {
    ;['D://node/node-explorer/del.txt'].forEach(function(filename) {
        fs.unlink(filename);
    });
    data.callback();
});

ee.on('delete-folder', function (data) {
    const COMMAND = 'rd d:\\test /S /Q';
    cmd(COMMAND, function (err, stdout) {
        if (err) throw err;
        // console.log(stdout);
        data.callback();
    });
});




app.post('/path/', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    let url = req.body.url;

    if(url === 'drivers') {
       ee.emit('get-disks', {
         callback: function (list) {
             let disks = JSON.stringify(list);

            res.setHeader('Content-Type', 'application/json');
            res.send(disks);
         }
       });
    } else {
        ee.emit('get-files-from-dir', {path: url, callback: function (list) {
           list = JSON.stringify(list);
            res.setHeader('Content-Type', 'application/json');
            res.end( list );
        }});
    }
});


// определяем обработчик для маршрута "/"
app.get("/", function (request, response) {
    fs.readFile("public/index.html", "utf8", function (error, page) {
        response.send(page);
    })
});

app.use(express.static(__dirname + "/public"));
// начинаем прослушивать подключения на 3000 порту
//app.listen(3000);


