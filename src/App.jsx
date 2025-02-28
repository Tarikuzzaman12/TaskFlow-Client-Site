import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navber from "./components/Navber";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <Navber />
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />

       
      </Routes>
    </Router>
  );
}

export default App;
