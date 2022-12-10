import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query1.css"
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
// Math.import()

const Query1 = () => {

    // all data
    var myData = {}

    const [data, setData] = useState();

    // counts the number of times the button is clicked
    const [btnClickCnt, setBtnClickCnt] = useState(0);

    const [stateLeg, setStateLeg] = useState([]);

    // number of locations on the line plot
    const [numLocs, setNumLocs] = useState(1);

    // moving average window size
    const [maWindow, setMAWindow] = useState(1);
    
    // maximum moving average window
    const maxMA = 100;

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

    // parses the moving average input
    const MovingAvgInput = (event) => {
        const dummy = event.target.value;
        if (parseInt(dummy) > maxMA)
            event.target.value = dummy.slice(0, -1);
        else if (parseInt(dummy) < 1)
            event.target.value = dummy.slice(0, -1);

        setMAWindow(event.target.value);
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
        console.log("button click", btnClickCnt)
        if (stateUS[0] != "Enter a State...") {

        
            const i = stateUS.slice(0,-1).length - 1

            // options for data request to backend
            const options = {
                method: 'GET',
                url: `http://localhost:8080/query1/${stateUS[i]}`, 
                params: {sDate: startDate, eDate: endDate, mov_avg: maWindow},
            }

            if (btnClickCnt % 2 === 1) {

                axios.request(options).then((response) => {
                    
                    if (response.status===200) {
                        const fetchedData = response.data;
                        console.log('fetchedData', fetchedData.length, fetchedData);
                        myData = data
                        console.log("Data", data)

                        for (let k = 0; k < myData.length; k++) {
                            myData[k][`${stateUS[i]}`] = null
                        }

                        let j = 0;
                        for (let k = 0; k < fetchedData.length; k++) {
                            while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
                                j = j + 1
                            }
                            myData[j][`${stateUS[i]}`] = Math.round(fetchedData[k][`${stateUS[i]}`])
                        }
                        
                        setData(myData)
                        
                        console.log("My Data", myData)
                    }
                    
                }).catch((error) => {
                    console.error(error)
                })
            }
        }
        console.log("stateUS length", stateUS.length)
        console.log("StateUS", stateUS)
        console.log("State Leg", stateLeg)
        
    }, [btnClickCnt]);


    // // https://codesandbox.io/s/81u1y?file=/src/App.js
    const getRandomColor = () => {
        return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    };
    
    return (
        <div className="page-container">
            <h1>Average Accident Frequency by Region and Time Period</h1> 
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
                        <h3 className="input-pnl-heading" id="ma-heading">Moving Average Window</h3>
                        <div className="moving-average-section">
                            <p></p> <p></p>
                            <p>1</p> 
                            <p>&le;</p>
                            <input id="ma-window" onChange={MovingAvgInput}/>
                            <p> &le;</p> <p>{maxMA}</p>
                            <p></p> <p></p>
                        </div>
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
                            <XAxis dataKey="ACC_DATE" numberOfTicks={6} name='Time'>
									<Label offset={2}/>
                            </XAxis>
                            <YAxis
								// yAxisId="left-axis"
								orientation="left"
								>
									<Label value='Frequency' offset={2} angle="-90" />
								</YAxis>
                            <Legend />
                            <Tooltip />
                            {
                                stateUS.slice(0,-1).map(st => {
                                    return <Line
                                    dataKey={`${st}`}
                                    stroke={getRandomColor()} activeDot={{ r: 8 }}
                                    connectNulls
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

export default Query1;

