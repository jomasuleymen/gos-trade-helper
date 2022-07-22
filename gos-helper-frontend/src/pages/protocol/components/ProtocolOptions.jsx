import Section from "@components/Section";
import {
	fetchProtocols,
	selectSupplier,
} from "@store/protocols/protocol.actions";
import { Button, Input, Select } from "antd";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function BinInput() {
	const selectedBin = useSelector((store) => store.protocol.selectedBin);
	return (
		<Input
			placeholder="Выделить участника по БИН"
			style={{ fontSize: "13px" }}
			onChange={(e) => {
				selectSupplier(e.target.value);
			}}
			value={selectedBin}
		/>
	);
}

function AnnoNumInput({ annoRef }) {
	const [annoNums, setannoNums] = useState([]);

	const addAnnoNums = (values) => {
		values = values.filter((value) => /^[0-9]+-[0-9]{1}$/.test(value));
		setannoNums((prev) => [...prev, ...values]);
	};

	useEffect(() => {
		annoRef.current = annoNums;
	}, [annoNums]);

	return (
		<Select
			mode="tags"
			style={{
				width: "100%",
			}}
			tokenSeparators={[","]}
			placeholder="Номеры объявлений"
			allowClear
			value={annoNums}
			onSelect={(value) => {
				addAnnoNums([value]);
			}}
			onDeselect={(value) => {
				setannoNums((prev) => prev.filter((el) => el !== value));
			}}
			dropdownStyle={{
				padding: 0,
			}}
			dropdownRender={(menu) => (
				<>
					{menu}

					<label
						htmlFor="file-upload"
						style={{
							display: "block",
							backgroundColor: "#198FFF",
							color: "white",
							cursor: "pointer",
							padding: 5,
							margin: 0,
							height: "100%",
							fontSize: "13px",
						}}
					>
						Выберите файлы
					</label>
					<input
						type="file"
						id="file-upload"
						accept=".xlsx"
						multiple
						style={{
							display: "none",
						}}
						onChange={(e) => {
							const annoNums = [];

							for (let file of e.target.files)
								annoNums.push(file.name.split(" ")[0]);

							addAnnoNums(annoNums);
						}}
					/>
				</>
			)}
		></Select>
	);
}

function ProtocolOptions() {
	const annoRef = useRef([]);

	return (
		<div className="protocol-options">
			<Section title="Выделить участника">
				<BinInput />
			</Section>
			<Section title="Номеры объявлений">
				<AnnoNumInput annoRef={annoRef} />
			</Section>
			<Button
				type="primary"
				style={{ width: "100%" }}
				onClick={() => {
					fetchProtocols(annoRef.current);
				}}
			>
				Показать
			</Button>
		</div>
	);
}

export default ProtocolOptions;
