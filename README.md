MERN RBAC Project
A full-stack MERN application with TypeScript, JWT-based Role-Based Access Control (RBAC), Redux Toolkit, Mongoose, bcrypt, access/refresh tokens, and Axios interceptors.
Project Structure

frontend/: React app with TypeScript, Redux Toolkit, Axios, and Tailwind CSS.
backend/: Node.js/Express server with TypeScript, Mongoose, JWT, and RBAC.

Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance)
Git

Setup Instructions
Backend

Navigate to backend/.
Install dependencies: npm install.
Create a .env file (use .env.example as a template).
Start the server: npm run dev.

Frontend

Navigate to frontend/.
Install dependencies: npm install.
Create a .env file with REACT_APP_API_URL=http://localhost:5000/api.
Start the app: npm start.

Scripts

Backend: npm run dev (uses Nodemon), npm run build (compiles TypeScript).
Frontend: npm start (development), npm run build (production).

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name.
Commit changes: git commit -m "Add feature".
Push to the branch: git push origin feature-name.
Open a pull request.

License
MIT
