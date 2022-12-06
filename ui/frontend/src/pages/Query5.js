import React from 'react';
import {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import DateInput from '../components/DateInput'
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query5.css"
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

const Query5 = () => {

  // all data
  var myData = {}

  const [data, setData] = useState();

  var months = []

  const w_cond = ["Clear", "Snow", "Rain", "Not_Clear"]

  const [stateLeg, setStateLeg] = useState([]);

  // US State selected from Search bar dropdown
  const [stateUS, setStateUS] = useState("Enter a State")
  // let stateUS = ["Enter a State..."]

  // start and end date input
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

  // year to look at
  const [yr, setYr] = useState("")

  // button to plot line
  const [btnClickCnt, setBtnClickCnt] = useState(0);

  // function to pass into Search bar dropdown to get receive user input
  const childToParent = (childSelectedState) => {
	setStateUS(childSelectedState);

	// for (let i = 0; i < 12; i++) {
	// 	var dict = {}
	// 	dict['ACC_DATE'] = i+1
	// 	months.push(dict)
	// }

	console.log("ctP months", months)
	setData(months)
	console.log("ctp init data", data)
}

  // function to pass into Search bar dropdown hour granularity to receive user input
  const GetTimeGranularity = (event) => {
	const index = event.target.id
	setYr("20" + index)
	console.log("Year", yr)
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
	console.log("State 1:", stateUS)
  }


    useEffect(() => {
		for (let i = 0; i < 12; i++) {
			var dict = {}
			dict['ACC_DATE'] = i+1
			months.push(dict)
		}

		console.log("Use effect months", months)
		setData(months)
		console.log("Use effect Initialized data", data)
    }, [stateUS])


    useEffect(() => {
		console.log("btn click", btnClickCnt)
		for (let i = 0; i < w_cond.length; i++) {
		
			if (stateUS[0] != "Enter a State...") {
		
				// options for data request to backend
				const options = {
				method: 'GET',
				url: `http://localhost:8080/query5/${stateUS}`, 
				params: {yr: yr, w_cond: w_cond[i]},
				}

				if (btnClickCnt % 2 == 1 & btnClickCnt !== 0) {
					axios.request(options).then((response) => {
					
					if (response.status===200) {
						const fetchedData = response.data;
						console.log('fetchedData', fetchedData.length, fetchedData);
						myData = data
			
						for (let k = 0; k < myData.length; k++) {
						myData[k][`${w_cond[i]}`] = null
						}
			
						let j = 0;
						for (let k = 0; k < fetchedData.length; k++) {
						while (j < myData.length && fetchedData[k]["ACC_DATE"] != myData[j]["ACC_DATE"]) {
							j = j + 1
						}
						myData[j][`${w_cond[i]}`] = fetchedData[k][`NORM_CNT`]
						}
						
						setData(myData)
						
						console.log("My Data", myData)
					}
					
					}).catch((error) => {
					console.error(error)
					})
				}
      		}
		}
    //   console.log("stateUS length", stateUS.length)
      console.log("StateUS", stateUS)
      console.log("State Leg", stateLeg)
      
    }, [btnClickCnt]);


    // // https://codesandbox.io/s/81u1y?file=/src/App.js
    const getRandomColor = () => {
      return "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
      };
    
    return (
      <div className="page-container">
        <h1>Frequency of Accidents During Inclement Weather</h1> 
        <div className="display-container">
            <div className="input-pnl">
                <div className="input-location-section">
                    <h3 className='input-pnl-heading'>Location</h3>
                    <div className="dropdown">
						<SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={0}/>
                    </div>
                </div>
                {/* <DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
                <DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/> */}
                <div className="hour-granularity-selection-container"> 
										<h3 className="input-pnl-heading">Year</h3>
										<div className="hour-granularity-selection">
											<div className="hour-granularity-input-container">
											<div className="hour-granularity-radio">
													<p>16</p>
													<input type="radio" id="16" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>17</p>
													<input type="radio" id="17" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>18</p>
													<input type="radio" id="18" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>19</p>
													<input type="radio" id="19" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>20</p>
													<input type="radio" id="20" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
												<div className="hour-granularity-radio">
													<p>21</p>
													<input type="radio" id="21" name="time-granularity" onChange={GetTimeGranularity}/>
												</div>
											</div>
										</div>
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
                  <XAxis dataKey="ACC_DATE" Label='Time'/>
                  <YAxis
											orientation="left"
											>
											<Label value='Frequency' offset={2} angle="-90" />
										</YAxis>
                  <Legend />
                  <Tooltip />
					<Line
						dataKey="Clear"
						stroke={"#1f77b4"} 
						activeDot={{ r: 8 }}
						connectNulls
					/>
					<Line
						dataKey={"Rain"}
						stroke={"#ff7f0e"} 
						activeDot={{ r: 8 }}
						connectNulls
					/>
					<Line
						dataKey={"Snow"}
						stroke={"#2ca02c"} 
						activeDot={{ r: 8 }}
						connectNulls
					/>
					<Line
						dataKey={"Not_Clear"}
						stroke={"#8884d8"} 
						activeDot={{ r: 8 }}
						connectNulls
					/>
                </LineChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    );
};

export default Query5;