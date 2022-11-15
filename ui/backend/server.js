const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

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

app.get('/', (req, res) => {
    res.send('Hello World !!!')
})

// this call is a template for making the queries
app.get('/locations', (req, res) => {
    async function fetchDataCustomers() {
        let conn
        try {
            conn = await oracledb.getConnection(config);

            const result = await conn.execute("SELECT * FROM LOCATION where STATE = 'AZ'")
            return result;
        }
        catch (error) {
            console.log("Error in connection or query");
            return error;
        }
    }
    fetchDataCustomers().then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/query1', (req, res) => {
    async function fetchDataQuery1() {
       // read in parameter specified in api call
       var st = req.query.state1;
       
        // read in the sql query
        // const sqlQuery = fs.readFileSync('./queries/Query1.txt').toString();
         sqlQuery = `SELECT EXTRACT(YEAR FROM Date_Time) AS Yr,
                        EXTRACT(MONTH FROM Date_Time) AS Mo, 
                        EXTRACT(DAY FROM Date_Time) AS D,
                        count(*) AS cnt,
                        AVG(COUNT(*)) OVER 
                        (ORDER BY EXTRACT(YEAR FROM Date_Time) ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS moving_average
        
                        FROM Accident, Road, Location
 
                        where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st and state = '${st}'
                        
                        GROUP BY EXTRACT(YEAR FROM Date_Time),
                                EXTRACT(MONTH FROM Date_Time), 
                                EXTRACT(DAY FROM Date_Time)
                                
                        ORDER BY YR, Mo, D ASC`

        let conn
        try {
            conn = await oracledb.getConnection(config);

            const result = await conn.execute(sqlQuery)
            console.log("Query 1: Successfully returned.")
            return result;
        }
        catch (error) {
            console.log("Error in Query1: in connection or query");
            console.log(error);
            console.log(sqlQuery);
            return error;
        }
    }
    fetchDataQuery1().then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/tempQuery', (req, res) => {
    async function fetchDataTempQuery() {
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

        let conn
        try {
            conn = await oracledb.getConnection(config);

            const result = await conn.execute(sqlQuery)
            console.log("Temp Query: Successfully returned.")
            return result;
        }
        catch (error) {
            console.log("Error in Temp Query: in connection or query");
            console.log(error);
            console.log(sqlQuery);
            return error;
        }
    }
    fetchDataTempQuery().then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})


app.listen(PORT, function(err) {
    if (err) console.log(err);

    console.log('listen to port %i', PORT);
})
