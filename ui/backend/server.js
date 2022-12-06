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
const { query } = require('express');

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
        console.log("Query Successfully returned.")
        return result;
    }
    catch (error) {
        console.log("Error in Query: in connection or query");
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

app.get('/accCounts', (req,res) => {
    // accident counts
    sqlQuery = "SELECT COUNT(*) FROM ACCIDENT"

    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/locCounts', (req,res) => {
    // location counts
    sqlQuery = "SELECT COUNT(*) FROM LOCATION"

    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/airportCounts', (req,res) => {
    // accident count
    sqlQuery = "SELECT COUNT(*) FROM AIRPORTS"

    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/roadCounts', (req,res) => {
    // accident count
    sqlQuery = "SELECT COUNT(*) FROM ROAD"

    fetchData(sqlQuery).then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/envCounts', (req,res) => {
    // accident count
    sqlQuery = "SELECT COUNT(*) FROM ENVIRONMENT"

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

app.get('/dates', (req, res) => {
    // read in parameter specified in api call
    const d1 = req.query.sDate
    const d2 = req.query.eDate
    
    // read in the sql query
    // const sqlQuery = fs.readFileSync('./queries/Query1.txt').toString();
    sqlQuery = `SELECT UNIQUE TRUNC(DATE_TIME) AS ACC_DATE 

                FROM ACCIDENT
                
                WHERE Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD') 
                    and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')
                    
                ORDER BY ACC_DATE ASC`

    fetchData(sqlQuery).then(dbRes => {
        for (let i = 0; i < dbRes.rows.length; i++) {
            dbRes.rows[i]["ACC_DATE"] = moment(dbRes.rows[i]["ACC_DATE"]).format('YYYY-MM-DD');
        }
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/query1/:state', (req, res) => {
    // read in parameter specified in api call
    const st = req.params.state;
    const d1 = req.query.sDate
    const d2 = req.query.eDate
    const ma = req.query.mov_avg
    

    // read in the sql query
    // const sqlQuery = fs.readFileSync('./queries/Query1.txt').toString();
    sqlQuery = `SELECT TRUNC(Date_Time) as acc_date,
                       AVG(COUNT(*)) OVER 
                          (ORDER BY TRUNC(Date_Time) ROWS BETWEEN ${ma} PRECEDING AND CURRENT ROW) AS ${st}
                    
                FROM Accident, Road, Location

                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st and state = '${st}'
                and Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD') 
                and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')

                GROUP BY TRUNC(Date_Time)
                    
                ORDER BY acc_date ASC`
    fetchData(sqlQuery).then(dbRes => {
        // remove zulu time on datetimes returned from sql query
        for (let i = 0; i < dbRes.rows.length; i++) {
            dbRes.rows[i]["ACC_DATE"] = moment(dbRes.rows[i]["ACC_DATE"]).format('YYYY-MM-DD');
        }
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/query2/:state', (req, res) => {
    
    // const st = req.query.state
    const st = req.params.state
    const d1 = req.query.sDate
    const d2 = req.query.eDate

    sqlQuery = 
            `SELECT TRUNC(Date_Time) as acc_date,
                        AVG(COUNT(*)) OVER 
                        (ORDER BY TRUNC(Date_Time) ROWS BETWEEN 10 PRECEDING AND CURRENT ROW) AS ${st}
                                
                        FROM Accident, Road, Location
                        
                        where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                            and state = '${st}' 
                            and Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD') 
                            and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')
                        
                        GROUP BY TRUNC(Date_Time)
                
                        ORDER BY acc_date ASC`  

                // `SELECT TRUNC(Date_Time) as acc_date,
                //                 count(*) AS ${st}
                                
                //         FROM Accident, Road, Location
                        
                //         where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                //             and state = '${st}' 
                //             and Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD') 
                //             and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')
                        
                //         GROUP BY TRUNC(Date_Time)
                
                //         ORDER BY acc_date ASC`  

    fetchData(sqlQuery).then(dbRes => {
        // remove zulu time on datetimes returned from sql query
        for (let i = 0; i < dbRes.rows.length; i++) {
            dbRes.rows[i]["ACC_DATE"] = moment(dbRes.rows[i]["ACC_DATE"]).format('YYYY-MM-DD');
        }
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })  
})


app.get('/query3/:state', (req, res) => {

    const st = req.params.state
    const d1 = req.query.sDate
    const d2 = req.query.eDate

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
                and Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD')
                and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')

                GROUP BY TRUNC(Date_Time)
                    
                ORDER BY acc_date ASC)`
            
    fetchData(sqlQuery).then(dbRes => {
        for (let i = 0; i < dbRes.rows.length; i++) {
            dbRes.rows[i]["ACC_DATE"] = moment(dbRes.rows[i]["ACC_DATE"]).format('YYYY-MM-DD');
        }
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.get('/query4/:state', (req, res) => {

    const st = req.params.state
    const hr_grp = req.query.hr_grp
    const sev = req.query.sev
    
    const d1 = req.query.sDate
    const d2 = req.query.eDate

    sqlQuery = `SELECT FLOOR(EXTRACT(HOUR FROM Date_Time)/${hr_grp}) as TIME_BIN,
                        count(*) AS cnt
                        
                    FROM Accident, Road, Location

                    where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                    and Date_Time >= TO_DATE('${d1}', 'YYYY/MM/DD') 
                    and Date_Time < TO_DATE('${d2}', 'YYYY/MM/DD')
                    and state = '${st}'
                    and severity = ${sev}

                    GROUP BY FLOOR(EXTRACT(HOUR FROM Date_Time)/${hr_grp})

                    ORDER BY TIME_BIN`
            
    fetchData(sqlQuery).then(dbRes => {
        // for (let i = 0; i < dbRes.rows.length; i++) {
        //     dbRes.rows[i]["ACC_DATE"] = moment(dbRes.rows[i]["ACC_DATE"]).format('YYYY-MM-DD');
        // }
        res.send(dbRes.rows);
    })
    .catch(err => {
        res.send(err);
    })       
})

app.get('/query5/:state', (req, res) => {

    const st = req.params.state
    // const d1 = req.query.sDate
    // const d2 = req.query.eDate
    const yr = req.query.yr
    const w_cond = req.query.w_cond

    sqlQuery = `SELECT acc_date, 
                        cnt/(select count(*) from accident, environment, road, location
                                where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                                and fk_env_id = env_id and EXTRACT(YEAR FROM Date_Time) = '${yr}' 
                                and weather_condition = '${w_cond}' and state = '${st}' ) as norm_cnt

                    FROM

                    (SELECT Extract(Month from Date_Time) as acc_date,
                    weather_condition,
                    count(*) AS cnt
                    
                    FROM Accident, Road, Location, Environment

                    where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st 
                    and fk_env_id = env_id and EXTRACT(YEAR FROM Date_Time) = '${yr}' 
                    and weather_condition = '${w_cond}' and state = '${st}' 

                    GROUP BY Extract(Month from Date_Time),
                        weather_condition

                    ORDER BY acc_date, weather_condition ASC)`
            
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


