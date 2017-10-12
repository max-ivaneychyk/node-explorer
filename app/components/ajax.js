let ajax = function (url, data, callback) {
    let xhr = new XMLHttpRequest();
    let str = '';

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let val = data[key].push ? JSON.stringify(data[key]) : data[key];
            str += ( key + '=' + val + '&');
        }
    }
    // кодируем символы + в дате
    str = str.replace(/\+/gim, '$plus');

    xhr.send(encodeURI(str)); // (1)

    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState !== 4) return;

        if (xhr.status !== 200) {
            callback(JSON.parse(xhr.status + ': ' + xhr.statusText));
        } else {
            callback(JSON.parse(xhr.responseText));
        }
    }


};

module.exports = ajax;