import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
//import "./App.css";
import "./routes/Customer";
import Customer from "./routes/Customer";
import Home from "./routes/Home";
import TicketNumber from "./routes/TicketNumer";
import CounterOfficier from "./routes/CounterOfficier";
import Manager from "./routes/Manager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/ticketnumber" element={<TicketNumber />} />
        <Route path="/counterofficier" element={<CounterOfficier />} />
        <Route path="/manager" element={<Manager/>} />
        {/*add a new path here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
