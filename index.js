const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const chalk = require('chalk');
const cTable = require('console.table');

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

            console.log(chalk.blue(`
                                     ___                                           
                                    (   )                                          
    .--.    ___ .-. .-.      .-..    | |    .--.    ___  ___    .--.     .--.      
   /    \\  (   )   '   \\    /    \\   | |   /    \\  (   )(   )  /    \\   /    \\     
  |  .-. ;  |  .-.  .-. ;  ' .-,  ;  | |  |  .-. ;  | |  | |  |  .-. ; |  .-. ;    
  |  | | |  | |  | |  | |  | |  . |  | |  | |  | |  | |  | |  |  | | | |  | | |    
  |  |/  |  | |  | |  | |  | |  | |  | |  | |  | |  | '  | |  |  |/  | |  |/  |    
  |  ' _.'  | |  | |  | |  | |  | |  | |  | |  | |  '  \`-' |  |  ' _.' |  ' _.'    
  |  .'.-.  | |  | |  | |  | |  ' |  | |  | '  | |   \`.__. |  |  .'.-. |  .'.-.    
  '  \`-' /  | |  | |  | |  | \`-'  '  | |  '  \`-' /   ___ | |  '  \`-' / '  \`-' /    
   \`.__.'  (___)(___)(___) | \\__.'  (___)  \`.__.'   (   )' |   \`.__.'   \`.__.'     
   ___                     | |              ___      ; \`-' '                  ___  
  (   )                   (___)            (   )      .__.'                  (   ) 
   | |_      ___ .-.      .---.    .--.     | |   ___     .--.    ___ .-.     | |  
  (   __)   (   )   \\    / .-, \\  /    \\    | |  (   )   /    \\  (   )   \\    | |  
   | |       | ' .-. ;  (__) ; | |  .-. ;   | |  ' /    |  .-. ;  | ' .-. ;   | |  
   | | ___   |  / (___)   .'\`  | |  |(___)  | |,' /     |  | | |  |  / (___)  | |  
   | |(   )  | |         / .'| | |  |       | .  '.     |  |/  |  | |         | |  
   | | | |   | |        | /  | | |  | ___   | | \`. \\    |  ' _.'  | |         | |  
   | ' | |   | |        ; |  ; | |  '(   )  | |   \\ \\   |  .'.-.  | |         |_|  
   ' \`-' ;   | |        ' \`-'  | '  \`-' |   | |    \\ .  '  \`-' /  | |         .-.  
    \`.__.   (___)       \`.__.'_.  \`.__,'   (___ ) (___)  \`.__.'  (___)       (___) 
            `));


            console.log(chalk.bgBlue.whiteBright(`\t Connected as ${conn.threadId} \t\n`));

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
                    'Update Employee Role',
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
            console.log('\n');
            console.table(rows);
            console.log('\n');
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

                    console.log(chalk.bgRedBright.whiteBright('\n\n Please enter department\'s name \n'));
                    return false;
                }
            }
        ])
        .then(({ name }) => {
            this.addDepartment(name);
        });
    };

    addDepartment(name) {
        connection
        .then(conn => conn.query(`INSERT INTO department(name) VALUES ('${name}')`))
        .then(() => {
            console.log(chalk.bgGreen.whiteBright(`\n ${name} has been added to the database! `));
            this.showTable('department');
        });
    };

    promptRole() {
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Please enter role title. (required)',
                validate: title => {
                    if (title) return true;

                    console.log(chalk.bgRedBright.whiteBright(' please enter a title \n'));
                    return false;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please enter role\'s salary. (required)',
                validate: salary => {
                    if (!salary || isNaN(salary)) {
                        console.log(chalk.bgRedBright.whiteBright(' please enter a valid salary \n'));
                        return false;
                    };

                    return true;
                }
            },
            {
                type: 'input',
                name: 'dep_id',
                message: 'Please enter the departmeent\'s id associated with the role:',
                vlaidate: dep_id => {
                    if (!dep_id || isNaN(dep_id)) {
                        console.log(chalk.bgRedBright.whiteBright(' please enter a valid department id! \n'));
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
        .then(() => {
            console.log(chalk.bgGreen.whiteBright(`\n Role has been added! `));
            this.showTable('role')
        })
        .catch(err => {
            console.log(chalk.bgRedBright.whiteBright(' Not a valid department ID! \n'));
            console.log(chalk.bgRedBright.whiteBright(' Please Try Again! \n'));
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

                    console.log(chalk.bgRedBright.whiteBright(' Please enter employee\'s first name \n'));
                    return false;
                }
            },
            {
                type: 'input',
                name: 'lname',
                message: 'What is employee\'s last name? (required)',
                validate: fname => {
                    if (fname) return true;

                    console.log(chalk.bgRedBright.whiteBright(' Please enter employee\'s last name \n'));
                    return false;
                }
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'What is employee\'s role id? (required)',
                validate: roleId => {
                    if (!roleId || isNaN(roleId)) {
                        console.log(chalk.bgRedBright.whiteBright(' \nPlese enter a valid role id \n'));
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
            .then(conn => conn.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES('${fname}', '${lname}', '${roleId}', '${managerId}')`))
            .then(() => {
                console.log(chalk.bgGreen.whiteBright('\n Employee has been added! '));
                this.showTable('employee');
            })
            .catch(() => {
                console.log(chalk.bgRedBright.whiteBright(' Not a valid role id! '));
                console.log(chalk.bgRedBright.whiteBright(' Please Try again! \n'));
                this.promptEmployee();
            });
        } else {
            connection
            .then(conn => conn.query(`INSERT INTO employee(first_name, last_name, role_id) VALUES('${fname}', '${lname}', '${roleId}')`))
            .then(() => {
                console.log(chalk.bgGreen.whiteBright('\n Employee has been added! '));
                this.showTable('employee');
            })
            .catch((err) => {
                console.log(chalk.bgRedBright.whiteBright(' Not a valid role id! '));
                console.log(chalk.bgRedBright.whiteBright(' Please Try again! \n'));
                this.promptEmployee();
            });
        };
    };

    getEmployeeNames() {
        return new Promise((resolve, reject) => {
            connection
            .then(conn => conn.query("SELECT CONCAT(first_name, ' ', last_name) AS 'employeeName' FROM employee"))
            .then(([ names ]) => {
                const namesArr = [];
                for (const name of names) {
                    namesArr.push(name.employeeName);
                };

                resolve(namesArr);
            });
        });
    };

    getRoles() {
        return new Promise((resolve, reject) => {
            connection
            .then(conn => conn.query("SELECT title FROM role"))
            .then(([ roles ]) => {
                const rolesArr = [];
                for (const role of roles) {
                    rolesArr.push(role.title);
                };

                resolve(rolesArr);
            });
        });
    };

    updateEmployeeRole() {
        let names, roles;

        this.getEmployeeNames()
        .then(n => {
            names = n;
            this.getRoles()
            .then(r => {
                roles = r
                this.updateEmployeePrompt(names, roles);
            });
        });
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
        .then(data => {
            let employeeName = data.name;
            connection
                .then(conn => conn.query(`SELECT id FROM role WHERE title LIKE "${data.role}"`))
                .then(([ id ]) => {
                    this.updateEmployee(employeeName, id[0].id);
                });
        });
    };

    updateEmployee(name, roleId) {
        connection
        .then(conn => conn.query(`UPDATE employee SET role_id = ${roleId} WHERE CONCAT(first_name, " ", last_name) LIKE "${name}"`))
        .then(() => {
            console.log(chalk.bgGreen.whiteBright('\nSuccessfully Updated!\n'));
            this.showTable('employee');
        });
    };

    quit() {
        console.log(chalk.bgGreen.whiteBright('\n Thank You! \n'));
        connection.then(conn => conn.destroy());
    };
};

new Query().startQuery();
