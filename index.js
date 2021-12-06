// Required Dependencies
const { prompt } = require("inquirer");
const db = require("./db");
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
            'View all Employees by Manager',
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
            case 'View all Employees by Manager':
                viewEmployeesByManager()
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