const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

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
        connection.then(conn => {
            console.log(`Connected as ${conn.threadId}`);

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
                this.promptDepartment();
                break;
            case 'Add a Role':
                this.promptRole();
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

    showTable(tableName) {
        connection
        .then(conn => conn.query(`SELECT * FROM ${tableName}`))
        .then(([ rows ]) => {
            console.table(rows);
            this.prompt();
        });
    };

    viewDepartments() {
        this.showTable('department');
    };

    viewRoles() {
        this.showTable('role');
    };

    viewEmployees() {
        this.showTable('employee');
    };

    promptDepartment() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please enter department\'s name? (required)',
                validate: name => {
                    if (name) return true;

                    console.log('\nPlease enter department\'s name');
                    return true;
                }
            }
        ])
        .then(({ name }) => {
            this.addDepartment(name);
        });
    };

    addDepartment(name) {
        connection
        .then(conn => conn.query(`INSERT INTO department(name) VALUES ('${name}')`));
    };

    promptRole() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Please enter role title. (required)',
                validate: title => {
                    if (title) return true;

                    console.log('please enter a title');
                    return false;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please enter role\'s salary. (required)',
                validate: salary => {
                    if (!salary || isNaN(salary)) {
                        console.log('please enter a valid salary');
                        return false;
                    };

                    return true;
                }
            },
            {
                type: 'input',
                name: 'dep_id',
                message: 'Please enter the departmeent\'s id associated with the role',
                vlaidate: dep_id => {
                    if (!dep_id || isNaN(dep_id)) {
                        console.log('please enter a valid department id');
                        return false;
                    };

                    return true;
                }
            }
        ])
        .then(({ title, salary, dep_id }) => this.addRole(title, salary, dep_id));
    };

    addRole(title, salary, departmentId) {
        connection
        .then(conn => conn.query(`INSERT INTO role(title, salary, department_id) VALUES('${title}', '${+salary}', '${departmentId}')`))
        .then(() => this.showTable('role'))
        .catch(err => {
            console.log(err.sqlMessage);
            console.log('Please Try Again!');
            this.promptRole();
        });
    };
};

new Query().startQuery();
