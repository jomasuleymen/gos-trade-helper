import { useEffect } from "react";
import { Button, Divider } from "antd";

import { loadLastData } from "@store/announcements/announce.actions";
import { generateAnnounces } from "@store/announcements/announce.actions";

import CompanySelect from "./components/CompanySelect";
import TradeMethods from "./components/TradeMethods";
import LotStatuses from "./components/LotStatuses";
import TradeSigns from "./components/TradeSigns";
import GenerateBy from "./components/GenerateBy";
import Section from "@components/Section";

import { useSelector } from "react-redux";
import "./announcement.scss";

function Announcement() {
	useEffect(() => {
		loadLastData();
	}, []);

	return (
		<div className="announcement-container">
			<Divider orientation="center" style={{ marginTop: 0 }}>
				Генерировать
			</Divider>
			<Section>
				<LotStatuses />
			</Section>
			<GenerateBy />
			<Section title="Способ закупки">
				<TradeMethods />
			</Section>
			<TradeSigns />
			<Section title="Фильтрация лоты">
				<CompanySelect />
			</Section>
			<SendButton />
		</div>
	);
}

function SendButton() {
	const loading = useSelector((store) => store.announcement.loading);

	return (
		<Button
			type="primary"
			style={{ width: "100%" }}
			onClick={generateAnnounces}
			loading={loading}
		>
			Генерировать
		</Button>
	);
}

export default Announcement;
