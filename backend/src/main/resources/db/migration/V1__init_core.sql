CREATE TABLE roles (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE users (
  id              BIGSERIAL PRIMARY KEY,
  email           VARCHAR(150) UNIQUE NOT NULL,
  password_hash   VARCHAR(100) NOT NULL,
  role_id         INT NOT NULL REFERENCES roles(id),
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  failed_attempts INT NOT NULL DEFAULT 0,
  last_login      TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE departments (
  id   BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE employees (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT UNIQUE REFERENCES users(id),
  emp_code      VARCHAR(20) UNIQUE NOT NULL,
  full_name     VARCHAR(120) NOT NULL,
  department_id BIGINT REFERENCES departments(id),
  designation   VARCHAR(100),
  manager_id    BIGINT REFERENCES employees(id),
  join_date     DATE NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  deleted       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);

INSERT INTO roles(name) VALUES ('ADMIN'), ('HR'), ('MANAGER'), ('EMPLOYEE');
