import React, { Component } from 'react';
import axios from 'axios';

const TempQuery = props => {
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        axios.get('http://localhost:8080/tempQuery?state1=NY')
        .then(response=>{
            if (response.status===200) {
                const fetchedData = response.data.rows;
                console.log('fetchedData', fetchedData.length);
                setData(fetchedData)
            }
            console.log("successfully retrieved data for temp query")
        })
        .catch(err => {
            console.log("error in getting data from temp query")
        })
    }, []);
    return (<div>
        TempQuery Component
        {
            data.length>0 && 
            data.map((item, index) =>
                <div key={index}> {item[0]} - {item[1]} </div>)
        }
    </div>)
}

export default TempQuery;
