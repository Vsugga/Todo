# Simple Todo App

A full-stack React todo application with user authentication and MySQL database integration.

## Features

- User registration and login with JWT authentication
- Add new todo items
- Mark todos as completed or incomplete
- Edit existing todo items
- Delete todo items
- Persistent storage in MySQL database
- Password hashing with bcrypt

## Technologies Used

- **Frontend**: React 18, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **Other**: CORS, JavaScript (ES6+), CSS3

## Prerequisites

- Node.js (v14 or higher)
- MySQL server running locally
- MySQL database named "todo" (or update the database name in server.js)

## Getting Started

1. **Clone or set up the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up MySQL database:**
   - Create a database named "todo"
   - Run the SQL queries in `database_setup.sql` to create the tables
   - Or let the application create them automatically on first run

4. **Start the backend server:**
   ```bash
   npm run server
   ```
   The server will run on `http://localhost:5000`

5. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/todos` - Get user's todos (requires auth)
- `POST /api/todos` - Add new todo (requires auth)
- `PUT /api/todos/:id` - Update todo (requires auth)
- `DELETE /api/todos/:id` - Delete todo (requires auth)

## Database Schema

The database schema is defined in `database_setup.sql`. For reference:

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## How to Use

- **Sign Up**: Create a new account with email and password
- **Sign In**: Log in with your existing account
- **Add Todo**: Enter a new todo in the input field and click "Add Todo" or press Enter
- **Mark Complete**: Check the checkbox to mark a todo as completed
- **Edit Todo**: Click "Edit" to modify a todo item (an input field will appear)
- **Delete Todo**: Click "Delete" to remove a todo item
- **Logout**: Click the "Logout" button to sign out

## Data Storage

User accounts and todos are stored in the MySQL database. Each user has their own set of todos.

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled for cross-origin requests

## Build for Production

```bash
npm run build
```

## Browser Support

Works in all modern web browsers that support ES6 modules and fetch API.
