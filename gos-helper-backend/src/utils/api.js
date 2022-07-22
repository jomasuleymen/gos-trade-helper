const axios = require("axios");

const endpoint = "https://ows.goszakup.gov.kz/v3/graphql";

const accessToken = process.env.token; // check on startup

module.exports = (query) => {
	return axios(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		data: JSON.stringify({ query }),
	});
};
