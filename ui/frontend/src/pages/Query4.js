import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query4.css"
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

// holds the hour granularity
const dataHours = [
			{
				"value": 1, 
				"code": 1
			},
			{
				"value": 2, 
				"code": 2
			},
			{
				"value": 3, 
				"code": 3
			},
			{
				"value": 4, 
				"code":4
			}
]

const Query4 = () => {

		// all data
		var myData = {}

		const [stateLeg, setStateLeg] = useState([]);

		// number of locations on the line plot
		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState(["Enter a State..."])

		// time granularity by hour
		const [hourGran, setHourGran] = useState("")

		// selected severity
		const [severity, setSeverity] = useState([false, false, false, false])

		// start and end date input
		const [startDate, setStartDate] = useState("");
		const [endDate, setEndDate] = useState("");

		// function to pass into Search bar dropdown to get receive user input
		const childToParent = (childSelectedState, index) => {
				let oldStateUS = stateUS;
				oldStateUS[index] = childSelectedState;
				setStateUS(oldStateUS);
		}

		// function to pass into Search bar dropdown hour granularity to receive user input
		const GetTimeGranularity = (event) => {
				const index = event.target.id.slice(-1)
				setHourGran(index)
				console.log(hourGran)
		}

		// function to set the selected severities
		const SetSeverities = (event) => {
			let currSeverity = severity;
			const index = parseInt(event.target.id.slice(-1));
			currSeverity[index] = !currSeverity[index];
			setSeverity(currSeverity);
		}

		const [data, setData] = React.useState();

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
				}
			}).catch((error) => {
				console.error(error)
			})

		}, [endDate])


		useEffect(() => {
			if (stateUS[0] != "Enter a State...") {

			
				const i = stateUS.slice(0,-1).length - 1

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
						myData = data
						console.log(myData)

						for (let k = 0; k < myData.length; k++) {
							myData[k][`${stateUS[i]}`] = 0
						}

						let j = 0;
						for (let k = 0; k < fetchedData.length; k++) {
							while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
								j = j + 1
							}
							myData[j][`${stateUS[i]}`] = fetchedData[k][`${stateUS[i]}`]
						}
						
						setData(myData)
						
						console.log("My Data", myData)

					}
					
				}).catch((error) => {
					console.error(error)
				})
			}
			console.log("stateUS length", stateUS.length)
			console.log("StateUS", stateUS)
			console.log("State Leg", stateLeg)
			
		}, [stateUS, hourGran]);


		// // https://codesandbox.io/s/81u1y?file=/src/App.js
		const getRandomColor = () => {
			return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
		  };
		
		return (
			<div className="page-container">
						<h1>Accident Frequency During the Day</h1>
						<div className="display-container">
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
									</div>
									<div className="hour-granularity-selection-container"> 
										<h3 className="input-pnl-heading">Time Granularity</h3>
										<div className="hour-granularity-selection">
											<p>Group by every...</p>
											<div className="hour-granularity-radio-container">
												<div className="hour-granularity-radio">
													<p>1</p>
													<input type="radio" id="radio-1" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>2</p>
													<input type="radio" id="radio-2" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>3</p>
													<input type="radio" id="radio-3" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
											</div>
											

											
											<p>...hour(s)</p>
										</div>
									</div>
									<div className="severity">
										<h3 className="input-pnl-heading">Severity</h3>
										<div className="severity-input">
												<p>1</p>
												<input type="checkbox" id="severity-0" onChange={SetSeverities}/>
										</div>
										<div className="severity-input">
												<p>2</p>
												<input type="checkbox" id="severity-1" onChange={SetSeverities}/>
										</div>
										<div className="severity-input">
												<p>3</p>
												<input type="checkbox" id="severity-2" onChange={SetSeverities}/>
										</div>
										<div className="severity-input">
												<p>4</p>
												<input type="checkbox" id="severity-3" onChange={SetSeverities}/>
										</div>
									</div>
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
										{
											stateUS.slice(0,-1).map(st => {
												return <Line
												dataKey={`${st}`}
												stroke={getRandomColor()} activeDot={{ r: 8 }}
												/>
											})
										}
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
				</div>
		);
};

export default Query4;

