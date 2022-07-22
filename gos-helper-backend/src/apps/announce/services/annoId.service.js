const request = require("../../../utils/api");
const {
	queryAnnoIdByNumberAnno,
	queryAnnoIdByLotName,
	LIMIT,
} = require("./queries");
const _ = require("lodash");
const {
	mergePlainQueries,
	requestMergedQueries,
} = require("../../../helpers/graphql");

async function fetchAnnoIds({ lotNames, annoNumbers, trdMethods }) {
	const ids1 = await fetchIdsByAnnoNumbers(annoNumbers);
	const ids2 = await fetchIdsByLotNames(lotNames, trdMethods);
	return _.union(ids1, ids2);
}

async function fetchIdsByAnnoNumbers(annoNumbers) {
	if (!annoNumbers || annoNumbers.length === 0) return [];
	const annoNumRegex = /^\d+[-][1-9]$/;
	const idSet = new Set();
	const annoNeedFetch = [];

	/* id same as number of announcement, if last digit == 1 */
	annoNumbers.forEach((numAnno) => {
		if (annoNumRegex.test(numAnno)) {
			if (numAnno.at(-1) === "1") idSet.add(numAnno.slice(0, -2));
			else annoNeedFetch.push(numAnno);
		}
	});

	if (annoNeedFetch.length > 0) {
		const mergedQueries = mergePlainQueries(
			queryAnnoIdByNumberAnno,
			annoNeedFetch
		);
		const data = await requestMergedQueries(mergedQueries);
		Object.values(data).forEach((anno) => {
			if (anno) idSet.add(anno[0].id);
		});
	}
	return Array.from(idSet);
}

async function fetchIdsByLotNames(lotNames, trdMethods) {
	if (!lotNames || lotNames.length === 0) return [];
	let safeReq = 10;
	const lotNamePayload = {};
	const idSet = new Set();

	for (let [i, lotName] of lotNames.entries()) {
		lotNamePayload[`a${i}`] = {
			lotName,
			trdMethods,
			lastId: -1,
		};
	}

	while (Object.keys(lotNamePayload).length !== 0 && safeReq-- > 0) {
		const mergedQueries = mergePlainQueries(
			queryAnnoIdByLotName,
			lotNamePayload
		);
		const data = await requestMergedQueries(mergedQueries);

		Object.entries(data).forEach(([alias, lotList]) => {
			if (lotList) {
				for (let lot of lotList) idSet.add(lot.trdBuyId);
				const lotNum = lotList.length;
				if (lotNum === LIMIT) {
					lotNamePayload[alias].lastId = lotList[lotNum - 1].id;
				} else {
					delete lotNamePayload[alias];
				}
			} else {
				delete lotNamePayload[alias];
			}
		});
	}

	return Array.from(idSet);
}

module.exports = {
	fetchAnnoIds,
	fetchIdsByAnnoNumbers,
	fetchIdsByLotNames,
};
