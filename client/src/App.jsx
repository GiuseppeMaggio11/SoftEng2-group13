import React from 'react'; 
import { BrowserRouter, Outlet, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
//import './App.css'
import './routes/Customer'
import Customer from './routes/Customer';
import Home from './routes/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Home/>} />
        <Route path="/customer" element={<Customer/>} />
        {/*add a new path here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
