import React from 'react'
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link,
//   Switch
// } from 'react-router-dom';

import { BrowserRouter as Router, Route, Link, Routes} 
        from "react-router-dom";

import logo from './logo.svg';
import './App.css';

// pages
import LoginPage from './Pages/Login'
import HomePage from './Pages/Home'
import Query1Page from './Pages/Query1';
import Query2Page from './Pages/Query2';
import Query3Page from './Pages/Query3';
import Query4Page from './Pages/Query4';
import Query5Page from './Pages/Query5';


function App() {
  return (
    <div className="App">
      <Router>
      <div className="list">
              <button><Link to="/">Home</Link></button>
              <button><Link to="query1">Query1</Link></button>
              <button><Link to="query2">Query2</Link></button>
              <button><Link to="query3">Query3</Link></button>
              <button><Link to="query4">Query4</Link></button>
              <button><Link to="query5">Query5</Link></button>
        </div>
        <Routes>
          <Route exact path='/' element={<HomePage />  }></Route>
          <Route path='query1'  element={<Query1Page />}></Route>
          <Route path='query2'  element={<Query2Page />}></Route>
          <Route path='query3'  element={<Query3Page />}></Route>
          <Route path='query4'  element={<Query4Page />}></Route>
          <Route path='query5'  element={<Query5Page />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
