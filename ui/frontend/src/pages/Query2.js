import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query2.css"
import axios from "axios";
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
	Label,
    CartesianGrid
} from 'recharts';
import * as scale from 'd3-scale'

const Query2 = () => {

	// all data
	var myData = {}

	const [data, setData] = useState();

	const [stateLeg, setStateLeg] = useState([]);

	// number of locations on the line plot
	const [numLocs, setNumLocs] = useState(1);

	// US State selected from Search bar dropdown
	const [stateUS, setStateUS] = useState()
	// let stateUS = ["Enter a State..."]

	// road type: highway or non-highway
	const [roadType, setRoadType] = useState(["Highway", "Street"])

	// road val: 1 or 0
	const [roadVal, setRoadVal] = useState([1,0])

	// severity: 1, 2, 3, 4
	const [severity, setSeverity] = useState("0");

	// start and end date input
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// counts the number of times the button is clicked
	const [btnClickCnt, setBtnClickCnt] = useState(0);

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

	// function to get the road type (highway or non-highway)
	const GetRoadType = (event) => {
			setRoadType(event.target.id.slice(-1))
	}

	// function to get severity
	const GetSeverity = (event) => {
			setSeverity(event.target.id.slice(-1));
			console.log(severity)
	}

	// function to add line when "Add Line" button is clicked
	const addLineClicked = () => {
			let oldStateUS = stateUS
			setStateUS(oldStateUS);
	} 

	// function to plot line when plot button is clicked
	const PlotLine = () => {
		let oldStateUS = stateUS
		setStateUS(oldStateUS)
		if (btnClickCnt === Number.MAX_SAFE_INTEGER){
				setBtnClickCnt(1)
		}
		else
				setBtnClickCnt(btnClickCnt+1)

		console.log(btnClickCnt);
	}

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
		for (let i = 0; i < roadType.length; i++) {
			if (btnClickCnt % 2 == 1) {

				// options for data request to backend
				const options = {
					method: 'GET',
					url: `http://localhost:8080/query2/${stateUS}`, 
					params: {sDate: startDate, eDate: endDate, rType: roadVal[i], sev: severity},
				}

				axios.request(options).then((response) => {
					
					if (response.status===200) {
						const fetchedData = response.data;
						console.log('fetchedData', fetchedData.length, fetchedData);
						myData = data
						console.log("My Data", myData)
						setData(fetchedData)

						for (let k = 0; k < myData.length; k++) {
							myData[k][`${roadType[i]}`] = null
						}

						let j = 0;
						for (let k = 0; k < fetchedData.length; k++) {
							while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
								j = j + 1
							}
							myData[j][`${roadType[i]}`] = fetchedData[k][`CNT`]
						}
						
						setData(myData)
						
						console.log("My Data", myData)
					}
					
				}).catch((error) => {
					console.error(error)
				})
			}
		}
		console.log("StateUS", stateUS)
		console.log("State Leg", stateLeg)
		
	}, [btnClickCnt]);


		// // https://codesandbox.io/s/81u1y?file=/src/App.js
		const getRandomColor = () => {
			return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
		  };
		
		return (
			<div className="page-container">
					<h1> Accident Frequency by Street Type and Severity</h1> 
          <div className="display-container">
						<div className="input-pnl">
								<div id="severity-section" className="section">
									<h3>Severity</h3>
									<div className="radio-container">
											<div className="radio">
												<p>1</p>
												<input type="radio" id="radio-1" name="severity" onChange={GetSeverity}/>
											</div>
											<div className="radio">
												<p>2</p>
												<input type="radio" id="radio-2" name="severity" onChange={GetSeverity}/>
											</div>
											<div className="radio">
												<p>3</p>
												<input type="radio" id="radio-3" name="severity" onChange={GetSeverity}/>
											</div>
											<div className="radio">
												<p>4</p>
												<input type="radio" id="radio-4" name="severity" onChange={GetSeverity}/>
											</div>
										</div>
									</div>
								<div className="input-location-section">
										<h3 className='input-pnl-heading'>Location</h3>
										<div className="dropdown">
											<SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={0}/>
										</div>
										<button className="add-curve-btn" onClick={addLineClicked}>
												Add Line +
										</button>
								</div>
								<DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
								<DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/>
								<div className="center">
										<button id="plot-btn" onClick={PlotLine}><h3>Plot Line</h3></button>
								</div>
						</div>
						<div className="lineplot">
							<h1 className="text-heading">
							</h1>
							<ResponsiveContainer width="100%" aspect={2} >
								<LineChart data = {data} xScale={scale.scaleTime} options={{ maintainAspectRatio: false }} margin={{ right: 300 }}>
									<CartesianGrid strokeDasharray="3 3"/>
									<XAxis dataKey="ACC_DATE" numberOfTicks={6}>
										<Label value='Time' offset={2}/>
									</XAxis>
									<YAxis
										// yAxisId="left-axis"
										orientation="left"
										>
										<Label value='Frequency' offset={2} angle="-90" />
									</YAxis>
									<Legend />
									<Tooltip />
									{/* #1f77b4", "#ff7f0e", "#2ca02c", "#8884d8 */}
									<Line
											dataKey={`${roadType[0]}`}
											stroke={"#1f77b4"} activeDot={{ r: 8 }}
											connectNulls
									/>
									<Line
											dataKey={`${roadType[1]}`}
											stroke={"#ff7f0e"} activeDot={{ r: 8 }}
											connectNulls
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
				</div>
			</div>
		);
};

export default Query2;

