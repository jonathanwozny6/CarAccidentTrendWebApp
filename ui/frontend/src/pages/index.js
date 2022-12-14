import React from 'react';
import "./PagesCSS/index.css"
import {useState, useEffect} from 'react';
import axios from "axios";
import { FaAppStore } from 'react-icons/fa';



const Home = () => {
	
	const [tupleCount, setTupleCount] = useState([0,0,0,0,0]);

	
	const [path, setPath] = useState(["accCounts","locCounts","envCounts","roadCounts","allCounts"]);

	const [btnClickCnt, setBtnClickCnt] = useState(0);

	const showTuples = () => {
		console.log('btnClickCnt', btnClickCnt)
																												setTupleCount([2844645,16937,268768,1069764,4200114])
		setBtnClickCnt(btnClickCnt + 1);
	}

	useEffect(() => {
		if (btnClickCnt > 1) {
			for(let i = 0; i < 5; i++) {
				const optionsDates = {
					method: 'GET',
					url: `http://localhost:8080/${path[i]}`,
				}
		
				axios.request(optionsDates).then((response) => {
					if (response.status===200) {
						const fetchedData = response.data;
						console.log(fetchedData)
						// setTupleCount(fetchedData);
						console.log(tupleCount)
					}
				}).catch((error) => {
					console.error(error)
				})
			}
		}

	}, [btnClickCnt])

return (
	<div className='content'>
		<h1>Car Accident Trends from 2016 to 2021</h1>
		<div className='paragraph'>
			<p className='subtitle'>A project by Nishant Agrawal, Nicholas Salazar, Alexander Wozny, and Jonathan Wozny </p>
			<p className='introduction'>&emsp;&emsp;This application presents accident statistics in 5 customizable queries.  Use the navigation bar above to view each of the following queries:
				<ol>
					<li>Average Accident Frequency by Region and Time Period</li>
					<li>Average Accident Frequency by Street Type and Severity</li>
					<li>Accident Severity versus Visibility </li>
					<li>Accident Frequency During the Day</li>
					<li>Frequency of Accidents During Inclement Weather</li>
				</ol>
			</p>
			<p className='introduction'>&emsp;&emsp;These queries pull data from the Accidents Dataset through the Oracle Database.  The dataset contains a total of </p>
			<div className='tupleCount'>
				<button type='button' id='b' onClick={showTuples}>Show the total number of tuples!</button>
				<table className='countTable'>
					<tr>
						<td className='tableName'>Accidents Table:</td>
						<td>{tupleCount[0]}</td>
					</tr>
					<tr>
						<td className='tableName'>Location Table:</td>
						<td>{tupleCount[1]}</td>

					</tr>
					<tr>
						<td className='tableName'>Road Table:</td>
						<td>{tupleCount[3]}</td>

					</tr>
					<tr>
						<td className='tableName'>Environment Table:</td>
						<td>{tupleCount[2]}</td>
					</tr>
					<tr>
						<td className='tableName'>Total:</td>
						<td>{tupleCount[4]}</td>
					</tr>
				</table>
			</div>
			<p className='introduction'>
				entries, with each entry containing specific information about an accident such as its location,
				its date, the time it occurred, the weather, the type of road, the severity, and other data.
			</p>
		</div>
	</div>
);
};

export default Home;
