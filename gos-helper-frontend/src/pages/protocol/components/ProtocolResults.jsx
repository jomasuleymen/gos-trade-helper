import { Descriptions, Divider, Table, Tabs, Tag } from "antd";
import { useSelector } from "react-redux";
import refStatuses from "@utils/refs/refStatuses.json";

function ProtocolResults() {
	const announcements = useSelector((store) => store.protocol.showAnnos);

	return (
		<div className="protocol-result">
			<Tabs
				defaultActiveKey="1"
				size="middle"
				type="card"
				style={{
					height: "100%",
				}}
			>
				{announcements.map((anno) => {
					return (
						<Tabs.TabPane
							tab={`${anno.numberAnno} ${anno.RefTradeMethods?.symbolCode}`}
							key={anno.id}
						>
							<AnnoInfo anno={anno} />
							<AnnoLots lots={anno.Lots} />
						</Tabs.TabPane>
					);
				})}
			</Tabs>
		</div>
	);
}

function AnnoInfo({ anno }) {
	const supplierWinSum = useSelector(
		(store) => store.protocol.supplierWinSum
	);

	return (
		<>
			<h3 style={{ textAlign: "center", fontWeight: "bold" }}>
				Информация о объявления
			</h3>
			<Descriptions
				bordered
				size="small"
				column={4}
				layout="vertical"
				style={{
					width: "90%",
					margin: "0 auto",
					marginBottom: "30px",
				}}
			>
				<Descriptions.Item
					label="№ закупки"
					style={{ minWidth: "150px" }}
				>
					<a
						href={`https://www.goszakup.gov.kz/ru/announce/index/${anno.id}`}
						target="_blank"
					>
						{`${anno.numberAnno} ${anno.RefTradeMethods?.symbolCode}`}
					</a>
				</Descriptions.Item>
				<Descriptions.Item label="Наименование закупки">
					{anno.nameRu}
				</Descriptions.Item>
				<Descriptions.Item label="Дата протокола">
					{anno.itogiDatePublic}
				</Descriptions.Item>
				<Descriptions.Item label="Общая сумма">
					{anno.totalSum.toLocaleString("ru")} тг
				</Descriptions.Item>
				<Descriptions.Item label="Наименование организатора" span={3}>
					{anno.orgNameRu}
				</Descriptions.Item>
				<Descriptions.Item label="Победная сумма">
					{supplierWinSum[anno.id]?.toLocaleString("ru")} тг
				</Descriptions.Item>
			</Descriptions>
		</>
	);
}

function AnnoLots({ lots }) {
	return (
		<>
			<h3 style={{ textAlign: "center", fontWeight: "bold" }}>
				Информация о заявки
			</h3>
			{lots.map((lot) => (
				<div key={lot.id}>
					<Descriptions
						layout="vertical"
						size="small"
						column={3}
						bordered
						style={{ width: "60%", margin: "10px auto" }}
					>
						<Descriptions.Item label="Лот №">
							{lot.lotNumber}
						</Descriptions.Item>
						<Descriptions.Item label="Наименование лота" span={2}>
							{lot.nameRu}
						</Descriptions.Item>
						<Descriptions.Item label="Запланированная цена за единицу, тенге">
							{(lot.amount / lot.count).toLocaleString("ru")}
						</Descriptions.Item>
						<Descriptions.Item label="Количество">
							{lot.count}
						</Descriptions.Item>
						<Descriptions.Item label="Запланированная сумма, тенге">
							{Number(lot.amount).toLocaleString("ru")}
						</Descriptions.Item>
					</Descriptions>
					<LotOffers lot={lot} />
					<Divider />
				</div>
			))}
		</>
	);
}

function LotOffers({ lot }) {
	const { offersInfo, offerLots, suppliers, selectedBin } = useSelector(
		(store) => store.protocol
	);

	const lotOffers = offerLots[lot.id];
	const data = [];

	if (lotOffers) {
		lotOffers.forEach((offer, idx) => {
			const offerInfo = offersInfo[offer.appId];
			data.push({
				key: idx,
				number: idx + 1,
				name: suppliers[offerInfo.supplierBinIin]?.fullNameRu,
				bin: offerInfo.supplierBinIin,
				price: offer.price.toLocaleString("ru"),
				amount: offer.amount.toLocaleString("ru"),
				date: offerInfo.dateApply,
				status: offer.statusId,
			});
		});
	}

	return (
		<Table
			size="small"
			bordered
			dataSource={data}
			columns={columns}
			style={{ width: "90%", margin: "0 auto" }}
			pagination={false}
			rowClassName={(row) =>
				row.bin === selectedBin ? "selected-row" : null
			}
		/>
	);
}

const tagColors = {
	Победитель: "green",
	Допущено: "green",
	"Второй победитель": "yellow",
	Подано: "yellow",
	Отклонено: "red",
	Отменено: "red",
};

const columns = [
	{
		title: "№",
		dataIndex: "number",
		key: "number",
	},
	{
		title: "Наименование поставщика",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "БИН (ИИН)",
		dataIndex: "bin",
		key: "bin",
	},
	{
		title: "Цена за единицу",
		dataIndex: "price",
		key: "price",
	},
	{
		title: "Общая сумма поставщика",
		dataIndex: "amount",
		key: "amount",
	},
	{
		title: "Дата и время подачи заявки",
		dataIndex: "date",
		key: "date",
	},
	{
		title: "Статус",
		dataIndex: "status",
		key: "status",
		render: (statusCode, data) => (
			<Tag
				color={tagColors[refStatuses[statusCode]] || "red"}
				key={data.bin}
			>
				{refStatuses[statusCode] || statusCode}
			</Tag>
		),
	},
];

export default ProtocolResults;
