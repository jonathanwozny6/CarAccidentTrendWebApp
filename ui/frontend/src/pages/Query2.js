import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query2.css"
// import TempQuery from "./TempQuery"
import axios from "axios";
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

const Query2 = () => {

		// number of locations on the line plot
		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState("")

		// start and end date input
		const [startDate, setStartDate] = useState("");
		const [endDate, setEndDate] = useState("");


		// function to pass into Search bar dropdown to get receive user input
		const childToParent = (childSelectedState) => {
				setStateUS(childSelectedState);
		}

		// function to pass into start date input to receive user input
		const getStartDate = (startDateInput) => {
				setStartDate(startDateInput);
		}

		// function to pass into end date input to receive user input
		const getEndDate = (endDateInput) => {
				setEndDate(endDateInput);
		}

		const [data, setData] = React.useState(); //{D: "", CNT: ""}

		useEffect(() => {
			// options for data request to backend
			const options = {
				method: 'GET',
				url: 'http://localhost:8080/query2',
				params: {state: stateUS},
			}

			axios.request(options).then((response) => {
				if (response.status===200) {
					const fetchedData = response.data;
					console.log('fetchedData', fetchedData.length);
					setData(fetchedData)
				}
				// console.log("successfully retrieved data for query 2")
				console.log(response.data)
			}).catch((error) => {
				console.error(error)
			})
			console.log(options.params.state)
		}, [stateUS]);
		
		return (
			<div className="page-container">
						<div className="input-pnl">
								<div className="input-location-section">
										<h3 className='input-pnl-heading'>Location</h3>
										<div className="dropdown">
												<SearchBar placeholder="Enter a State..." data={dataStates} childToParent={childToParent}/>
										</div>
										<button className="add-curve-btn">
												Add Curve +
										</button>
								</div>
								<DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
								<DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/>
						</div>
						<div className="lineplot">
							<h1 className="text-heading">
							</h1>
							<ResponsiveContainer width="100%" aspect={2} >
								<LineChart data = {data} options={{ maintainAspectRatio: false }} margin={{ right: 300 }}>
									<CartesianGrid strokeDasharray="3 3"/>
									<XAxis dataKey="D" />
									<YAxis></YAxis>
									<Legend />
									<Tooltip />
									<Line
										dataKey="CNT"
										stroke="black" activeDot={{ r: 8 }}
										/>
								</LineChart>
							</ResponsiveContainer>
						</div>
				</div>
		);
};

export default Query2;







// 	switch(numSlashes){

		// 		case 0:
		// 			// make sure first position is a 1 or 0
		// 			if (currDate[0] !== '0' && currDate[0] !== '1'){
		// 					event.target.value = '';
		// 			}

		// 			// if the first value is 0, only let the next month value be natural number between 1 and 9 inclusive
		// 			if (event.target.value[0] === '0'){
		// 					// if a '/' is put prematurely
		// 					if (event.target.value[1] === '/'){
		// 						event.target.value = event.target.value[0];
		// 					}
		// 					// if second month character is not a number
		// 					else if (event.target.value.charCodeAt(1) < 49 || event.target.value.charCodeAt(1) > 57) {
		// 							event.target.value = event.target.value[0]
		// 					}
		// 		 	} 
		// 			// if the first value is 1
		// 			else if (event.target.value[0] === '1'){
		// 					// the second month value can only be 0, 1, 2
		// 					if (event.target.value[1] !== '0' && event.target.value[1] !== '1' && event.target.value[1] !== '2') {
		// 							event.target.value = event.target.value[0];
		// 					}
		// 			}
					
		// 			break;


		// 		case 1:
		// 			console.log("Here")


		// 			break;
			
		// 	}
		// 	console.log(event.target.value)

// 	switch(numSlashes){

		// 		case 0:
		// 			// make sure first position is a 1 or 0
		// 			if (currDate[0] !== '0' && currDate[0] !== '1'){
		// 					event.target.value = '';
		// 			}

		// 			// if the first value is 0, only let the next month value be natural number between 1 and 9 inclusive
		// 			if (event.target.value[0] === '0'){
		// 					// if a '/' is put prematurely
		// 					if (event.target.value[1] === '/'){
		// 						event.target.value = event.target.value[0];
		// 					}
		// 					// if second month character is not a number
		// 					else if (event.target.value.charCodeAt(1) < 49 || event.target.value.charCodeAt(1) > 57) {
		// 							event.target.value = event.target.value[0]
		// 					}
		// 		 	} 
		// 			// if the first value is 1
		// 			else if (event.target.value[0] === '1'){
		// 					// the second month value can only be 0, 1, 2
		// 					if (event.target.value[1] !== '0' && event.target.value[1] !== '1' && event.target.value[1] !== '2') {
		// 							event.target.value = event.target.value[0];
		// 					}
		// 			}
					
		// 			break;


		// 		case 1:
		// 			console.log("Here")


		// 			break;
			
		// 	}
		// 	console.log(event.target.value)