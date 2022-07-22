import Section from "@components/Section";
import { Select } from "antd";
import { setSign } from "@store/announcements/announce.actions";
const { Option } = Select;

const signs = [
	{
		title: "Орг. инвалидов",
		name: "disablePersonId",
	},
	{
		title: "Легкой промышлен.",
		name: "isLightIndustry",
	},
];

export default function TrdSigns() {
	return signs.map((item, idx) => (
		<Section key={idx} title={item.title}>
			<Sign name={item.name} />
		</Section>
	));
}

function Sign({ name }) {
	return (
		<Select
			style={{ width: "100%" }}
			defaultValue={false}
			onChange={(value) => {
				setSign(name, value);
			}}
		>
			<Option value={false}>Все закупки</Option>
			<Option value={1}>Только такие закупки</Option>
			<Option value={0}>Исключить такие закупки</Option>
		</Select>
	);
}
