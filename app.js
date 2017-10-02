let bodyParser = require("body-parser");
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
    const DISK_INFO = 'wmic logicaldisk get name';
    cmd(DISK_INFO, function (err, stdout) {
        if (err) throw err;
        // console.log(stdout);
        let disks = String(stdout).replace(/\s+/g, ' ').trim().split(' ').splice(1);
        data.callback(disks);
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
app.listen(3000);

