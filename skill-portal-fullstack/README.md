# SkillPortal — Student Skill Development Portal (MySQL-connected)

This version keeps the SkillPortal front page and the four extra pages. The homepage's **Student Login / Register** form now sends student name, email and primary skill to the Express API. The API inserts the record into MySQL. The **Student Records** page reads the saved records back from MySQL.

## What happens when a student registers?
1. Open the homepage and click **Student Login / Register**.
2. Enter the student's name, email and primary skill.
3. Click **Register and Save**.
4. `script.js` sends a `POST` request to `http://localhost:5000/api/students`.
5. `backend/src/routes/students.js` validates the input and inserts it into MySQL using `backend/src/db.js`.
6. Open **Student Records** to see the saved database rows.

> The form is a student registration/demo entry flow, not password-based authentication. It intentionally does not ask for or store passwords. Each email must be unique.

## Requirements
- Node.js 18 or newer and npm
- MySQL Server, or XAMPP with MySQL/MariaDB
- Optional: PHP 8+ if you also want to run the PHP practical pages

## Setup the MySQL database

### Option A: phpMyAdmin (XAMPP)
1. Start **MySQL** in XAMPP Control Panel.
2. Open `http://localhost/phpmyadmin`.
3. Select the **Import** tab and choose `backend/database/schema.sql`.
4. Click **Import/Go**. This creates the `skill_portal` database and the `students` table. It also inserts three clearly labelled demo rows; you can remove them if you want an empty table.

### Option B: MySQL command line
Run this from the project folder (adjust the MySQL executable path if necessary):

```bash
mysql -u root -p < backend/database/schema.sql
```

For a default XAMPP installation, the `root` account may have a blank password. Only use a blank password if that matches your local MySQL setup.

## Configure and run the Node.js backend

1. Open a terminal in the `skill-portal-fullstack` project folder.
2. Enter the backend folder and install packages:

```bash
cd backend
npm install
```

3. Copy `.env.example` to a new file named `.env` in the `backend` folder. Update the settings to match your MySQL account:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=skill_portal
```

4. Start the server:

```bash
npm start
```

5. Keep that terminal open and visit **http://localhost:5000**. The server serves the website and API from the same address. Do not open the HTML by double-clicking if you want the easiest setup.

## Verify the database connection

- Visit `http://localhost:5000/api/health` — the Express server should return JSON.
- Visit `http://localhost:5000/api/students` — the API should return student records from MySQL.
- Register a new student on the homepage, then open **Student Records** or refresh `http://localhost:5000/api/students`. The new record should appear.
- To verify directly in MySQL, run:

```sql
USE skill_portal;
SELECT id, name, email, skill, created_at FROM students ORDER BY id DESC;
```

If you see a message about a database request failing, check that MySQL is running, `backend/database/schema.sql` was imported, and `backend/.env` has the correct credentials. A duplicate email returns a helpful error because `students.email` is unique.

## Included practical assignments
- **8–9:** React SPA, JSX, components, state and events in `frontend/src/`.
- **10:** Fetch API and JSON integration.
- **11:** DOM manipulation and events in `script.js`, `pages.js` and `students.js`.
- **12–13:** PHP form/session and PHP–MySQL CRUD in `php/`.
- **14–15:** Express server and MySQL-backed REST CRUD API in `backend/`.

## Main files
- `index.html`, `styles.css`, `script.js` — standalone homepage and database-backed registration form
- `skills.html`, `companies.html`, `placement.html`, `projects.html` — extra webpages
- `students.html`, `students.js` — database-backed student record list
- `backend/server.js` — Express server and static site hosting
- `backend/src/routes/students.js` — REST CRUD endpoints
- `backend/src/db.js` — MySQL connection pool
- `backend/database/schema.sql` — database and table schema
- `php/` — PHP form/session and CRUD practical files
- `frontend/` — React frontend for assignments 8–10
