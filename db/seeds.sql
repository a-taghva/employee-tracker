USE employee_db;

INSERT INTO department(name)
VALUES  ('Production'),
        ('Purchasing'),
        ('Accounting and Finance');

INSERT INTO role(title, salary, department_id)
VALUES  ('Project Manager', 175000, 1),
        ('Purchasing Director', 150000, 2),
        ('Purchasing Agent', 125000, 2),
        ('Chief Financial Officer', 150000, 3),
        ('Financial Analyst', 135000, 3);

INSERT INTO employee(first_name, last_name, role_id)
VALUES  ('Juana', 'May', 1),
        ('Gloria', 'Lopez', 1),
        ('Kennith', 'Ellis', 2),
        ('Carl', 'Partin', 3),
        ('Roberto', 'Campbell', 3),
        ('Lance', 'Traylor', 4),
        ('Gary', 'Jones', 5);
