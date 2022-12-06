import React from 'react';
import "./PagesCSS/index.css"
import axios from "axios";
import { FaAppStore } from 'react-icons/fa';



const Home = () => {
return (
	<div className='content'>
		<h1>Car Accident Trends from 2016 to 2021</h1>
		<div className='paragraph'>
			<p className='subtitle'>A project by Nishant Agrawal, Nicholas Salazar, Alexander Wozny, and Jonathan Wozny </p>
			<p className='introduction'>&emsp;&emsp;This application presents accident statistics in 5 customizable queries.  Use the navigation bar above to view each of the following queries:
				<ol>
					<li>Average Accident Frequency by Region and Time Period</li>
					<li>Average Accident Frequency by Street Type and Severity</li>
					<li>Accident Severity versus Visibility </li>
					<li>Accident Frequency During the Day</li>
					<li>Frequency of Accidents During Inclement Weather</li>
				</ol>
			</p>
			<p className='introduction'>&emsp;&emsp;These queries pull data from the Accidents Dataset through the Oracle Database.  The dataset contains</p>
			<p>X</p>
			<p className='introduction'>
				entries, with each entry containing specific information about an accident such as its location,
				its date, the time it occurred, the weather, the type of road, the severity, and other data.
			</p>
		</div>
	</div>
);
};

export default Home;
