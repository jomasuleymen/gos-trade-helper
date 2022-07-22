const request = require("../../../utils/api");
const { trdAppQuery, trdBuyQuery } = require("./queries");
const _ = require("lodash");

async function fetchTrdApps(annoIds) {
	if (!annoIds || annoIds.length === 0) return [];

	const trdApps = [];

	for (let annoId of annoIds) {
		const query = trdAppQuery(annoId);
		await request(query)
			.then((res) => {
				const data = res.data.data?.TrdApp;
				if (data) {
					trdApps.push(...data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return trdApps;
}

async function fetchTrdBuys(annoIds) {
	if (!annoIds || annoIds.length === 0) return [];

	const trdBuys = [];

	const query = trdBuyQuery(annoIds);
	await request(query)
		.then((res) => {
			const data = res.data.data?.TrdBuy;
			if (data) trdBuys.push(...data);
		})
		.catch((err) => {
			console.log(err);
		});

	return trdBuys;
}

function formatOffers(trdApps) {
	let offersInfo = {};
	let offerLots = [];
	let suppliers = {};

	for (let offer of trdApps) {
		offerLots.push(...offer.AppLots);
		suppliers[offer.supplierBinIin] = {
			fullNameRu: offer.Supplier.fullNameRu,
		};
		delete offer.AppLots;
		delete offer.Supplier;
	}

	offerLots = _.groupBy(offerLots, "lotId");
	offersInfo = _.chain(trdApps).keyBy("id").value();

	return { offersInfo, offerLots, suppliers };
}

module.exports = {
	fetchTrdApps,
	fetchTrdBuys,
	formatOffers,
};
