function ajax(url, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'ls/'  , true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    url = url.replace(/\+/gim, '$plus');
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

