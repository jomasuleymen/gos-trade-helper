module.exports = (schema) => (req, res, next) => {
	try {
		const data = schema.parse({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		req.body = data.body || req.body;
		req.query = data.query || req.query;
		req.params = data.params || req.params;

		next();
	} catch (err) {
		return res.status(400).send(err.errors);
	}
};
