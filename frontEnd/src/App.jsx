import { Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import Login from "./pages/Login";
import Gasolina from "./pages/Gasolina";
import Incidencias from "./pages/Incidencias";
import Home from "./pages/Home";


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/gasolina" element={<Gasolina/>}/>
        <Route path="/incidencias" element={<Incidencias/>}/>
      </Routes>
    </>
  );
}

export default App;
