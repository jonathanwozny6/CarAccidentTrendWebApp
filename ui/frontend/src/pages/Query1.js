import React, { Component } from 'react';
import axios from 'axios';

const Query1 = props => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        axios.get('http://localhost:8080/query1?state1=NY')
        .then(response=>{
            if (response.status===200) {
                const fetchedData = response.data.rows;
                console.log('fetchedData', fetchedData.length);
                setData(fetchedData)
            }
            console.log("successfully retrieved data for query 1")
        })
        .catch(err => {
            console.log("error in getting data from query1")
        })
    }, []);
    return (<div>
        Query1 Component
        {
            data.length>0 && 
            data.map((item, index) =>
                <div key={index}> {item[0]} - {item[1]} -  {item[2]} -  {item[3]} -  {item[4]} </div>)
        }
    </div>)
}

export default Query1;
