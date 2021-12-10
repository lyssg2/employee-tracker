const connection = require('./connection')

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    // function to find all employees in the db and display their info
    findAllEmployees() {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM EMPLOYEE LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
        )
    }

    // Find all departments
    findAllDeps() {
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }

    // Create a new employee
    createEmployee(employee) {
        return this.connection.promise().query("INSERT INTO employee SET ?", employee);
    }

    // Remove an employee with provided id
    removeEmployee(employeeId) {
        return this.connection.promise().query(
            "DELETE FROM employee WHERE id = ?",
            employeeId
        );
    }

    // Update employee's role in db
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]
        )
    }

    // Find all departments in db
    findAllDeps() {
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }

    // Create a new department in db
    createDep(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }

    // Remove department from db
    removeDep(department) {
        return this.connection.promise().query("DELETE FROM department WHERE id = ?",
            department
        )
    }

    // Finds all roles in db
    findAllRoles() {
        return this.connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    // Create a new role in db
    createRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    // Remove role from db
    removeRole(role) {
        return this.connection.promise().query("DELETE FROM role WHERE id = ?",
            role
        )
    }

    // view utilized budgets by department from db
    viewDepBudgets() {
        return this.connection.promise().query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }
}


module.exports = new DB(connection);