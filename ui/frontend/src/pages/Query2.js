import React from 'react';
import {useState} from 'react';
import SearchBar from '../components/SearchBar';
import dataStates from "../ParamData/States.json"
import "./PagesCSS/Query2.css"
import TempQuery from "./TempQuery"

const Query2 = () => {

		// number of locations on the line plot
		const [numLocs, setNumLocs] = useState(1);

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState("")

		// start input month, day, year
		const [startMonth, 	setStartMonth] = useState("")
		const [startDay,	 	setStartDay] = useState("")
		const [startYear, 	setStartYear] = useState("")

		// function to pass into Search bar dropdown to get receive user input
		const childToParent = (childSelectedState) => {
				setStateUS(childSelectedState);
		}

		const restrictEntry = (eventInput) => {
				let result = '';
				for (let i = 0; i < eventInput.length - 1; i++){
						result = result + eventInput[i];
				}

				return result;
		}


		const ReceiveDate = (event) => {

			const currInput = event.target.value;
			let currDate = '';
			let mostRecSlash = -1
			const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			let currMonth;

			// count the number of slashes
			for (let i = 0; i < event.target.value.length; i++) {
					if (event.target.value[i] === '/'){
								mostRecSlash = i;
					}
			}

			const startYearInd = 0;
			const startMonthInd = 5;
			const startDayInd = 8;

			if (mostRecSlash === startDayInd-1){
				currMonth = currInput[startMonthInd] + currInput[startMonthInd+1];
			}

			switch(mostRecSlash){

				case -1:
					console.log("Pos -1")
					break;
			
				case 4:
						console.log("Pos 4")

						// if the current input length is greater than 5
						if (currInput.length > 5){
								
								// the first value must be a 0 or a 1
								if (event.target.value[startMonthInd] !== '0' && event.target.value[startMonthInd] !== '1'){
										event.target.value = restrictEntry(currInput);
								}
						
								// if the first value is 0, only let the next month value be natural number between 1 and 9 inclusive
								if (event.target.value[startMonthInd] === '0'){
										// if a '/' is put prematurely
										if (event.target.value[startMonthInd+1] === '/'){
											event.target.value = restrictEntry(event.target.value);
										}
										// if second month character is not a number
										else if (event.target.value.charCodeAt(startMonthInd+1) < 49 || event.target.value.charCodeAt(startMonthInd+1) > 57) {
												event.target.value = restrictEntry(event.target.value)
										}
								} 

								// if the first value is 1
								else if (event.target.value[startMonthInd] === '1'){
										// the second month value can only be 0, 1, 2
										if (event.target.value.length > startMonthInd + 1){
												if (event.target.value[startMonthInd+1] !== '0' && event.target.value[startMonthInd+1] !== '1' && event.target.value[startMonthInd+1] !== '2') {
														event.target.value = restrictEntry(currInput);
												}
										}
								}						
								// the month field can only take up 2 position
								if (event.target.value.length > startMonthInd+2){
										event.target.value = restrictEntry(event.target.value);
								}
						}
						
						break;
				
				case 7:
						console.log("Pos 2")

						// for the given month, find the first digit of the last day (e.g. find '3' for '31')
						const maxDay = daysPerMonth[parseInt(currMonth)-1]
						const maxTensPlace = Math.floor(maxDay / 10);
						console.log(maxTensPlace)
				
				
						// the first digit in the day field must be between 0 and the max tens day 
						// (e.g. last day in august is the 31, the day value can only be between 0 and 3 inclusive)
						if (currInput.charCodeAt(startDayInd) < 48 || currInput.charCodeAt(startDayInd) > 48 + maxTensPlace) {
								event.target.value = restrictEntry(currInput);
						}
				
						// only allow a valid number between 0 and 1 inclusive for second day place
						if (currInput.charCodeAt(startDayInd+1) < 48 || currInput.charCodeAt(startDayInd+1) > 57) {
								event.target.value = restrictEntry(currInput);
						}
				
						// if a second digit is put in for the day, if the tens place is at the max value, limit to max day
						// cannot have value of '00' for day
						if (currInput.length === startDayInd+2){
								let currDay = parseInt(currInput[startDayInd] + currInput[startDayInd+1])
								if ( currDay > maxDay || currDay <= 0){
										event.target.value = restrictEntry(currInput);
								}
						}
				
						// restrict month entry to 2 digits
						if (currInput.length > startDayInd+2){
								event.target.value = restrictEntry(currInput);
						}
				
						break;
				
				default:
						console.log("Default Pos")
						event.target.value = restrictEntry(currInput);
						break;
				}

		}

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
										<input placeholder="YYYY/MM/DD" onChange={ReceiveDate}/>
								</div>
								<div className="date-input-section">
										<h3 className="input-pnl-heading">End Date</h3>
										<input placeholder="YYYY/MM/DD"/>
								</div>
						</div>
						<div className="lineplot">
							INSERT PLOT HERE
						</div>
				</div>
		);
};

export default Query2;







// 	switch(numSlashes){

		// 		case 0:
		// 			// make sure first position is a 1 or 0
		// 			if (currDate[0] !== '0' && currDate[0] !== '1'){
		// 					event.target.value = '';
		// 			}

		// 			// if the first value is 0, only let the next month value be natural number between 1 and 9 inclusive
		// 			if (event.target.value[0] === '0'){
		// 					// if a '/' is put prematurely
		// 					if (event.target.value[1] === '/'){
		// 						event.target.value = event.target.value[0];
		// 					}
		// 					// if second month character is not a number
		// 					else if (event.target.value.charCodeAt(1) < 49 || event.target.value.charCodeAt(1) > 57) {
		// 							event.target.value = event.target.value[0]
		// 					}
		// 		 	} 
		// 			// if the first value is 1
		// 			else if (event.target.value[0] === '1'){
		// 					// the second month value can only be 0, 1, 2
		// 					if (event.target.value[1] !== '0' && event.target.value[1] !== '1' && event.target.value[1] !== '2') {
		// 							event.target.value = event.target.value[0];
		// 					}
		// 			}
					
		// 			break;


		// 		case 1:
		// 			console.log("Here")


		// 			break;
			
		// 	}
		// 	console.log(event.target.value)

// 	switch(numSlashes){

		// 		case 0:
		// 			// make sure first position is a 1 or 0
		// 			if (currDate[0] !== '0' && currDate[0] !== '1'){
		// 					event.target.value = '';
		// 			}

		// 			// if the first value is 0, only let the next month value be natural number between 1 and 9 inclusive
		// 			if (event.target.value[0] === '0'){
		// 					// if a '/' is put prematurely
		// 					if (event.target.value[1] === '/'){
		// 						event.target.value = event.target.value[0];
		// 					}
		// 					// if second month character is not a number
		// 					else if (event.target.value.charCodeAt(1) < 49 || event.target.value.charCodeAt(1) > 57) {
		// 							event.target.value = event.target.value[0]
		// 					}
		// 		 	} 
		// 			// if the first value is 1
		// 			else if (event.target.value[0] === '1'){
		// 					// the second month value can only be 0, 1, 2
		// 					if (event.target.value[1] !== '0' && event.target.value[1] !== '1' && event.target.value[1] !== '2') {
		// 							event.target.value = event.target.value[0];
		// 					}
		// 			}
					
		// 			break;


		// 		case 1:
		// 			console.log("Here")


		// 			break;
			
		// 	}
		// 	console.log(event.target.value)