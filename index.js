// Required Dependencies
const inquirer = require("inquirer");
const db = require("./db");
require("console.table");


console.table(
        "\n------------ EMPLOYEE TRACKER ------------\n"
    )
    // All main prompts 
const askQs = async() => {
    let answer = await inquirer.prompt([{
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
    }])

    switch (answer.choice) {
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
}

// View all employees in db
viewEmployees = async() => {
    console.log('\nVIEWING ALL EMPLOYEES IN DATABASE\n')

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
    console.log(`\nSuccess! Added ${employee.first_name} ${employee.last_name} to the database\n`)
    askQs()

}

// Remove an employee from the db
removeEmployee = async() => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE EMPLOYEE FROM DATABASE')

    let [employees] = await db.findEmployees()
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))

    let removeEmployee = await inquirer.prompt([{
        type: "list",
        name: "employeeId",
        message: "Which employee do you want to remove?",
        choices: employeeOptions
    }])

    await db.removeEmployee(removeEmployee.employeeId)
    console.log("\nSuccess! Removed the employee from the database\n")
    askQs()
}


// Update employee role in db
updateEmployeeRole = async() => {
    console.log('\nANSWER PROMPTS BELOW TO UPDATE EMPLOYEE ROLE IN DATABASE')

    let [employees] = await db.findEmployees()
    const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }))

    let employeeUpdate = await inquirer.prompt([{
        type: "list",
        name: "employeeId",
        message: "Which employee would you like to update their role for?",
        choices: employeeOptions
    }])


    let [roles] = await db.findAllRoles()
    const roleOptions = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    let roleUpdate = await inquirer.prompt([{
        type: "list",
        name: "roleId",
        message: "Which role would you like to assign to this employee?",
        choices: roleOptions
    }])
    await db.updateEmployeeRole(employeeUpdate.employeeId, roleUpdate.roleId)
    console.log("\nSuccess! Updated employee's role\n")
    askQs()
}

// View all departments in the db
viewAllDeps = async() => {
    console.log('\nVIEWING ALL DEPARTMENTS IN DATABASE\n')

    var [departments] = await db.findAllDeps()
    console.table(departments);
    askQs()
}

// Add a department to the db
addDep = async() => {
    console.log('\nANSWER PROMPTS BELOW TO ADD A NEW DEPARTMENT TO THE DATABASE\n')
    let newDep = await inquirer.prompt([{
        name: "name",
        message: "What is the name of the department you would like to add?"
    }])
    await db.createDep(newDep)
    console.log(`\nSuccess! Added ${newDep.name} department to the database\n`)
    askQs()
}

// Remove a department in the db
removeDep = async() => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE A DEPARTMENT FROM THE DATABASE *WARNING!! REMOVING A DEPARTMENT WILL ALSO REMOVE ASSSOCIATED EMPLOYEES AND ROLES!!\n')

    var [departments] = await db.findAllDeps()
    const depOptions = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }))

    let removeDepartment = await inquirer.prompt([{
        type: "list",
        name: "depId",
        message: "Which department would you like to remove?",
        choices: depOptions
    }])
    await db.removeDep(removeDepartment.depId)
    console.log("\nSuccess! Removed department from the database\n")
    askQs()
}

// View all roles in db
viewAllRoles = async() => {
    console.log('\nVIEWING ALL ROLES IN DATABASE\n')

    var [roles] = await db.findAllRoles()
    console.table(roles)
    askQs()
}

// Add a role to the db
addRole = async() => {
    console.log('\nANSWER PROMPTS BELOW TO ADD A NEW ROLE TO THE DATABASE\n')

    var [departments] = await db.findAllDeps()
    const depOptions = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }))

    let newRole = await inquirer.prompt([{
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

    await db.createRole(newRole)
    console.log(`\nSuccess! Added ${newRole.title} to the database\n`)
    askQs()
}

// Remove a role from the db
removeRole = async() => {
    console.log('\nANSWER PROMPTS BELOW TO REMOVE A ROLE FROM THE DATABASE *WARNING!! REMOVING A ROLE WILL ALSO REMOVE ASSSOCIATED EMPLOYEES!!')

    let [roles] = await db.findAllRoles()
    const roleOptions = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }))

    let role = await inquirer.prompt([{
        type: "list",
        name: "roleId",
        message: "Which role would you like to remove?",
        choices: roleOptions
    }])
    db.removeRole(role.roleId)
    console.log("\nSuccess! Removed role from the database\n")
    askQs()
}

// Views the utilized budget by department
viewBudgetbyDep = async() => {
    console.log('\nVIEWING UTILIZED BUDGETS BY DEPARTMENT\n')

    let [budget] = await db.viewDepBudgets()
    console.table(budget);
    askQs()
}

// Breaks from prompts
quit = () => {
    console.log("Thank you for using the employee tracker app! Bye for now!")
    process.exit()
}

askQs()