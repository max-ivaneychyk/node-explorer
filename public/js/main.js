window.addEventListener('load', function () {
    let explorer = document.createElement('div');
    document.body.appendChild(explorer);

    function ajax(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'path/'  , true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.send(encodeURI(url)); // (1)

        xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                callback(JSON.parse(xhr.status + ': ' + xhr.statusText));
            } else {
                callback(JSON.parse(xhr.responseText));
            }
        }
    }

    function openFile(path, format) {
        format = format.toLowerCase();

        if(['png', 'jpg', 'jpeg', 'gif'].indexOf(format) !== -1) {
            let image = new Image ();
            image.src = path;

            document.body.appendChild(image);
        }

    }

    function fileTemplate(file, path, format) {
        return `<div class="file">
                  <div class= "${format} icon"></div> 
                  <h3 class="title"> ${file} </h3>
                  <div class = "event-layer" data-path="${path}"></div>
               </div>`;
    }

    function getFileFormat(fileName) {
        let partsName = fileName.split('.');
        return partsName.length > 1 ? partsName[partsName.length - 1] : false;
    }

    let detect = {
        isFile: function (fileName) {
            return fileName.indexOf('.') !== -1;
        },
        isDrive: function (fileName) {
            return fileName.indexOf(':') !== -1;
        }
    };

    function updateExplorer() {
        let hash = location.hash.slice(1);
        ajax('url=' +  hash + '', function (list) {

            let template = '';
            list.forEach(function (file) {
                if (detect.isDrive(file)) {
                    let path = file + '//'
                    template += fileTemplate(file, path, 'drive');

                 } else if (detect.isFile(file)) {
                    let format = getFileFormat(file);
                    let path = file ;
                    template += fileTemplate(file, path, format);

                } else {
                    let path = file + '/'
                    template += fileTemplate(file, path, 'folder');
                }
            });

            explorer.innerHTML = template;
        });
    }




    window.addEventListener('hashchange', updateExplorer);

    if (location.hash) {
       updateExplorer();
    }
    location.hash =  location.hash || 'drivers';

    explorer.addEventListener('dblclick', function (e) {
      let elem = e.target;

      if (!elem.classList.contains('event-layer')) {
         return false;
      }

      let path = elem.getAttribute('data-path');
      let format = getFileFormat(path);

       if (format) {
        //   openFile(location.hash.slice(1) + path, format);
           return;
       }

      if (location.hash === "#drivers") {
          location.hash = path;
        } else {
          location.hash += path;
      }
    }, false);
 });
