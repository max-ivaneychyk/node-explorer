function ajax(url, data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    let str = '';
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            str += ( key + '=' + data[key] + '&');
        }
    }

    str = str.replace(/\+/gim, '$plus');
    xhr.send(encodeURI(str)); // (1)

    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            callback(JSON.parse(xhr.status + ': ' + xhr.statusText));
        } else {
            callback(JSON.parse(xhr.responseText));
        }
    }
}

