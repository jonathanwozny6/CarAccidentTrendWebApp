import React from 'react';
import {useState} from 'react';
import SearchBar from '../components/SearchBar';
import dataStates from "../Data.json";

const Query2 = () => {

		// US State selected from Search bar dropdown
		const [stateUS, setStateUS] = useState("")

		const childToParent = (childSelectedState) => {
				setStateUS(childSelectedState);
		}

		return (
			<div>
				<SearchBar placeholder="Enter a State..." data={dataStates} childToParent={childToParent}/>
			</div>
		);
};

export default Query2;
