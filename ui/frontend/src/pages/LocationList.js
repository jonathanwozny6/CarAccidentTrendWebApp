// This was created as a template for the queries

import React, { Component } from 'react';
import axios from 'axios';

const Location = props => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        axios.get('http://localhost:8080/locations')
        .then(response=>{
            if (response.status===200) {
                const fetchedData = response.data.rows;
                console.log('fetchedData', fetchedData.length);
                setData(fetchedData)
            }
            console.log("successfully got data")
        })
        .catch(err => {
            console.log("error in getting data from locations")
        })
    }, []);
    return (<div>
        Location Component
        {
            data.length>0 && 
            data.map((item, index) =>
                <div key={index}> {item[0]} - {item[1]} -  {item[2]} </div>)
        }
    </div>)
}

export default Location;

