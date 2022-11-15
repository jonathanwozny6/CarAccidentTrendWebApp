import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import Home from './pages';
import Query1 from './pages/Query1';
import Query2 from './pages/Query2';
import Query3 from './pages/Query3';
import Query4 from './pages/Query4';
import Query5 from './pages/Query5';
import Location from './pages/LocationList';
import TempQuery from './pages/TempQuery';


function App() {
return (
	<Router>
	<Navbar />
	<Routes>
		<Route exact path='/' element={<Home />} />
		<Route path='/Query1' element={<Query1/>} />
    	<Route path='/Query2' element={<Query2/>} />
		<Route path='/Query3' element={<Query3/>} />
		<Route path='/Query4' element={<Query4/>} />
    	<Route path='/Query5' element={<Query5/>} />
		<Route path='/LocationList' element={<Location/>} />
		<Route path='/TempQuery' element={<TempQuery/>} />
	</Routes>
	</Router>
);
}

export default App;
























// import './App.css';

// import LocationList from './LocationList';

// function App() {
//   return (
//     <div className="App">
//       <LocationList />
//     </div>
//   );
// }

// export default App;
