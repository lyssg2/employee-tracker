// Required Dependencies
const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

// Initiates prompts
loadAllPrompts()

// All main prompts 
function loadAllPrompts() {
    prompt([{
        type: 'list',
        name: 'choice',
        message: 'Please make a selection below',
        choices: [
            'View all Employees',
            'View all Employees by Department',
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
            case 'View all Employees by Department':
                viewEmployeesByDep()
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
viewEmployees = () => {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log('\n')
            console.table(employees)
        })
        .then(() => loadAllPrompts())
}

// View all employees by department in db
viewEmployeesByDep = () => {
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows;
            const depChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            prompt([{
                    type: "list",
                    name: "depId",
                    message: "Please select department to view employees",
                    choices: depChoices
                }])
                .then(res => db.findDepEmployees(res.departmentId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => loadAllPrompts())
        })
}

// Add Employee to db
addEmployee = () => {
    prompt([{
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                name: "last_name",
                message: "What is the employee's last name?"
            },
        ])
        .then(res => {
            let firstName = res.first_name
            let lastName = res.last_name

            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt({
                            type: "list",
                            name: "roleId",
                            message: "What is the employee's role?",
                            choices: roleChoices
                        })
                        .then(res => {
                            let roleId = res.roleId;
                            db.

                            findAllEmployees()
                                .then(([rows]) => {
                                    let employee = rows
                                    const managerOptions = employee.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    managerOptions.unshift({ name: "None", value: null });

                                    prompt({
                                            type: "list",
                                            name: "managerId",
                                            message: "Who is the employee's manager?",
                                            choices: managerOptions
                                        })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => loadAllPrompts())
                                })
                        })
                })
        })
}

// Remove an employee from the db
removeEmployee = () => {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }))

            prompt([{
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeOptions
                }])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Success! Removed the employee from the database"))
                .then(() => loadAllPrompts())
        })
}

// Update employee role in db
updateEmployeeRole = () => {
    db.findAllEmployees()
        .then(([rows]) => {
            let employee = rows
            const employeeOptions = employee.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([{
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
                            prompt([{
                                    type: "list",
                                    name: "roleId",
                                    message: "Which role would you like to assign to this employee?",
                                    choices: roleOptions
                                }])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Success! Updated employee's role"))
                                .then(() => loadAllPrompts())
                        });
                });
        })
}

// View all departments in the db
viewAllDeps = () => {
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadAllPrompts());
}

// Add a department to the db
addDep = () => {
    prompt([{
            name: "name",
            message: "What is the name of the department you would like to add?"
        }])
        .then(res => {
            let name = res;
            db.createDep(name)
                .then(() => console.log(`Success! Added ${name.name} department to the database`))
                .then(() => loadAllPrompts())
        })
}

// Remove a department in the db
removeDep = () => {
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows;
            const depOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            prompt([{
                    type: "list",
                    name: "depId",
                    message: "Which department would you like to remove?",
                    choices: depOptions
                }])
                .then(res => db.removeDep(res.depId))
                .then(() => console.log("Success! Removed department from the database"))
                .then(() => loadAllPrompts())
        })
}

// View all roles in db
viewAllRoles = () => {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => loadAllPrompts());
}

// Add a role to the db
addRole = () => {
    db.findAllDeps()
        .then(([rows]) => {
            let departments = rows
            const depOptions = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }))

            prompt([{
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
                        .then(() => loadAllPrompts())
                })
        })
}

// Remove a role from the db
removeRole = () => {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleOptions = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }))

            prompt([{
                    type: "list",
                    name: "roleId",
                    message: "Which role would you like to remove?",
                    choices: roleOptions
                }])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log("Success! Removed role from the database"))
                .then(() => loadAllPrompts())
        })
}

// Views the utilized budget by department
viewBudgetbyDep = () => {
    db.viewDepBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadAllPrompts());
}

// Breaks from prompts
quit = () => {
    console.log("Thank you for using the employee tracker app! Bye for now!")
    process.exit()
}