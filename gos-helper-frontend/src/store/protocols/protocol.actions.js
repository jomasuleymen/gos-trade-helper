import { setProtocols, setBin } from "./protocol.slice";
import http from "@services/http";
import store from "@store/store";

export async function fetchProtocols(annoNums) {
	http.post("/protocol", { annoNums })
		.then((res) => {
			const { announcements, offersInfo, offerLots, suppliers } =
				res.data;

			orderAnnoLotsByOfferNums({ announcements, offerLots });
			sortOffersByAmount({ offerLots });

			store.dispatch(
				setProtocols({
					announcements,
					offersInfo,
					offerLots,
					suppliers,
				})
			);
		})
		.catch((err) => {
			console.log(err);
		});
}

function orderAnnoLotsByOfferNums({ announcements, offerLots }) {
	announcements.forEach((anno) => {
		anno.Lots.sort(
			(lot1, lot2) =>
				(offerLots[lot2.id]?.length || 0) -
				(offerLots[lot1.id]?.length || 0)
		);
	});
}

function sortOffersByAmount({ offerLots }) {
	Object.values(offerLots).forEach((lotOffers) => {
		lotOffers.sort((a, b) => a.amount - b.amount);
	});
}

export function selectSupplier(bin) {
	store.dispatch(setBin(bin));
}
