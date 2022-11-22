import React from 'react';
import {useState} from 'react';
import SearchBar from '../components/SearchBar';
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query2.css"
// import TempQuery from "./TempQuery"
import axios from "axios";

const Query2 = () => {

		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState("")

		const childToParent = (childSelectedState) => {
				setStateUS(childSelectedState);
		}

		// options for data request to backend
		const options = {
            method: 'GET',
            url: 'http://localhost:8080/query2Input',
            params: {state: stateUS},
        }

		axios.request(options).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.error(error)
        })
        console.log(stateUS)

		return (
			<div className="page-container">
						<div className="input-pnl">
								<div className="input-location-section">
										<h3 className='input-pnl-heading'>Location</h3>
										<div className="dropdown">
												<SearchBar placeholder="Enter a State..." data={dataStates} childToParent={childToParent}/>
										</div>
										<button className="add-curve-btn">
												Add Curve +
										</button>
								</div>
								<div className="date-input-section">
										<h3 className="input-pnl-heading">Start Date</h3>
										<input placeholder="MM/DD/YYYY"/>
								</div>
								<div className="date-input-section">
										<h3 className="input-pnl-heading">End Date</h3>
										<input placeholder="MM/DD/YYYY"/>
								</div>
						</div>
						<div className="lineplot">
							INSERT PLOT HERE
						</div>
				</div>
		);
};

export default Query2;