import { createSlice } from "@reduxjs/toolkit";
import {
	GENERATE_BY_ANNO_NUMBERS,
	GENERATE_BY_LOTNAME,
} from "@services/constants";

const initialState = {
	generateBy: GENERATE_BY_LOTNAME,
	selected: {
		[GENERATE_BY_LOTNAME]: [],
		[GENERATE_BY_ANNO_NUMBERS]: [],
		trdMethods: [],
		signs: {},
		filterCodes: [],
	},
	companies: [],
	lotNames: [],
	loading: false,
};

export const announceGeneratorSlice = createSlice({
	name: "announceGenerator",
	initialState,
	reducers: {
		setLoading: (state, { payload }) => {
			state.loading = payload;
		},
		selectLotNames: (state, { payload }) => {
			state.selected[GENERATE_BY_LOTNAME] = payload;
		},
		selectTrdNumbers: (state, { payload }) => {
			state.selected[GENERATE_BY_ANNO_NUMBERS] = payload;
		},
		selectTrdMethods: (state, { payload }) => {
			state.selected.trdMethods = payload;
		},
		selectFilterCodes: (state, { payload }) => {
			if (payload) state.selected.filterCodes = payload;
			else state.selected.filterCodes = [];
		},
		selectGenerateBy: (state, { payload }) => {
			state.generateBy = payload;
		},
		selectSign: (state, { payload }) => {
			const { signName, value } = payload;
			if (value === false && signName in state.selected.signs) {
				delete state.selected.signs[signName];
			} else {
				state.selected.signs[signName] = value;
			}
		},
		loadData: (state, { payload }) => {
			const { companies, lotNames, selected } = payload;
			state.companies = companies;
			state.lotNames = lotNames;
			state.selected.trdMethods = selected.trdMethods;
			state.selected[GENERATE_BY_LOTNAME] = selected[GENERATE_BY_LOTNAME];
		},

		addCompany: (state, { payload }) => {
			state.companies.push(payload);
		},

		addLotName: (state, { payload }) => {
			if (!state.lotNames.includes(payload)) state.lotNames.push(payload);
		},
	},
});

export const {
	setLoading,
	selectLotNames,
	selectSign,
	selectTrdMethods,
	selectTrdNumbers,
	selectFilterCodes,
	selectGenerateBy,
	loadData,
	addCompany,
	addLotName,
} = announceGeneratorSlice.actions;

export default announceGeneratorSlice.reducer;
