const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Qaz123',
  database: 'employee_tracker',
});

connection.connect((err) => {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewAllRoles() {
  connection.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function viewAllEmployees() {
  connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the department name:',
      },
    ])
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err, res) => {
        if (err) throw err;
        console.log('Department added successfully!');
        mainMenu();
      });
    });
}

function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the role title:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the role salary:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department this role belongs to:',
          choices: departments.map((dept) => ({ name: dept.name, value: dept.id })),
        },
      ])
      .then((answer) => {
        connection.query('INSERT INTO role SET ?', answer, (err, res) => {
          if (err) throw err;
          console.log('Role added successfully!');
          mainMenu();
        });
      });
  });
}

function addEmployee() {
  connection.query('SELECT * FROM role', (err, roles) => {
    if (err) throw err;

    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: [
              { name: 'None', value: null },
              ...employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
            ],
          },
        ])
        .then((answer) => {
          connection.query('INSERT INTO employee SET ?', answer, (err, res) => {
            if (err) throw err;
            console.log('Employee added successfully!');
            mainMenu();
          });
        });
    });
  });
}

function updateEmployeeRole() {
  connection.query('SELECT * FROM employee', (err, employees) => {
    if (err) throw err;

    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employees.map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's new role:",
            choices: roles.map((role) => ({ name: role.title, value: role.id })),
          },
        ])
        .then((answer) => {
          connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.role_id, answer.employee_id], (err, res) => {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            mainMenu();
          });
        });
    });
  });
}