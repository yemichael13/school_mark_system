You are helping to develop a full-stack School Mark Management System using Vite (React) for the frontend and Node.js (Express) for the backend with MySQL as the database (running on XAMPP).
The project’s goal is to allow a school to manage students, teachers, subjects, and marks for two academic terms per year.
Only two user roles are required for now:
Admin — full access to manage data (CRUD for teachers, students, subjects).
Teacher — can record and calculate student marks per subject and term.
No parent or student login is needed yet.

⚙️ Technical Requirements
Frontend:
Built with React + Vite (already done without the apis).
Communicates with backend via REST API calls (using Axios).
Displays and manages data such as teachers, students, subjects, and marks.
Uses clean UI with tables, forms, and modals.
Backend (Node.js + Express):
Create a new folder /backend for server code. (already did this)
Setup server using Express. (already did this)
Use mysql2, dotenv, cors, bcryptjs, and jsonwebtoken. (already did this)
Use .env for configuration.

🗄️ Database (MySQL)
Use phpMyAdmin (via XAMPP) to create a database named school_mark_db. (already did this)
Tables & Relationships:
admins
id, name, email, password
teachers
id, name, email, password
students
id, name, class
subjects
id, name
marks
id, student_id, subject_id, teacher_id, term, mark, grade
Foreign keys:
marks.student_id → students.id
marks.subject_id → subjects.id
marks.teacher_id → teachers.id

🧮 Mark Logic
Each year has two terms:

Term1


Term2

Grades are calculated automatically from mark values:
Sum, Average and Rank within specific class only 
Teachers can:
Add marks for students per subject and term.
View total marks and grades for a student.
Update or delete marks if needed.
Admins can:
Add, edit, or delete teachers, students, and subjects.
View marks entered by teachers.

🧠 Authentication
Use JWT (JSON Web Tokens) for login sessions.
Passwords are hashed with bcryptjs.
Admin and teachers have separate login endpoints:
/api/admin/login
/api/teacher/login
Protected routes require a valid token.

🌐 API Overview
Endpoint	Method	Description
/api/admin/add-teacher	POST	Add new teacher
/api/admin/teachers	GET	Get all teachers
/api/admin/add-student	POST	Add new student
/api/admin/subjects	GET	List all subjects
/api/teacher/add-mark	POST	Record student mark
/api/teacher/marks/:student_id	GET	Get marks for a student
/api/auth/login	POST	Login (admin or teacher)

🖥️ Integration
Frontend Axios base URL: http://localhost:5000/api
When deployed:
Frontend on Netlify/Vercel
Backend on Render/Railway
MySQL hosted via ClearDB or local XAMPP (using public IP for LAN)
Example API call:
const res = await axios.post('http://localhost:5000/api/admin/add-teacher', {
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456'
});

🚀 Deployment (Free Options)
Backend: Render or Railway (free Node deployment)
Frontend: Netlify or Vercel (deploy from GitHub repo)
Database: Local XAMPP or online MySQL (ClearDB free tier)
You can also test via LAN IP (run ipconfig → get IPv4 → use http://192.168.x.x:5000).

📘 Expected Output
A fully working school mark system:
Admin Dashboard (manage teachers, students, subjects)
Teacher Dashboard (enter marks, calculate grades)
Secure login system
Data persistence in MySQL
Integration between frontend (Vite) and backend (Node)
Ready for local testing and free online deployment.

✍️ Goal for Copilot or AI Assistant
Based on this project description, generate:
Express backend files and structure
MySQL schema setup
CRUD APIs for Admin and Teacher
Authentication logic using JWT
Integration instructions with frontend

CHECK EVERYTHING SO YOU DON’T DO SOMETHING THAT HAS ALREADY BEEN DONE.
