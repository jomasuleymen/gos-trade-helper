import { configureStore } from "@reduxjs/toolkit";
import announceReducer from "./announcements/announce.slice";
import protocolReducer from "./protocols/protocol.slice";

export default configureStore({
	reducer: {
		announcement: announceReducer,
		protocol: protocolReducer,
	},
});
