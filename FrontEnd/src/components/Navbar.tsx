import { NavLink } from "react-router-dom";


const Navbar = () => {
return (
<header style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #ccc" }}>
<h2>StudentGuard</h2>
<nav style={{ display: "flex", gap: "16px" }}>
<NavLink to="/">Carga Masiva</NavLink>
<NavLink to="/ajuste">Ajuste</NavLink>
<NavLink to="/evaluacion">Evaluación</NavLink>
<NavLink to="/prediccion">Predicción</NavLink>
</nav>
</header>
);
};


export default Navbar;
