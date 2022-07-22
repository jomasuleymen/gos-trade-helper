import { showAnnos } from "@store/protocols/protocol.slice";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Segmented } from "antd";
import { useState } from "react";
import { useEffect } from "react";

const statuses = [
	{
		label: "Победные",
		value: "win",
	},
	{
		label: "Пройгранные",
		value: "lose",
	},
	{
		label: "Не участвовали",
		value: "notParticipated",
	},
	{
		label: "Нет протокола",
		value: "noProtocol",
	},
];
function ProtocolStatuses() {
	const sortedAnnos = useSelector((store) => store.protocol.sortedAnnos);
	const [value, setValue] = useState(statuses[0].value);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(showAnnos(value));
	}, [sortedAnnos, value]);

	return (
		<div className="protocol-statuses">
			<Segmented
				options={statuses.map((status) => ({
					label: (
						<Badge
							size="small"
							count={sortedAnnos[status.value].length}
							offset={[-5, 10]}
						>
							<div style={{ padding: "17px" }}>
								{status.label}
							</div>
						</Badge>
					),
					value: status.value,
				}))}
				value={value}
				onChange={(value) => setValue(value)}
			/>
		</div>
	);
}

export default ProtocolStatuses;
