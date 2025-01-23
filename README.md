User Management Application(Excel=>import/export)

Features


Authentication:
Secure user registration and login with JWT-based authentication.
Protected routes for user management.

User Management:
List all users with details like name, role, email, and more.
Edit user details on a separate page.
Delete users from the database.
Excel Import/Export:

Upload an Excel file to import user data.
Export the list of users into an Excel file.


Technologies Used 

Frontend:
React.js
Axios
React Router DOM
CSS for styling

Backend:
Node.js
Express.js
MongoDB (Mongoose)
Multer (for file uploads)
XLSX (for parsing and exporting Excel files)
Bcrypt.js (for password hashing)
JSON Web Tokens (JWT) for authentication
Installation and Setup

Prerequisites:
Node.js (v14 or higher)
MongoDB (running locally or cloud-based like MongoDB Atlas)
npm  installed globally.
Backend Setup
Navigate to the backend directory:


env
Copy
Edit
MONGO_URI=mongodb://127.0.0.1:27017/exceldata
JWT_SECRET=exceldatapassword
Start the backend server:

bash
Copy
Edit
npm start
The backend will be running at http://localhost:5000.

Frontend Setup
Navigate to the frontend directory:


bash
Copy
Edit
npm install
Start the frontend development server:

bash
Copy
Edit
npm start
The frontend will be running at http://localhost:3000.

Usage Instructions
Authentication
Register a new user at http://localhost:3000/register.
Log in at http://localhost:3000/login to receive an authentication token.
The token is stored in localStorage and is used for accessing protected routes.
User Management
After logging in, navigate to the user management page (/users).
Features:
List Users: View all users in a table format.
Edit Users: Click the "Edit" button to navigate to the edit page and update user details.
Delete Users: Click the "Delete" button to remove a user from the database.
Import Users
On the user management page, use the file input to upload an Excel file.
The Excel file should contain columns: First Name, Last Name, Role, DOB, Gender, Email, Mobile, City, and State.

Export Users
Click the "Export" button to download all user data in Excel format.

Backend Endpoints
Endpoint	Method	Description
/register	POST	Register a new user.
/login	POST	Log in and receive a JWT token.
/users	GET	Fetch all users (protected).
/users/:id	PUT	Update user details (protected).
/users/:id	DELETE	Delete a user (protected).
/upload-users	POST	Import users from an Excel file.
/export-users	GET	Export users to an Excel file.
Excel File Requirements
The file must be in .xlsx format.
Required columns:
First Name
Last Name
Role
DOB (Date of Birth in YYYY-MM-DD format)
Gender
Email (must be unique)
Mobile
City
State
Use Postman or similar tools to test the backend endpoints.
Add the Authorization header with Bearer token for protected routes.
Test the frontend using the browser.
Upload a valid Excel file to ensure the import functionality works.
Additional Notes
Error Handling:
Validation errors are displayed on the frontend.
Ensure the Excel file format matches the requirements.
Security:
Passwords are hashed using bcrypt before saving to the database.
JWT tokens are used for secure API access.
