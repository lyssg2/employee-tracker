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

    // Find all employees in a given department in db and their role
    findDepEmployees(departmentId) {
        return this.connection.promise().query(
            "SELECT employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id WHERE department.id",
            departmentId
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
}


module.exports = new DB(connection);