window.addEventListener('load', function () {
    let explorer = document.createElement('div');
    document.body.appendChild(explorer);



    function fileTemplate(file, path, format) {
        console.log(format);
        return `<div class="file">
                  <div class= "${format} icon"></div> 
                  <h3 class="title"> ${file} </h3>
                  <div class = "event-layer" data-path="${path}"></div>
               </div>`;
    }

    function getFileFormat(fileName) {
        let partsName = fileName.split('.');
        let format = fileName[fileName.length -1] === '/' ? 'folder' : partsName[partsName.length - 1];
        return format;
    }

    let detect = {
        isDrive: function (fileData) {
            return fileData.mounted;
        }
    };

    function updateExplorer() {
        let hash = location.hash.slice(1);
        ajax('url=' +  hash + '', function (list) {

            let template = '';
            list.forEach(function (file) {
                if (detect.isDrive(file)) {
                    let path = file.mounted + '//';
                    template += fileTemplate(file.mounted, path, 'drive');

                 } else if (file.format === 'file') {
                    let format = getFileFormat(file.name);
                    template += fileTemplate(file.name, file.name, format);

                } else {
                    let path = file.name + '/';
                    template += fileTemplate(file.name, path, 'folder');
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

       if (format !== 'folder') {
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
