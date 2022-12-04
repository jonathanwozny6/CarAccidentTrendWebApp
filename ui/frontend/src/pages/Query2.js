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
import * as scale from 'd3-scale'
import $ from 'jquery'

const Query2 = () => {

		// all data
		var myData = {}
		var stateLeg = []

		// number of locations on the line plot
		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState([])
		// let stateUS = ["Enter a State..."]

		// start and end date input
		const [startDate, setStartDate] = useState("");
		const [endDate, setEndDate] = useState("");

		// function to pass into Search bar dropdown to get receive user input
		const childToParent = (childSelectedState, index) => {
				let oldStateUS = stateUS;
				oldStateUS[index] = childSelectedState;
				setStateUS(oldStateUS);
		}

		// function to pass into start date input to receive user input
		const getStartDate = (startDateInput) => {
				setStartDate(startDateInput);
		}

		// function to pass into end date input to receive user input
		const getEndDate = (endDateInput) => {
				setEndDate(endDateInput);
		}

		// function to add line when "Add Line" button is clicked
		const addLineClicked = () => {
				let oldStateUS = stateUS
				setStateUS(oldStateUS.concat("Enter a State..."));
		}

		const [data, setData] = React.useState(); //{D: "", CNT: ""}

		useEffect(() => {
			const optionsDates = {
				method: 'GET',
				url: `http://localhost:8080/dates`, 
				params: {sDate: startDate, eDate: endDate},
			}

			axios.request(optionsDates).then((response) => {
				if (response.status===200) {
					const fetchedData = response.data;
					setData(fetchedData);
					myData = fetchedData;
					console.log("My Data 1", myData)
				}
			}).catch((error) => {
				console.error(error)
			})

		}, [endDate])


		useEffect(() => {
			for (let i = 0; i < stateUS.length - 1; i++) {
				// options for data request to backend
				const options = {
					method: 'GET',
					url: `http://localhost:8080/query2/${stateUS[i]}`, 
					params: {sDate: startDate, eDate: endDate},
				}

				axios.request(options).then((response) => {
					if (response.status===200) {
						const fetchedData = response.data;
						console.log('fetchedData', fetchedData.length, fetchedData);
						// setData(fetchedData)
						// console.log("Fetched", fetchedData)

						// if (i == 0) {
						// 	myData = fetchedData
						// }
						// else {
						// 	for (let k = 0; k < myData.length; k++) {
						// 		myData[k][`${stateUS[i]}`] = 0
						// 	}
	
						// 	let j = 0;
						// 	for (let k = 0; k < fetchedData.length; k++) {
						// 		while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
						// 			j = j + 1
						// 			console.log(fetchedData[k]["ACC_DATE"], myData[j]["ACC_DATE"])
						// 		}
						// 		myData[j][`${stateUS[i]}`] = fetchedData[k][`${stateUS[i]}`]
						// 	}
						// }
						myData = data
						console.log("My Data 3", myData)

						for (let k = 0; k < myData.length; k++) {
							myData[k][`${stateUS[i]}`] = 0
						}

						let j = 0;
						for (let k = 0; k < fetchedData.length; k++) {
							while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
								j = j + 1
								console.log(fetchedData[k]["ACC_DATE"], myData[j]["ACC_DATE"])
							}
							myData[j][`${stateUS[i]}`] = fetchedData[k][`${stateUS[i]}`]
						}

						for (let i = 0; i < stateUS.length - 1; i++) {
							stateLeg.concat(stateUS[i]);
						}
						
						console.log("State leg", stateLeg)

						// $.extend(true, myData, fetchedData)

						setData(myData)
						
						console.log("My Data 4", myData)
						// myData = fetchedData						
					}
					// console.log("successfully retrieved data for query 2")
					// console.log(response.data)
				}).catch((error) => {
					console.error(error)
				})
			}
			
		}, [stateUS]);
		
		return (
			<div className="page-container">
						<div className="input-pnl">
								<div className="input-location-section">
										<h3 className='input-pnl-heading'>Location</h3>
										<div className="dropdown">
												{
													stateUS.map((state, index) => {
															return <SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={index}/>
													})
												}
										</div>
										<button className="add-curve-btn" onClick={addLineClicked}>
												Add Line +
										</button>
								</div>
								<DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
								<DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/>
						</div>
						<div className="lineplot">
							<h1 className="text-heading">
							</h1>
							<ResponsiveContainer width="100%" aspect={2} >
								<LineChart data = {data} xScale={scale.scaleTime} options={{ maintainAspectRatio: false }} margin={{ right: 300 }}>
									<CartesianGrid strokeDasharray="3 3"/>
									<XAxis dataKey="ACC_DATE" numberOfTicks={6} />
									<YAxis></YAxis>
									<Legend />
									<Tooltip />
									<Line
										dataKey={"AZ"}
										stroke="black" activeDot={{ r: 8 }}
										/>
								</LineChart>
							</ResponsiveContainer>
						</div>
				</div>
		);
};

export default Query2;

