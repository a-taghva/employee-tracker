const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: '',
    database: 'employee_db'
});


class Query {
    startQuery() {
        connection.connect(err => {
            if (err) throw err;

            console.log(`Connected as id ${connection.threadId}`);
            this.prompt();
        });
    };

    checkAction(action) {
        switch (action) {
            case 'View All Departments':
                this.viewDepartments();
                break;
            case 'View All Roles':
                this.viewRoles();
                break;
            case 'View All Employees':
                this.viewEmployees();
                break;
            case 'Add a Department':
                this.addDepartment();
                break;
            case 'Add a Role':
                this.addRole();
                break;
            case 'Add an Employee':
                this.addEmployee();
                break;
            case 'Add Employee Role:':
                this.addEmployeeRole();
                break;
            case 'Update Employee Role':
                this.updateEmployeeRole();
                break;
            case 'Remove Role':
                this.removeRole();
                break;
            case 'Quit':
                this.quit();
                break;
        };
    };

    prompt() {
        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View All Departments',
                    'View All Roles',
                    'View All Employees',
                    'Add a Department',
                    'Add a Role',
                    'Add an Employee',
                    'Add Employee Role',
                    'Update Employee Role',
                    'Remove Role',
                    'Quit',
                ]
            }
        ])
        .then(({ action }) => {
            this.checkAction(action);
        });
    };

    viewDepartments() {
        const query = connection.query(
            'SELECT * FROM department',
            (err, res) => {
                if (err) throw err;

                console.log(res);
            }
        );

        this.prompt();
    };
};

new Query().startQuery();
