import React from 'react';

// to move between pages
import { BrowserRouter as Router, Route, Link, Routes} 
        from "react-router-dom";

import './App.css';


// import pages
import Location from './Pages/Location'
// import LoginPage from './Pages/Login';
import HomePage from './Pages/Home';

function App() {
  return (
    <div>
      hey
    </div>
    // <div className = "App"> 
    //   <Router>
    //     <div className="list">
    //       <button><Link to="/Home">Home</Link></button>
    //     </div>
    //     <Routes>
    //         {/* <Route exact path='/' element={<LoginPage  />}></Route> */}
    //         <Route path = '/Home' element={<HomePage   />}></Route>
    //     </Routes>
    //   </Router>
    // </div>
  );
}


export default App;




