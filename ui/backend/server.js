const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
var moment = require('moment');

const app = express();
const PORT = 8080;

// for making multi-line SQL queries
var SQL = require('sql-template-strings')

// reading from files (for sql queries)
const fs = require('fs');

// user database information
const config = {
    user: 'JWOZNY',
    password: 'FHUoypE7R3vNnPFQ94SfUVir',
    connectString:'oracle.cise.ufl.edu/orcl'
  }

// NOTE: For the connection for Mac, go to the following url and install Instant Basic for Mac: 
// https://www.oracle.com/database/technologies/instant-client/macos-intel-x86-downloads.html#ic_osx_inst
// initialize connection for Mac
if (process.platform === 'darwin') {
    try {
      oracledb.initOracleClient({libDir: process.env.HOME + '/Downloads/instantclient_19_8'});
    } catch (err) {
      console.error('Whoops!');
      console.error(err);
      process.exit(1);
    }
  }

app.use(cors())

// retrieve data from oracle db
async function fetchData(sqlQuery) {
    let conn
    try {
        conn = await oracledb.getConnection(config);

        const result = await conn.execute(sqlQuery, [], {outFormat: oracledb.OUT_FORMAT_OBJECT})
        console.log("Query2: Successfully returned.")
        return result;
    }
    catch (error) {
        console.log("Error in Temp Query: in connection or query");
        console.log(error);
        console.log(sqlQuery);
        return error;
    }
}

app.get('/', (req, res) => {
    res.send('Hello World !!!')
})

// this call is a template for making the queries
app.get('/locations', (req, res) => {
    sqlQuery = "SELECT * FROM LOCATION where STATE = 'AZ'"

    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/tempQuery', (req, res) => {
    // read in parameter specified in api call
    var st = req.query.state1;
    
    // read in the sql query
    // const sqlQuery = fs.readFileSync('./queries/Query1.txt').toString();
        sqlQuery = `SELECT EXTRACT(DAY FROM Date_Time) as d, 
                    count(*) AS cnt
                    
            FROM Accident, Road, Location
            
            where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('2017/01/30', 'YYYY/MM/DD')
                and state = '${st}'
            
            GROUP BY EXTRACT(DAY FROM Date_Time)
            
            ORDER BY d ASC`
    
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/query1', (req, res) => {
    // read in parameter specified in api call
    var st = req.query.state1;

    // read in the sql query
    // const sqlQuery = fs.readFileSync('./queries/Query1.txt').toString();
    sqlQuery = `SELECT TRUNC(Date_Time) as acc_date,
                       count(*) AS cnt,
                       AVG(COUNT(*)) OVER 
                          (ORDER BY TRUNC(Date_Time) ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS moving_average
                    
                FROM Accident, Road, Location

                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st and state = '${st}'
                and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('2017/01/30', 'YYYY/MM/DD')

                GROUP BY TRUNC(Date_Time)
                    
                ORDER BY acc_date ASC`
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/query2', (req, res) => {

    const st = req.query.state

    sqlQuery = `SELECT EXTRACT(DAY FROM Date_Time) as d, 
                       count(*) AS cnt
            
                FROM Accident, Road, Location
                
                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                    and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                    and Date_Time < TO_DATE('2017/01/30', 'YYYY/MM/DD')
                    and state = '${st}'
                
                GROUP BY EXTRACT(DAY FROM Date_Time)
                
                ORDER BY d ASC`
    
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.get('/query3', (req, res) => {

    const st = req.query.state

    sqlQuery = `SELECT acc_date, 
                AVG_SEV/(SELECT MAX(severity) FROM Accident) norm_avg_sev, 
                AVG_VIS/(SELECT MAX(visibility) FROM Environment) as norm_avg_vis 

                FROM
                (SELECT TRUNC(Date_Time) as acc_date,
                    AVG(Severity) as avg_sev,
                    AVG(Visibility) as avg_vis
                    
                FROM Accident, Road, Location, Environment

                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                and env_id = fk_env_id and state = '${st}' 
                and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('2017/01/30', 'YYYY/MM/DD')

                GROUP BY TRUNC(Date_Time)
                    
                ORDER BY acc_date ASC)`
            
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.get('/query4', (req, res) => {

    const st = req.query.state

    sqlQuery = `SELECT TRUNC(Date_Time) as acc_date, 
                       count(*) AS cnt
                    
                FROM Accident, Road, Location

                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('2018/01/01', 'YYYY/MM/DD')
                and state = '${st}' 

                GROUP BY TRUNC(Date_Time)

                ORDER BY acc_date ASC;
`
            
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.get('/query5', (req, res) => {

    const st = req.query.state

    // THIS IS QUERY 4 -> NEED TO CORRECT QUERY 5 AND CHANGE

    sqlQuery = `SELECT TRUNC(Date_Time) as acc_date, 
                       count(*) AS cnt
                    
                FROM Accident, Road, Location

                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                and Date_Time >= TO_DATE('2017/01/01', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('2018/01/01', 'YYYY/MM/DD')
                and state = '${st}' 

                GROUP BY TRUNC(Date_Time)

                ORDER BY acc_date ASC;
`
            
    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.listen(PORT, function(err) {
    if (err) console.log(err);

    console.log('listen to port %i', PORT);
})


