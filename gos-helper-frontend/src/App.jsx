import Announcement from "./pages/announcement/Announcement";
import { Routes, Route, Navigate } from "react-router-dom";
import Protocol from "./pages/protocol/Protocol";
import Header from "./components/Header";
import { Layout } from "antd";

import "./App.scss";

function App() {
	return (
		<Layout className="layout" style={{ height: "100%" }}>
			<Layout.Header>
				<Header />
			</Layout.Header>
			<Layout.Content>
				<Routes>
					<Route
						path="/"
						element={<Navigate to="/announcement" replace={true} />}
					/>
					<Route path="/announcement" element={<Announcement />} />
					<Route path="/protocol" element={<Protocol />} />
					<Route path="*" element={<p>There's nothing here!</p>} />
				</Routes>
			</Layout.Content>
		</Layout>
	);
}

export default App;
