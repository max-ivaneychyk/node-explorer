let ajax = function (url, data) {
    let body = '';

    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            let val = data[key].push ? JSON.stringify(data[key]) : data[key];
            body += ( key + '=' + val + '&');
        }
    }

    return fetch(url, {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: body
    }).then(answer => {
        return answer.json();
    });
};

export default ajax;