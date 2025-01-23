import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditUser.css";

const EditUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state;
  const [editedUser, setEditedUser] = useState(user);
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
    try {
      await axios.put(`http://localhost:5000/users/${editedUser._id}`, editedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/users");
    } catch (err) {
      console.error("Failed to update user");
    }
  };

  return (
    <div className="edit-user-container">
      <form onSubmit={handleSubmit}>
        <h2>Welcome,{editedUser.first_name}</h2>
        <h3>Edit Data</h3>

        <div>
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={editedUser.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
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
            />
            <label htmlFor="male">Male</label>

            <input
  type="radio"
  id="female"
  name="gender"
  value="Female"
  checked={editedUser.gender.toLowerCase() === "female"}
  onChange={handleGenderChange}
/>

            <label htmlFor="female">Female</label>

            <input
              type="radio"
              id="other"
              name="gender"
              value="Other"
              checked={editedUser.gender.toLowerCase() === "other"}
              onChange={handleGenderChange}
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
          />
        </div>

        <button type="submit">Save</button>
        <button type="button" onClick={() => navigate("/users")}>Cancel</button>
      </form>
    </div>
  );
};

export default EditUser;
