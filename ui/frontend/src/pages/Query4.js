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
		var tempSevList = []
		var groups = []
		const plotColors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#8884d8"]

		const [sevLeg, setSevLeg] = useState([])

		const [data, setData] = useState([]);

		const [btnClickCnt, setBtnClickCnt] = useState(0);

		// number of locations on the line plot
		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState("hey")

		// time granularity by hour
		const [hourGran, setHourGran] = useState("")

		// selected severity
		const [severity, setSeverity] = useState([false, false, false, false])

		// start and end date input
		const [startDate, setStartDate] = useState("");
		const [endDate, setEndDate] = useState("");

		// function to pass into Search bar dropdown to get receive user input
		const childToParent = (childSelectedState) => {
				setStateUS(childSelectedState);
		}

		// function to pass into Search bar dropdown hour granularity to receive user input
		const GetTimeGranularity = (event) => {
				const index = event.target.id.slice(-1)
				setHourGran(index)
				console.log("Hour Gran", hourGran)

				for (let i = 0; i < 24/parseInt(hourGran); i++) {
					var dict = {}
					dict['TIME_BIN'] = i
					groups.push(dict)
				}
	
				console.log("groups", groups)
				setData(groups)
				console.log(data)
		}

		// function to set the selected severities
		const SetSeverities = (event) => {
			let currSeverity = severity;
			const index = parseInt(event.target.id.slice(-1));
			currSeverity[index] = !currSeverity[index];
			setSeverity(currSeverity);
		}

		// function to add line when "Add Line" button is clicked
		const addLineClicked = () => {
			let oldStateUS = stateUS
			setStateUS(oldStateUS)
			setBtnClickCnt(btnClickCnt + 1)
			console.log("btn clicks", btnClickCnt)
			console.log("stateUS", stateUS)
		} 

		useEffect(() => {
			
			for (let i = 0; i < 24/parseInt(hourGran); i++) {
				var dict = {}
				dict['TIME_BIN'] = i
				groups.push(dict)
			}

			console.log("groups", groups)
			setData(groups)
			console.log(data)
	
		}, [hourGran])


		useEffect(() => {
			
			tempSevList = []
			for (let i = 0; i < severity.length; i++) {
				if (severity[i] === true){
					tempSevList.push(i+1)
					setSevLeg(tempSevList)
					console.log("tempSevList", tempSevList)
					console.log("sevLeg", sevLeg)	
					// options for data request to backend
					const options = {
						method: 'GET',
						url: `http://localhost:8080/query4/${stateUS}`, 
						params: {hr_grp: hourGran, sev: i+1},
					}

					console.log(options)
					if (btnClickCnt % 2 == 1) {

						axios.request(options).then((response) => {
							
							if (response.status===200) {
								const fetchedData = response.data;
								console.log("severity", i+1)
								console.log('fetchedData', fetchedData.length, fetchedData);
								
								console.log("Data", data)
								myData = data
								console.log("My data", myData)

								for (let k = 0; k < myData.length; k++) {
									myData[k][`${i+1}`] = null
								}
								
								let j = 0;
								for (let k = 0; k < fetchedData.length; k++) {
									while (j < myData.length && fetchedData[k]["TIME_BIN"] != myData[j]["TIME_BIN"]) {
										j = j + 1
									}
									myData[j][`${i+1}`] = fetchedData[k][`CNT`]
								}
								
								setData(myData)
								// setData(fetchedData)
								// console.log("My Data", myData)
							}
						}).catch((error) => {
							console.error(error)
						})
					}
				}
			}

		}, [btnClickCnt]);


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
								
											<SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={0}/>
											
											</div>
											<button onClick={addLineClicked}>
															Plot Line +
											</button>
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
									<LineChart data = {data} options={{ maintainAspectRatio: false }} margin={{ right: 300 }}>
										<CartesianGrid strokeDasharray="3 3"/>
										<XAxis dataKey="TIME_BIN" />
										<YAxis></YAxis>
										<Legend />
										<Tooltip />
										{
											sevLeg.map(t => {
													return <Line
													dataKey={`${t}`}
													stroke={`${plotColors[t]}`} 
													activeDot={{ r: 8 }}
													connectNulls
													/>
											})
										}
										{/* <Line
											
											dataKey="1"
											stroke={"red"} 
											activeDot={{ r: 8 }}
											connectNulls
										/> */}
										{/* <Line
											dataKey={"2"}
											stroke={"black"} 
											activeDot={{ r: 8 }}
											connectNulls
										/>
										
										<Line
											dataKey={"3"}
											stroke={"blue"} 
											activeDot={{ r: 8 }}
											connectNulls
										/> */}
										{/* <Line
											dataKey={"4"}
											stroke={"green"} 
											activeDot={{ r: 8 }}
											connectNulls
										/> */}
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
				</div>
		);
};

export default Query4;

