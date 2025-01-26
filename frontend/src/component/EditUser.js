import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditUser.css";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [editedUser, setEditedUser] = useState(user);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const token = localStorage.getItem("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setEditedUser({ ...editedUser, gender: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!editedUser.first_name || !editedUser.last_name || !editedUser.mobile || !editedUser.email || !editedUser.dob || !editedUser.gender || !editedUser.role || !editedUser.city || !editedUser.state) {
      setErrorMessage("All fields are required.");
      setSuccessMessage(null);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/users/${editedUser._id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMessage("User updated successfully!");
      setErrorMessage(null);
      navigate("/users");
    } catch (err) {
      setErrorMessage("Failed to update user.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSubmit}>
        <h2>Welcome, {editedUser.first_name}</h2>
        <h3>Edit Data</h3>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={editedUser.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={editedUser.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            required
          />
        </div>

        <div>
          <label htmlFor="mobile">Mobile</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={editedUser.mobile}
            onChange={handleInputChange}
            placeholder="Mobile"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            required
          />
        </div>

        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={new Date(editedUser.dob).toISOString().split('T')[0]} // Correcting date format
            onChange={handleInputChange}
            placeholder="Date of Birth"
            max={new Date().toISOString().split("T")[0]} // Setting max date as today's date
            required
          />
        </div>

        <div className="gender">
          <label>Gender:</label>
          <div>
            <input
              type="radio"
              id="male"
              name="gender"
              value="Male"
              checked={editedUser.gender.toLowerCase() === "male"}
              onChange={handleGenderChange}
              required
            />
            <label htmlFor="male">Male</label>

            <input
              type="radio"
              id="female"
              name="gender"
              value="Female"
              checked={editedUser.gender.toLowerCase() === "female"}
              onChange={handleGenderChange}
              required
            />
            <label htmlFor="female">Female</label>

            <input
              type="radio"
              id="other"
              name="gender"
              value="Other"
              checked={editedUser.gender.toLowerCase() === "other"}
              onChange={handleGenderChange}
              required
            />
            <label htmlFor="other">Other</label>
          </div>
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={editedUser.role}
            onChange={handleInputChange}
            placeholder="Role"
            required
          />
        </div>

        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={editedUser.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
        </div>

        <div>
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={editedUser.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
        </div>

        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/users")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUser;
