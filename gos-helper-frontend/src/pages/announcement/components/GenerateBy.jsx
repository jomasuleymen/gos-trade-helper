import Section from "../../../components/Section";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
	addLotName,
	setGenerateBy,
	setLotNames,
	setTrdNumbers,
} from "@store/announcements/announce.actions";

import { Select, Radio } from "antd";
import {
	GENERATE_BY_ANNO_NUMBERS,
	GENERATE_BY_LOTNAME,
} from "@services/constants";

const { Option } = Select;

function GenerateBy() {
	const [value, setValue] = useState(0);

	const components = [
		{
			title: "Наименование лота",
			component: SearchByLotNames,
			name: GENERATE_BY_LOTNAME,
		},
		{
			title: "Номер объявлений",
			component: SearchByTrdBuyNums,
			name: GENERATE_BY_ANNO_NUMBERS,
		},
	];

	const SelectedComponent = useMemo(
		() => components[value].component,
		[value]
	);

	return (
		<Section>
			<div>
				<h4
					style={{
						display: "inline-block",
						marginRight: "5px",
						fontWeight: "bold",
					}}
				>
					Поиск по
				</h4>
				<Radio.Group
					onChange={(e) => {
						const componentIndex = e.target.value;
						setGenerateBy(components[componentIndex].name);
						setValue(componentIndex);
					}}
					value={value}
					optionType="button"
					buttonStyle="solid"
					size="small"
				>
					{components.map((item, idx) => (
						<Radio value={idx} key={idx}>
							{item.title.toLocaleLowerCase()}
						</Radio>
					))}
				</Radio.Group>
			</div>
			<Section title={components[value].title}>
				<SelectedComponent />
			</Section>
		</Section>
	);
}

function SearchByLotNames() {
	const selected = useSelector(
		(store) => store.announcement.selected[GENERATE_BY_LOTNAME]
	);
	const values = useSelector((store) => store.announcement.lotNames);

	return (
		<Select
			mode="tags"
			style={{ width: "100%" }}
			tokenSeparators={[","]}
			placeholder="Поиск объявление по наименование лота"
			onChange={(selectedValues) => {
				selectedValues = selectedValues.map((el) => el.trim());
				setLotNames(selectedValues);
			}}
			onSelect={(val) => {
				if (val === "all") {
					setLotNames([...values]);
				} else {
					addLotName(val);
				}
			}}
			value={selected}
			allowClear
		>
			{values.map((lotName) => (
				<Option value={lotName} key={lotName}>
					{lotName}
				</Option>
			))}
		</Select>
	);
}

function SearchByTrdBuyNums() {
	return (
		<Select
			mode="tags"
			style={{ width: "100%" }}
			tokenSeparators={[","]}
			placeholder="Поиск объявление по номер объявлений"
			open={false}
			onChange={(selectedValues) => {
				selectedValues = selectedValues.map((el) => el.trim());
				setTrdNumbers(selectedValues);
			}}
			allowClear
		></Select>
	);
}

export default GenerateBy;
