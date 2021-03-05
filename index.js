const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'root1234',
    database: 'employee_db'
});


class Query {
    startQuery() {
        console.clear();
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
                this.promptEmployee();
                break;
            case 'Add Employee Role:':
                this.addEmployeeRole();
                break;
            case 'Update Employee Role':
                this.updateEmployeeRole();
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

    promptEmployee() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'fname',
                message: 'What is employee\'s first name? (required)',
                validate: fname => {
                    if (fname) return true;

                    console.log('Please enter employee\'s first name');
                    return false;
                }
            },
            {
                type: 'input',
                name: 'lname',
                message: 'What is employee\'s last name? (required)',
                validate: fname => {
                    if (fname) return true;

                    console.log('Please enter employee\'s last name');
                    return false;
                }
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'What is employee\'s role id? (required)',
                validate: roleId => {
                    if (!roleId || isNaN(roleId)) {
                        console.log('\nPlese enter a valid role id');
                        return false;
                    };

                    return true;
                }
            },
            {
                type: 'input',
                name: 'managerId',
                message: 'What is employee\'s manager id?',
            }
        ])
        .then(({ fname, lname, roleId, managerId }) => {
            this.addEmployee(fname, lname, roleId, managerId)
        });
    };

    addEmployee(fname, lname, roleId, managerId) {
        if (managerId) {
            connection
            .then(conn => conn.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${fname}', '${lname}', '${roleId}', '${managerId}')`));
        } else {
            connection
            .then(conn => conn.query(`INSERT INTO employee(first_name, last_name, role_id) VALUES('${fname}', '${lname}', '${roleId}')`));
        };
    };

    async getEmployeeNames() {
        connection
        .then(conn => conn.query("SELECT CONCAT(first_name, ' ', last_name) AS 'employeeName' FROM employee"))
        .then(([ names ]) => {
            const namesArr = [];
            for (const name of names) {
                namesArr.push(name.employeeName);
            };
            console.log(namesArr);
            return namesArr;
        });
    };

    async getRoles() {
        connection
        .then(conn => conn.query("SELECT title FROM role"))
        .then(([ roles ]) => {
            const rolesArr = [];
            for (const role of roles) {
                rolesArr.push(role.title);
            };

            return rolesArr;
        });
    };

    updateEmployeeRole() {
        this.getEmployeeNames().then(names => console.log(names));
        // console.log(names, roles);

        // this.updateEmployeePrompt(names, roles);
    };

    updateEmployeePrompt(names, roles) {
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Choose employee you want to update:',
                choices: names
            },
            {
                type: 'list',
                name: 'role',
                message: 'Choose role you want to update to: ',
                choices: roles
            }
        ])
        .then(data => console.log(data));
    };

    quit() {
        console.log('Thank You!');
        connection.then(conn => conn.destroy());
    };
};

new Query().startQuery();
