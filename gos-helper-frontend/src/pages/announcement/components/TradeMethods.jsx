import { useSelector } from "react-redux";
import { setTrdMethods } from "@store/announcements/announce.actions";
import { Select } from "antd";
const { Option } = Select;

const values = [
	{
		label: "Государственные закупки с применением особого порядка",
		value: 130,
	},
	{
		label: "Конкурс с применением специального порядка",
		value: 128,
	},
	{
		label: "Конкурс с предварительным квалификационным отбором",
		value: 32,
	},
	{
		label: "Из одного источника путем прямого заключения договора",
		value: 23,
	},
	{
		label: "Запрос ценовых предложений",
		value: 3,
	},
	{
		label: "Открытый конкурс",
		value: 2,
	},
];

function TradeMethods() {
	const selected = useSelector(
		(store) => store.announcement.selected.trdMethods
	);

	return (
		<Select
			mode="multiple"
			allowClear
			style={{ width: "100%" }}
			onChange={(selectedValues) => {
				setTrdMethods(selectedValues);
			}}
			showSearch={false}
			value={selected}
			showArrow={true}
			placeholder="Поиск объявление по способ закупки"
		>
			{values.map((item, idx) => (
				<Option value={item.value} key={idx}>
					{item.label}
				</Option>
			))}
		</Select>
	);
}

export default TradeMethods;
