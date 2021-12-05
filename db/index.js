const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

function loadPrompts() {
    prompt([{
        type: 'list',
        name: 'choice',
        message: 'Please make a selection below',
        choices: [{
                name: "View all Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View all Employees by Department",
                value: "VIEW_ALL_EMPLOYEES_BY_DEP"
            },
            {
                name: "View all Employees by Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "View all Departments",
                value: "VIEW_ALL_DEPARTMENTS"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Remove Role",
                value: "REMOVE_ROLE"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "View Total Utilized Budget By Department",
                value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
            },
            {
                name: "Quit",
                value: "QUIT"
            }
        ]
    }])
}