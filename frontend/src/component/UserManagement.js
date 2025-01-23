import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UserManagement.css";
import * as XLSX from "xlsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

//   email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

//   dob validation
  const validateDOB = (dob) => {
    const date = new Date(dob);
    const today = new Date();
    return date < today;
  };

  const validateFields = (userData) => {
    // check for the user data
    let errors = {};
    if (!userData.first_name) errors.first_name = "First name is required";
    if (!userData.last_name) errors.last_name = "Last name is required";
    if (!userData.email || !validateEmail(userData.email)) errors.email = "Invalid email format";
    if (!userData.dob || !validateDOB(userData.dob)) errors.dob = "Date of birth cannot be in the future";
    if (!userData.mobile) errors.mobile = "Mobile number is required";
    if (!userData.city) errors.city = "City is required";
    if (!userData.state) errors.state = "State is required";
    return errors;
  };

  const handleFileUpload = async () => {
    if (!file) return setError("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/validate-file",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming the server returns an array of user objects for validation
      const usersData = response.data;

      // Perform client-side validation
      for (const user of usersData) {
        const errors = validateFields(user);
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
        }
      }

      // If all validations pass, upload the file
      await axios.post("http://localhost:5000/upload-users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setError("");
      fetchUsers();
    } catch (err) {
      setError("Failed to upload file");
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user");
    }
  };

  const navigateToEdit = (user) => {
    navigate(`/edit-user/${user._id}`, { state: { user } });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {Object.keys(validationErrors).length > 0 && (
        <div style={{ color: "red" }}>
          {Object.entries(validationErrors).map(([field, message]) => (
            <p key={field}>{message}</p>
          ))}
        </div>
      )}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Upload</button>
      <button onClick={handleExport}>Export</button>

      {/* Scrollable container for the table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Role</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>City</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.role}</td>
                <td>{new Date(user.dob).toLocaleDateString()}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.city}</td>
                <td>{user.state}</td>
                <td>
                  <button onClick={() => navigateToEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
