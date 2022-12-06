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

  const [stateLeg, setStateLeg] = useState([]);

  // number of locations on the line plot
  const [numLocs, setNumLocs] = useState(1);

  // US State selected from Search bar dropdown
  const [stateUS, setStateUS] = useState(["Enter a State"])
  // let stateUS = ["Enter a State..."]

  // start and end date input
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // button to plot line
  const [btnClickCnt, setBtnClickCnt] = useState(0);

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

  // function to plot line when plot button is clicked
  const PlotLine = () => {
      if (btnClickCnt === Number.MAX_SAFE_INTEGER){
          setBtnClickCnt(1)
      }
      else
          setBtnClickCnt(btnClickCnt+1)
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
          url: `http://localhost:8080/query5/${stateUS[i]}`, 
          params: {sDate: startDate, eDate: endDate},
        }

        axios.request(options).then((response) => {
          
          if (response.status===200) {
            const fetchedData = response.data;
            console.log('fetchedData', fetchedData.length, fetchedData);
            myData = data
            console.log(myData)

            for (let k = 0; k < myData.length; k++) {
              myData[k][`${stateUS[i]}`] = null
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
      
    }, [stateUS]);


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
                        {
                          stateUS.map((state, index) => {
                              return <SearchBar placeholder={"Enter a State..."} data={dataStates} childToParent={childToParent} index={index}/>
                          })
                        }
                    </div>
                </div>
                <DateInput header="Start Date" placeholder="YYYY/MM/DD" childToParent={getStartDate}/>
                <DateInput header="End Date" placeholder="YYYY/MM/DD" childToParent={getEndDate}/>
                <div className="center">
                  <button id="plot-btn" onClick={PlotLine}><h3>P L O T !</h3></button>
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

export default Query5;