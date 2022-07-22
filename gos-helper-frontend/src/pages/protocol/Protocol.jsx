import ProtocolBriefly from "./components/ProtocolBriefly";
import ProtocolOptions from "./components/ProtocolOptions";
import ProtocolResults from "./components/ProtocolResults";
import ProtocolStatuses from "./components/ProtocolStatuses";
import "./protocol.scss";

function Protocol() {
	return (
		<div className="protocol-container">
			<div className="left">
				<ProtocolStatuses />
				<ProtocolResults />
			</div>
			<div className="right">
				<ProtocolOptions />
				<ProtocolBriefly />
			</div>
		</div>
	);
}

export default Protocol;
