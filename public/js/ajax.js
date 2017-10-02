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

