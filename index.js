// Required Dependencies
const inquirer = require("inquirer");
const db = require("./db");
require("console.table");

// Initiates prompts
askQs()

// All main prompts 
function askQs() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'Please make a selection below',
        choices: [
            'View all Employees',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'View all Departments',
            'Add Department',
            'Remove Department',
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View Utilized Budget by Department',
            'Quit',
        ]
    }]).then(res => {
        let choice = res.choice

        switch (choice) {
            case 'View all Employees':
                viewEmployees()
                break;
            case 'Add Employee':
                addEmployee()
                break;
            case 'Remove Employee':
                removeEmployee()
                break;
            case 'Update Employee Role':
                updateEmployeeRole()
                break;
            case 'View all Departments':
                viewAllDeps()
                break;
            case 'Add Department':
                addDep()
                break;
            case 'Remove Department':
                removeDep()
                break;
            case 'View All Roles':
                viewAllRoles()
                break;
            case 'Add Role':
                addRole()
                break;
            case 'Remove Role':
                removeRole()
                break;
            case 'View Utilized Budget by Department':
                viewBudgetbyDep()
                break;
            default:
                quit()
        }
    })
}

// View all employees in db
viewEmployees = async() => {
    console.log('\nVIEWING ALL EMPLOYEES IN DATABASE')
    var [employees] = await db.findEmployees()
    console.table(employees)
    askQs()
}


// Add Employee to db
addEmployee = async() => {
    console.log('\nANSWER PROMPTS BELOW TO ADD EMPLOYEE TO DATABASE\n')
    let [roles] = await db.findAllRoles()
    let [managers] = await db.findEmployees()

    let employee = await inquirer.prompt([{
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            message: "What is the employee's role?",
            type: "list",
            choices: roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
        },
        {
            name: 'manager_id',
            message: "Who is their manager?",
            type: 'list',
            choices: managers.map((manager) => {
                return {
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                }
            }),
        },

    ])
    await db.createEmployee(employee);
    console.log(`Added ${employee.first_name} ${employee.last_name} to the database`)
    askQs()

}

// Remove an employee from the db
removeEmployee = () => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE EMPLOYEE FROM DATABASE')
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }))

            inquirer.prompt([{
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeOptions
                }])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Success! Removed the employee from the database"))
                .then(() => askQs())
        })
}

// Update employee role in db
updateEmployeeRole = () => {
    console.log('\nANSWER PROMPTS BELOW TO UPDATE EMPLOYEE ROLE IN DATABASE')
    db.findAllEmployees()
        .then(([rows]) => {
            let employee = rows
            const employeeOptions = employee.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([{
                    type: "list",
                    name: "employeeId",
                    message: "Which employee would you like to update their role for?",
                    choices: employeeOptions
                }])
                .then(res => {
                    let employeeId = res.employeeId
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleOptions = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));
                            inquirer.prompt([{
                                    type: "list",
                                    name: "roleId",
                                    message: "Which role would you like to assign to this employee?",
                                    choices: roleOptions
                                }])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Success! Updated employee's role"))
                                .then(() => askQs())
                        });
                });
        })
}

// View all departments in the db
viewAllDeps = () => {
    console.log('\nVIEWING ALL DEPARTMENTS IN DATABASE')
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => askQs());
}

// Add a department to the db
addDep = () => {
    console.log('\nANSWER PROMPTS BELOW TO ADD A NEW DEPARTMENT TO THE DATABASE')
    inquirer.prompt([{
            name: "name",
            message: "What is the name of the department you would like to add?"
        }])
        .then(res => {
            let name = res;
            db.createDep(name)
                .then(() => console.log(`Success! Added ${name.name} department to the database`))
                .then(() => askQs())
        })
}

// Remove a department in the db
removeDep = () => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE A DEPARTMENT FROM THE DATABASE *WARNING!! REMOVING A DEPARTMENT WILL ALSO REMOVE ASSSOCIATED EMPLOYEES AND ROLES!!')
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows;
            const depOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            inquirer.prompt([{
                    type: "list",
                    name: "depId",
                    message: "Which department would you like to remove?",
                    choices: depOptions
                }])
                .then(res => db.removeDep(res.depId))
                .then(() => console.log("Success! Removed department from the database"))
                .then(() => askQs())
        })
}

// View all roles in db
viewAllRoles = () => {
    console.log('\nVIEWING ALL ROLES IN DATABASE')
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => askQs());
}

// Add a role to the db
addRole = () => {
    console.log('\nANSWER PROMPTS BELOW TO ADD A NEW ROLE TO THE DATABASE')
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows
            const depOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            inquirer.prompt([{
                        name: "title",
                        message: "What would you like to name this role?"
                    },
                    {
                        name: "salary",
                        message: "What is the salary of the role?"
                    },
                    {
                        type: "list",
                        name: "department_id",
                        message: "Which department would you like to add this role to?",
                        choices: depOptions
                    }
                ])
                .then(role => {
                    db.createRole(role)
                        .then(() => console.log(`Success! Added ${role.title} to the database`))
                        .then(() => askQs())
                })
        })
}

// Remove a role from the db
removeRole = () => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE A ROLE FROM THE DATABASE *WARNING!! REMOVING A ROLE WILL ALSO REMOVE ASSSOCIATED EMPLOYEES!!')
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleOptions = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            inquirer.prompt([{
                    type: "list",
                    name: "roleId",
                    message: "Which role would you like to remove?",
                    choices: roleOptions
                }])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log("Success! Removed role from the database"))
                .then(() => askQs())
        })
}

// Views the utilized budget by department
viewBudgetbyDep = () => {
    console.log('\nVIEWING UTILIZED BUDGETS BY DEPARTMENT')
    db.viewDepBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => askQs());
}

// Breaks from prompts
quit = () => {
    console.log("Thank you for using the employee tracker app! Bye for now!")
    process.exit()
}