import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navber from "./components/Navber";


function App() {
  return (
    <Router>
      <Navber />
      <Routes>
        <Route path="/login" element={<Login />} />
       
      </Routes>
    </Router>
  );
}

export default App;
