# 🎓 Student Management System (MERN + OTP)

A full-stack Student Management System built using the MERN stack with OTP-based authentication. This application allows students to securely access their results and enables admins to manage student data efficiently.

---

## 🚀 Overview

This system is designed to manage student records, authentication, and result processing with a secure and scalable architecture.

✔️ Full-stack MERN application
✔️ OTP-based authentication system
✔️ Role-based access (Admin / Student)
✔️ Secure and scalable backend

---

## ✨ Features

* 🔐 **OTP Authentication**

  * Secure login using OTP verification
  * Email-based OTP system

* 👨‍🎓 **Student Panel**

  * View personal details
  * Check results and marks

* 🛠️ **Admin Panel**

  * Add / manage students
  * Upload and update results

* 🗂️ **Data Management**

  * CRUD operations for student records
  * Structured MongoDB schema

* 🔐 **Protected Routes**

  * Role-based access control for admin and students

---

## 🧠 Architecture

* MVC (Model-View-Controller) pattern
* RESTful API design
* Modular and scalable folder structure

```id="n7w2kf"
client/        → React Frontend
server/        → Node.js Backend
controllers/   → Business logic
models/        → Database schemas
routes/        → API endpoints
middleware/    → Auth & OTP validation
```

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS
**Backend:** Node.js, Express.js, REST APIs
**Database:** MongoDB, Mongoose
**Authentication:** OTP (Email-based)

---

## ⚙️ Getting Started

### Clone Repository

```bash id="q6m4st"
git clone https://github.com/pr743/student-app
cd student-app
```

### Backend Setup

```bash id="k1r9va"
cd server
npm install
npm run dev
```

### Frontend Setup

```bash id="c8x2pl"
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in `/server`:

```id="z5h3mn"
PORT=5000
MONGO_URI=your_mongodb_connection
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

---

## 🌐 Live Demo

https://student-app-dusky.vercel.app/

---



## 📈 Future Improvements

* SMS-based OTP authentication
* Result analytics dashboard
* Export results (PDF/Excel)
* Notification system

---

## 👨‍💻 Author

**Mungra Prince**
MERN Stack Developer
GitHub: https://github.com/pr743

---

## ⭐ Support

If you like this project, please ⭐ the repository!

