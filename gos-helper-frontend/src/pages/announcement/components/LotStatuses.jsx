import { Tag } from "antd";
function LotStatuses() {
    return (
        <div className="lot-statuses">
            <Tag color="blue">Опубликован (прием ценовых предложений)</Tag>
            <Tag color="blue">Опубликован (прием заявок)</Tag>
            <Tag color="blue">Опубликован</Tag>
        </div>
    );
}

export default LotStatuses;
