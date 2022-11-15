import React from 'react';
import axios from 'axios';
import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

const url = 'http://localhost:8080/tempQuery?state1=NY';

const TempQuery = props => {
    const [data, setData] = React.useState({
        D: "",
        CNT: ""
      });
    React.useEffect(() => {
        axios.get(url)
        .then(response=>{
            if (response.status===200) {
                const fetchedData = response.data;
                console.log('fetchedData', fetchedData.length);
                setData(fetchedData)
            }
            console.log("successfully retrieved data for temp query")
        })
        .catch(err => {
            console.log("error in getting data from temp query")
            console.log(err)
        })
    }, []);
    
    return (
        <>
            <h1 className="text-heading">
                Plotting Temporary Query (Pretty much Query 4)
            </h1>
            <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data = {data} margin={{ right: 300 }}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="D" />
                    <YAxis></YAxis>
                    <Legend />
                    <Tooltip />
                    <Line
                        dataKey="CNT"
                        stroke="black" activeDot={{ r: 8 }}
                        />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default TempQuery;
