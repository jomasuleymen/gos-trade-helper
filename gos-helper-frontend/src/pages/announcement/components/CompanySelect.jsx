import { useSelector } from "react-redux";
import { useState } from "react";
import {
	addCompany,
	setFilterCodes,
} from "@store/announcements/announce.actions";
import { Select, Divider, Button, Modal, Input } from "antd";
const { Option } = Select;

function CompanySelect() {
	const values = useSelector((store) => store.announcement.companies);
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Select
				style={{ width: "100%" }}
				tokenSeparators={[",", " ", "\n"]}
				placeholder="Фильтровать лоты по КПВЭД"
				allowClear
				dropdownRender={(menu) => (
					<>
						{menu}
						<Divider style={{ margin: "8px 0" }} />
						<Button
							type="primary"
							style={{ width: "100%" }}
							onClick={() => setShowModal(true)}
						>
							Добавить коллекцию
						</Button>
					</>
				)}
				onSelect={(idx) => {
					setFilterCodes(values[idx].codes);
				}}
				onDeselect={() => {
					setFilterCodes(false);
				}}
			>
				{values.map((item, idx) => (
					<Option value={idx} key={item.name}>
						{item.name}
					</Option>
				))}
			</Select>

			{showModal && <AddCompanyModal setVisible={setShowModal} />}
		</>
	);
}

function AddCompanyModal({ setVisible }) {
	let name = "";
	let codes = [];
	return (
		<Modal
			title="Добавить коллекцию кода для фильтраций"
			centered
			visible={true}
			onOk={() => {
				if (name.length === 0) {
					alert("Имя коллекций не должен пустым");
					return;
				}
				if (codes.length === 0) {
					alert("Коды не должен пустым");
					return;
				}
				addCompany({ name, codes });
				setVisible(false);
			}}
			onCancel={() => setVisible(false)}
		>
			<Input
				placeholder="Наименования коллекций"
				onChange={(e) => (name = e.target.value)}
				allowClear
				style={{ marginBottom: "7px" }}
			/>
			<Select
				mode="tags"
				style={{ width: "100%" }}
				tokenSeparators={[" ", ",", "\n"]}
				placeholder="Коды 152032 или 15.20.32"
				open={false}
				allowClear
				onSelect={(code) => {
					if (
						!/^\d{2}.\d{2}.\d{2}$/.test(code) &&
						!/^\d{6}$/.test(code)
					)
						return;
					code.replaceAll(".", "");
					if (!codes.includes(code)) codes = [...codes, code];
				}}
				onDeselect={(code) => {
					codes = codes.filter((item) => item !== code);
				}}
			></Select>
		</Modal>
	);
}

export default CompanySelect;
