import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query3.css"
// import TempQuery from "./TempQuery"
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

const Query3 = () => {

	// number of locations on the line plot
	//const [numLocs, setNumLocs] = useState(1);

	// US State selected from Search bar dropdown
	const [stateUS, setStateUS] = useState();

	const [btnClickCnt, setBtnClickCnt] = useState(0);

	const [renderTrigger, setRender] = useState(true)

	// start and end date input
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");


	// function to pass into Search bar dropdown to get receive user input
	const childToParent = (childSelectedState, index) => {
			let oldStateUS = stateUS;
			oldStateUS = childSelectedState;
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
	const PlotLine = () => {
			let oldStateUS = stateUS
			setStateUS(oldStateUS)
			setBtnClickCnt(btnClickCnt + 1)
			console.log("btn clicks", btnClickCnt)
			console.log("stateUS", stateUS)
	}

	const [data, setData] = React.useState(); //{D: "", NORM_AVG_SEV: "", NORM_AVG_VIS: ""}

	useEffect(() => {
		console.log(stateUS)
		// options for data request to backend
		const options = {
			method: 'GET',
			url: `http://localhost:8080/query3/${stateUS}`, 
			params: {sDate: startDate, eDate: endDate},
		}

		axios.request(options).then((response) => {
			if (response.status===200) {
				const fetchedData = response.data;
				console.log('fetchedData', fetchedData.length);
				setData(fetchedData)
			}
			// console.log("successfully retrieved data for query 3")
			console.log(response.data)
		}).catch((error) => {
			console.error(error)
		})
		console.log(stateUS)
		console.log(options)
	}, [btnClickCnt]);
	
	return (
		<div className="page-container">
		<h1>Severity versus Visibility</h1>
			<div className="display-container">
				<div className="input-pnl">
						<div className="input-location-section">
								<h3 className='input-pnl-heading'>Location</h3>
								<div className="dropdown">
								
								<SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={0}/>
								
								</div>
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
								yAxisId="left-axis"
								orientation="left"
								tickCount={1}
								domain={[0, 1]}
								>
									<Label value='Severity' offset={2} angle="-90" />
								</YAxis>
							<YAxis
								yAxisId="right-axis"
								orientation="right"
								tickCount={1}
								tick
								domain={[0, 1]}
								>
									<Label value='Visibilty' offset={2} angle="90" />
								</YAxis>
							<Legend />
							<Tooltip />
							<Line
								yAxisId="left-axis"
								name="Average Severity"
								dataKey="NORM_AVG_SEV"
								stroke="black" activeDot={{ r: 8 }}
								/>
							<Line
								yAxisId="right-axis"
								name="Average Visibilty"
								dataKey="NORM_AVG_VIS"
								stroke="blue" activeDot={{ r: 8 }}
								/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
				
		</div>
	);
};

export default Query3;
