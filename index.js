// Required Dependencies
const { prompt } = require("inquirer");
const db = require("./db");
const connection = require('./db/connection')
require("console.table");

// Initiates prompts
loadAllPrompts()

// Main prompts
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
            'Update Employee Manager',
            'View all Departments',
            'Remove Department',
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View Total Utilized Budget By Department',
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
            case 'Update Employee Manager':
                updateEmployeeManager()
                break;
            case 'View all Departments':
                viewAllDeps()
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
            case 'View Total Utilized Budget By Department':
                viewBudgetByDep()
            default:
                quit()
        }
    })
}

// View all employee function
viewEmployees = () => {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log('\n')
            console.table(employees)
        })
        .then(() => loadAllPrompts())
}

// View all employees by department
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

// Add Employee
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