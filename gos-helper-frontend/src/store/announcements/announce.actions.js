import store from "@store/store";
import {
	selectLotNames,
	selectSign,
	selectTrdMethods,
	selectTrdNumbers,
	selectFilterCodes,
	selectGenerateBy,
	loadData,
	addCompany as AddCompany,
	addLotName as AddLotName,
} from "./announce.slice";
import { getJsonStorage, setJsonStorage } from "@utils/utlis";
import { GENERATOR_LOCALSTORAGE_NAME } from "@services/constants";
import { setLoading } from "@store/announcements/announce.slice";
import { saveAs } from "file-saver";
import http from "@services/http";

export function setLotNames(lotNames) {
	store.dispatch(selectLotNames(lotNames));
}

export function setSign(signName, value) {
	store.dispatch(selectSign({ signName, value }));
}

export function setTrdMethods(trdMethods) {
	store.dispatch(selectTrdMethods(trdMethods));
}

export function setTrdNumbers(trdNumbers) {
	store.dispatch(selectTrdNumbers(trdNumbers));
}

export function setFilterCodes(codes) {
	store.dispatch(selectFilterCodes(codes));
}

export function setGenerateBy(value) {
	store.dispatch(selectGenerateBy(value));
}

export function addCompany(company) {
	store.dispatch(AddCompany(company));
}

export function addLotName(lotName) {
	store.dispatch(AddLotName(lotName));
}

export function saveCurrentData() {
	setJsonStorage(GENERATOR_LOCALSTORAGE_NAME, store.getState().announcement);
}

export function loadLastData() {
	const data = getJsonStorage(GENERATOR_LOCALSTORAGE_NAME);
	if (data) store.dispatch(loadData(data));
}

export async function generateAnnounces() {
	const state = store.getState().announcement;
	const { selected } = state;

	if (selected[state.generateBy].length === 0) {
		alert("Заполните имя лота или номер объявлений");
		return;
	}

	const payload = {
		[state.generateBy]: selected[state.generateBy],
	};

	if (Object.keys(selected.signs).length !== 0)
		payload.signs = selected.signs;

	if (selected.trdMethods.length !== 0)
		payload.trdMethods = selected.trdMethods;

	if (selected.filterCodes.length !== 0)
		payload.filterCodes = selected.filterCodes;

	console.log(payload);

	store.dispatch(setLoading(true));
	saveCurrentData();

	await http("/announce/generator", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		responseType: "blob",
		data: JSON.stringify(payload),
	})
		.then(async (res) => {
			const { data } = res;
			if (data.type === "application/json") {
				const jsonData = JSON.parse(await data.text());
				console.log(jsonData);
			} else {
				saveAs(data, "announcements.zip");
			}
		})
		.catch(async (err) => {
			if (err.response.data.type === "application/json") {
				const data = JSON.parse(await err.response.data.text());
				console.log(data);
				alert(data.error);
			} else {
				console.log(err.message);
			}
		})
		.finally(() => {
			store.dispatch(setLoading(false));
		});
}
