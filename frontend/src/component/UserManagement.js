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
      console.error("Failed to fetch users:", err);
    }
  };

  const validateFileContent = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const requiredHeaders = ["first_name","last_name","role","dob","gender","email","mobile","city","state",];
  
      // Normalize headers to lowercase
      const headers = jsonData[0]?.map((header) =>
        header?.toLowerCase().trim()
      );
      // Check for missing required headers
      const missingHeaders = requiredHeaders.filter(
        (header) => !headers.includes(header)
      );
      if (missingHeaders.length > 0) {
        setValidationErrors({
          file: `Missing required headers: ${missingHeaders.join(", ")}`,
        });
        return false;
      }
      // Validate rows for email and dob
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const today = new Date();
      const errors = [];
      jsonData.slice(1).forEach((row, index) => {
        const rowData = Object.fromEntries(
          headers.map((header, i) => [header, row[i]])
        );
  
        // email validation
        if (rowData.email && !emailRegex.test(rowData.email)) {
          errors.push(`Row ${index + 2}: Invalid email address "${rowData.email}"`);
        }
  
        // Dob validation (not allowing future dates)
        if (rowData.dob) {
          const dob = new Date(rowData.dob);
          if (isNaN(dob.getTime()) || dob > today) {
            errors.push(
              `Row ${index + 2}: Invalid date of birth "${rowData.dob}". Future dates are not allowed.`
            );
          }
        }
      });
      if (errors.length > 0) {
        setValidationErrors({ file: errors.join("\n") });
        return false;
      }
        setValidationErrors({});
      return true;
    } catch (err) {
      console.error("File validation error:", err);
      setValidationErrors({ file: "Invalid file format." });
      return false;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(""); // Clear previous errors

    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop().toLowerCase();
      if (fileType !== "xlsx") {
        setFile(null); // Reset file input
        setError("Only .xlsx files are allowed.");
        alert("Invalid file type. Please upload an .xlsx file.");
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleFileUpload = async () => {
    try {
      setError("");
      setValidationErrors({});
      if (!file) {setError("Please select a file");return;}
      const isValid = await validateFileContent(file);
      if (!isValid) return;
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        "http://localhost:5000/users/upload-users",
        formData,
        {    headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",}, } );
      await fetchUsers(); // Refresh the users
      setFile(null); // Clear file input
      setError("File uploaded successfully.");
    } catch (err) {
      console.error("Error uploading file:", err.message);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again.");}};

  const handleExport = async () => {
    try {
      // Call the backend API to export users
      const response = await axios.get("http://localhost:5000/users/export-users", {  headers: {
          Authorization: `Bearer ${token}`,
        },responseType: "blob", // Important for downloading files
  });
      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx"); // Name of the downloaded file
      document.body.appendChild(link);
      link.click(); // Trigger the download
      link.parentNode.removeChild(link); // Clean up the DOM
    } catch (error) {
      console.error("Error exporting users:", error);
      alert("Failed to export users. Please try again.");
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
    } catch (err) {
      console.error("Failed to delete user");
    }
  };
  const navigateToEdit = (user) => {
    navigate(`/users/${user._id}`, { state: { user } });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {validationErrors.file && (<div style={{ color: "red" }}>
          <strong>File Error:</strong> {validationErrors.file}
        </div>)}
      <input
        type="file"   onChange={handleFileChange}
      />
      <button onClick={handleFileUpload}>Upload</button>
      <button onClick={handleExport}>Export</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>First Name</th>  <th>Last Name</th>
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
