const { makeTrdBuyQuery, LIMIT } = require("./queries");
const { mergeArrays } = require("../../../utils/array");
const { fetchAnnoIds } = require("./annoId.service");
const { sleep } = require("../../../utils/time");
const request = require("../../../utils/api");

async function fetchAnnouncements(data) {
	const announceIds = await fetchAnnoIds(data);
	const annoucements = await fetchAnnoByIds(announceIds, data);
	return annoucements;
}

async function fetchAnnoByIds(announceIds, options) {
	/* Working with announcements id */
	const { trdMethods, signs, statusIds } = options;
	const announcements = [];
	let safeReq = 12;

	const getAnnoQuery = makeTrdBuyQuery({
		trdMethods,
		signs,
		statusIds: statusIds || [210, 220, 230, 240],
	});

	while (announceIds.length > 0 && safeReq-- > 0) {
		const searchAnnoIds = announceIds.splice(0, LIMIT);
		query = getAnnoQuery(searchAnnoIds);

		await request(query)
			.then(({ data }) => {
				if (!data || data.errors || !data.data["TrdBuy"]) {
					console.log("fetchAnnoByIds");
					console.log(data);
				} else {
					mergeArrays(
						announcements,
						filterTrades(data.data["TrdBuy"], options)
					);
				}
			})
			.catch((err) => {
				console.log(err);
				throw new Error("Some error on the server");
			});

		await sleep(1000);
	}

	return announcements;
}

function filterTrades(announces, options) {
	const { signs } = options;
	return announces.filter(
		(anno) =>
			isSignsAccessable(anno, signs) &&
			isKopfAccessable(anno.Organizer.refKopfCode)
	);
}

const acceptedRefKopfCodes = ["ГУ", "ГП"];
function isKopfAccessable(refKopfCode) {
	return acceptedRefKopfCodes.includes(refKopfCode);
}

function isSignsAccessable(anno, signs) {
	if (Object.keys(signs).length !== 0) {
		for (let [signName, value] of Object.entries(signs)) {
			if (anno[signName] != value) return false;
		}
	}
	return true;
}

function filterAnnosByCode(announcements, filterCodes) {
	announcements.forEach((anno) => {
		anno.Lots = anno.Lots.filter((lot) => {
			const plan = lot.Plans[0];
			if (!plan || !plan.refEnstruCode) return false;

			plan.refEnstruCode = plan.refEnstruCode.split(".")[0];
			return filterCodes.includes(plan.refEnstruCode);
		});
	});

	return announcements.filter((anno) => anno.Lots.length !== 0);
}

module.exports = {
	fetchAnnouncements,
	filterAnnosByCode,
	fetchAnnoByIds,
};
