import React  from 'react';
import {Provider} from 'react-redux' //to set up redux
import { Routes, Route} from 'react-router-dom'; 
import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landing'
import Footer from  './component/layout/Footer'
import Register from './component/auth/Register'
import Login from './component/auth/Login'
import  store from './store'
/*element means component   in react v6*/
function App() {
  return (
    <Provider store={store}>
    <div className='app'>
    <Navbar />
    <Routes>
      
    <Route exact path="/" element={<Landing />} />
    <Route exact path="/Register" element={<Register />} /> 
    <Route exact path="/Login" element={<Login />} />
   
    </Routes>
    <Footer /> 
      
    
    </div>
    </Provider>
  );
}

export default App;
