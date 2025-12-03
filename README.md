📚 School Management System

A complete MERN-based school management system with separate modules for Admin, Teachers, and Students, including authentication, attendance, subjects, classes, and more.

🚀 Features
🧑‍🏫 Admin Panel

Manage Students, Teachers, Subjects, Classes

Create and assign class-teacher

View all records

JWT-protected routes

👨‍🎓 Student Dashboard

View profile

Check subjects & classes

Attendance view

👨‍🏫 Teacher Dashboard

Mark attendance

Manage subjects assigned

View class students

🏗️ Tech Stack
Backend

Node.js

Express.js

MongoDB / Mongoose

JWT Authentication

Bcrypt

MVC architecture

Frontend

React.js

Axios

Context API / Redux (if used)

Ant Design / Tailwind (if used)

📁 Folder Structure
School Management System/
├── backend/
├── frontend/
└── README.md

⚙️ Setup Instructions
1️⃣ Clone the repo
git clone https://github.com/YOUR_USERNAME/school-management-system.git
cd school-management-system

2️⃣ Setup Backend
cd backend
npm install
npm start

3️⃣ Setup Frontend
cd ../frontend
npm install
npm start

🔑 Environment Variables (.env)

You must create a .env file in backend/:

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

🤝 Contributing

Pull requests are welcome!

📄 License

This project is licensed under the MIT License.
