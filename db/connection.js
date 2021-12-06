// Import and require mysql2
const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'W1nch3$t3r22',
        database: 'employees'
    },
    console.log(`Connected to the employees database.`)
);


connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;