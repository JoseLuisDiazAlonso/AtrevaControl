import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Home" element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  );
}

export default App;
