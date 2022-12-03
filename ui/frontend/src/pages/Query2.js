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

const Query2 = () => {

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
			// options for data request to backend
			const options = {
				method: 'GET',
				url: `http://localhost:8080/query2/${stateUS[0]}`, 
				params: {sDate: startDate, eDate: endDate},
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
			console.log(stateUS)
			console.log(options)
		}, [stateUS, startDate, endDate]);
		
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
										dataKey={stateUS[0]}
										stroke="black" activeDot={{ r: 8 }}
										/>
								</LineChart>
							</ResponsiveContainer>
						</div>
				</div>
		);
};

export default Query2;

