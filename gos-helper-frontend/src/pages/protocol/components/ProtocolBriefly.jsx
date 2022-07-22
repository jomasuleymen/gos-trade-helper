import { Descriptions } from "antd";
import { useSelector } from "react-redux";

function ProtocolBriefly() {
	const { win, lose } = useSelector((store) => store.protocol.sortedAnnos);
	const supplierWinSum = useSelector(
		(store) => store.protocol.supplierWinSum
	);

	return (
		<div className="result-briefly">
			<Descriptions
				title="Краткая информация (выделенная уч.)"
				bordered
				size="small"
				column={1}
			>
				<Descriptions.Item label="Участвовали объявлений">
					{win.length + lose.length}
				</Descriptions.Item>
				<Descriptions.Item label="Победные объявлений">
					{win.length}
				</Descriptions.Item>
				<Descriptions.Item label="Победная сумма">
					{supplierWinSum.amount.toLocaleString("ru")} тг
				</Descriptions.Item>
			</Descriptions>
		</div>
	);
}

export default ProtocolBriefly;
