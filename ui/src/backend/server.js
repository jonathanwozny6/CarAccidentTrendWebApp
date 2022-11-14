// const { application } = require('express');
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const app = express();
const PORT = 8080;

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

app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World')
})

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

app.listen(PORT, 
    () => {
        console.log('listen to port %i', PORT);
})

