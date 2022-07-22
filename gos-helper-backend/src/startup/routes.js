const announceRouter = require("../apps/announce/announce.routes");
const protocolRouter = require("../apps/protocol/protocol.routes");

module.exports = (app) => {
	app.use("/announce", announceRouter);
	app.use("/protocol", protocolRouter);
	app.get("/*", (req, res) => {
		res.sendFile(path.join(__dirname, "..", "public", "index.html"));
	});
};
