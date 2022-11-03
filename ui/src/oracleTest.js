// code for this taken and adapted from:
// https://oracle.github.io/node-oracledb/INSTALL.html#instosx
// and https://blogs.oracle.com/opal/post/avoiding-the-dpi-1047-error-with-nodejs-node-oracledb-5-on-macos-and-windows
// and https://github.com/CIS4301-Project-University-of-Florida/U.S.-Gun-Crime/issues/2
const oracledb = require('oracledb');

// user database information
const config = {
  user: 'awozny',
  password: 'Jtzfd5sLmpj0vBgcDBSf1rXJ',
  connectString: 'oracle.cise.ufl.edu/orcl'
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

// NOTE: For the connection to Windows, go to the following url and install Instant Basic for Windows:
// https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html
// initialize connection for Windows
if (process.platform === 'win32') {
  try {
    oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_8'});   // note the double backslashes
  } catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
  }
}

async function getEmployee (empId) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      "select * from Country where name = 'Canada'"
    )

    console.log(result.rows[0])
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    // close connection if connection was successful
    if (conn) {
      await conn.close()
    }
  }
}

getEmployee(101)

