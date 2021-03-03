const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'root1234',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw err;

    console.log(`Connected as id ${connection.threadId}`);
});
