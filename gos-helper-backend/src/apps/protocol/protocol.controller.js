const {
	fetchIdsByAnnoNumbers,
} = require("../announce/services/annoId.service");
const {
	fetchTrdApps,
	fetchTrdBuys,
	formatOffers,
} = require("./services/protocol.services");

const protocolController = async (req, res) => {
	try {
		const { annoNums } = req.body;
		const annoIds = await fetchIdsByAnnoNumbers(annoNums);
		const trdBuys = await fetchTrdBuys(annoIds);
		const trdApps = await fetchTrdApps(annoIds);
		
		const { offersInfo, offerLots, suppliers } = formatOffers(trdApps);

		res.json({
			announcements: trdBuys,
			offersInfo,
			offerLots,
			suppliers,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({ error: err.message });
	}
};

module.exports = {
	protocolController,
};
