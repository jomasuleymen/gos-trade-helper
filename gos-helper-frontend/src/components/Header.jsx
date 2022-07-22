import { NavLink } from "react-router-dom";

function Header() {
	return (
		<>
			<StyledLink to="/announcement" title="Объявление" />
			<StyledLink to="/protocol" title="Протокол" />
		</>
	);
}
function StyledLink(props) {
	return (
		<NavLink
			to={props.to}
			className={({ isActive }) => (isActive ? "selected" : undefined)}
		>
			{props.title}
		</NavLink>
	);
}

export default Header;
