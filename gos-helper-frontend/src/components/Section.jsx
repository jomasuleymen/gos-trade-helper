export default function Section({ title, children }) {
	return (
		<div className="list-item">
			{title && <h4 className="title">{title}</h4>}
			{children}
		</div>
	);
}
