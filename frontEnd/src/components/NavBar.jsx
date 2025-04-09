import {Link} from "react-router-dom";

const NavBar = () => {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/gasolina">Consumo de Gasolina</Link>
                <Link to="/incidencias">Incidencias</Link>
            </nav>
        </div>
    )
}

export default NavBar;
