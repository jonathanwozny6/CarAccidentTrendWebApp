import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput';
import MovingAverage from '../components/MovingAverage';
import dataStates from "../ParamData/States.json";
import "./PagesCSS/Query1.css";
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

const Query1 = () => {

	// number of locations on the line plot
	//const [numLocs, setNumLocs] = useState(1);

	// US State selected from Search bar dropdown
	const [stateUS, setStateUS] = useState([""]);

    const [movAvg, setMovAvg] = useState("");

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

    // function to pass into end date input to receive user input
	const getMovAvg = (movAvgInput) => {
        setMovAvg(movAvgInput);
}

	// function to add line when "Add Line" button is clicked
	const addLineClicked = () => {
			let oldStateUS = stateUS
			setStateUS(oldStateUS.concat("Enter a State..."));
	} 

	const [data, setData] = React.useState(); //{D: "", AVG_FREQUENCY: ""}

	useEffect(() => {
		// options for data request to backend
		const options = {
			method: 'GET',
			url: 'http://localhost:8080/query1',
			params: {state: stateUS[0], movingAverage: movAvg, sDate: startDate, eDate: endDate},
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
	}, [stateUS, movAvg, startDate, endDate]);
	
	return (
		<div className="page-container">
		<h1>Average Accident Frequency</h1>
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
								<button className="add-curve-btn" onClick={addLineClicked}>
										Add Line +
								</button>
						</div>
						<DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
						<DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/>
                        <div className="moving-average">
                        <h3 className='input-pnl-heading-2'>Moving Average Period</h3>
                        {/* {
                            movAvg.map((movingAverage, index)=> {
                                    return <MovingAverage placeholder={"20"} childToParent={childToParent} index={index}/>
                            })
                        } */}
                        <input></input>
                        </div>
                        
				</div>
				<div className="lineplot">
					<h1 className="text-heading">
					</h1>
					<ResponsiveContainer width="100%" aspect={2} >
						<LineChart data = {data} xScale={scale.scaleTime} options={{ maintainAspectRatio: false }} margin={{ right: 300 }}>
							<CartesianGrid strokeDasharray="3 3"/>
							<XAxis dataKey="ACC_DATE" numberOfTicks={6} />
							<YAxis
								yAxisId="left-axis"
								orientation="left"
								tickCount={1}
								domain={[0, 1]}
								>
									<Label value='Average Frequency' offset={2} angle="-90" />
								</YAxis>
							<Legend />
							<Tooltip />
							<Line
								name="Average Frequency"
								dataKey="MOVING_AVERAGE"
								stroke="black" activeDot={{ r: 8 }}
								/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
				
		</div>
	);
};

export default Query1;
