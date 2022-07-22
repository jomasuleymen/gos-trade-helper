import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	announcements: [],
	offersInfo: {},
	offerLots: [],
	suppliers: {},
	sortedAnnos: {
		win: [],
		lose: [],
		notParticipated: [],
		noProtocol: [],
	},
	supplierWinSum: {
		// annoId: sum,
		amount: 0,
	},
	showAnnos: [], // changes value on ProtocolStatuses(observes sortedAnnos changes)
	selectedBin: "921040000599",
};

export const protocolSlice = createSlice({
	name: "protocolSlice",
	initialState,
	reducers: {
		setProtocols: (state, { payload }) => {
			sortProtocols(state, payload);
		},
		setBin: (state, { payload }) => {
			state.selectedBin = payload;
			sortProtocols(state);
		},
		showAnnos: (state, { payload }) => {
			state.showAnnos = state.sortedAnnos[payload] || [];
		},
	},
});

function sortProtocols(state, newData) {
	const newSortedAnnos = {
		win: [],
		lose: [],
		notParticipated: [],
	};

	if (newData) {
		newSortedAnnos.noProtocol = getNoProtocols(newData);
		newData.announcements = newData.announcements.filter(
			(anno) => !newSortedAnnos.noProtocol.includes(anno)
		);
		state.supplierWinSum = { amount: 0 };
		Object.assign(state, newData);
	}

	const {
		announcements,
		offersInfo,
		offerLots,
		suppliers,
		selectedBin,
		sortedAnnos,
		supplierWinSum,
	} = state;

	if (!suppliers[selectedBin] && !newData) {
		const { win, lose, notParticipated } = sortedAnnos;
		newSortedAnnos.notParticipated = [...win, ...lose, ...notParticipated];
		Object.keys(supplierWinSum).forEach((key) => {
			supplierWinSum[key] = 0;
		});
	} else {
		for (let anno of announcements) {
			let participated = false;
			let win = false;
			supplierWinSum[anno.id] = 0;

			for (let lot of anno.Lots) {
				const lotOffers = offerLots[lot.id];
				if (lotOffers) {
					const selectedOffer = lotOffers.find(
						(offer) =>
							offersInfo[offer.appId].supplierBinIin ===
							selectedBin
					);

					if (selectedOffer) {
						participated = true;
						if (
							selectedOffer.statusId === 360 ||
							(selectedOffer.statusId === 120 &&
								lotOffers.length === 1) ||
							selectedOffer.statusId === 330
						) {
							win = true;
							supplierWinSum.amount += selectedOffer.amount;
							supplierWinSum[anno.id] += selectedOffer.amount;
						}
					}
				}
			}

			if (win) {
				newSortedAnnos.win.push(anno);
			} else if (participated) {
				newSortedAnnos.lose.push(anno);
			} else {
				newSortedAnnos.notParticipated.push(anno);
			}
		}
	}

	Object.assign(state.sortedAnnos, newSortedAnnos); // protocol may be or not, for this reason used object.assign, but not =
}

function getNoProtocols({ announcements, offerLots }) {
	const noProtocol = [];

	announcements.forEach((anno) => {
		let hasProtocol = false;

		anno.Lots.forEach((lot) => {
			if (offerLots[lot.id]) {
				hasProtocol = true;
				return;
			}
		});

		if (!hasProtocol) {
			noProtocol.push(anno);
		}
	});

	return noProtocol;
}

export const { setProtocols, setBin, showAnnos } = protocolSlice.actions;

export default protocolSlice.reducer;
