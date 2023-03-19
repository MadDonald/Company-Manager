# Company Manager

A command-line application for managing departments, roles, and employees in a company.

## Features

- View all departments, roles, and employees
- Add a department, role, or employee
- Update an employee's role

## Video Showcase
https://user-images.githubusercontent.com/100619060/226203825-ae6f708d-89c4-43bc-af1a-5320341e3ddb.mp4

## Requirements

- Node.js
- MySQL

## Installation

1. Clone the repository or download the source code.

git@github.com:MadDonald/Company-Manager.git

2. Install the required dependencies.

cd company-manager
npm install

3. Set up the database schema and (optionally) seed the sample data.

Run the following commands in the MySQL Command-Line Client:

mysql -u root -p
Enter your password
SOURCE ./db/schema.sql;
SOURCE ./db/seed.sql;

## Usage

Run the application with the following command:

node index.js

Navagate using the arrow keys and enter key to select the option

