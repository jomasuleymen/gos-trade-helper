const request = require("../utils/api");

/* for decrease requests num to server */
function mergePlainQueries(queryFn, payload) {
	const queries = []; // seperate to other file
	const keyRegex = /^[a-zA-Z]/;

	for (let [key, value] of Object.entries(payload)) {
		const alias = keyRegex.test(key) ? key : `a${key}`;
		queries.push(`${alias}: ${queryFn(value)}`);
	}

	const query = `{${queries.join(",")}}`;
	return query;
}

async function requestMergedQueries(query) {
	let result = {};

	await request(query)
		.then(({ data }) => {
			if (!data || data.errors || !data.data) {
				console.log("errors", "requestMergedQueries", data);
				console.log(data);
			} else result = data.data;
		})
		.catch((err) => {
			console.log(err);
			throw new Error("Some error on the server");
		});

	return result;
}

module.exports = { mergePlainQueries, requestMergedQueries };
