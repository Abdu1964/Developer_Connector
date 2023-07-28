import React  from 'react';
import { Routes, Route} from 'react-router-dom'; 
import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landing'
import Footer from  './component/layout/Footer'
import Register from './component/auth/Register'
import Login from './component/auth/Login'
/*element means component   in react v6*/
function App() {
  return (
    <div className='app'>
    <Navbar />
    <Routes>
      
    <Route exact path="/" element={<Landing />} />
    
    <Route exact path="/Register" element={<Register />} /> 
    <Route exact path="/Login" element={<Login />} />
   
    </Routes>
    <Footer /> 
      
      
    </div>
  );
}

export default App;
