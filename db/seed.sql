USE employees;

INSERT INTO departments (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (title, salary, department_id) 
VALUES
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 160000, 2),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3),
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Sonja', 'Dannon', 1, NULL),
    ('Ahmed', 'Youssef', 2, 1),
    ('Jamelia', 'Castro', 3, NULL),
    ('Roman', 'Rodriquez', 4, 3),
    ('Ismaeel', 'Yu', 5, NULL),
    ('Kaya', 'Chen', 6, 5,),
    ('Khalid', 'Deacon', 7, NULL),
    ('Hanh', 'Nguyen', 8, 7);