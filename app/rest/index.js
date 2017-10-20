class Rest {
	constructor(type, url, body) {
		return fetch(url, {
			method: type,
			headers: {
				"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
			},
			body: body
		}).then(answer => {
			return answer.json();
		});
	}
	static dataToString(data) {
		let body = "";

		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				let val = data[key].push ? JSON.stringify(data[key]) : data[key];
				body += key + "=" + val + "&";
			}
		}

		return body.slice(0, -1);
	}
	static get(url, data) {
		return new Rest("GET", url + "?" + Rest.dataToString(data));
	}
	static post(url, data) {
		return new Rest("POST", url, Rest.dataToString(data));
	}
	static put(url, data) {
		return new Rest("PUT", url, Rest.dataToString(data));
	}
	static del(url, data) {
		return new Rest("DELETE", url + "?" + Rest.dataToString(data));
	}
}

export default Rest;
