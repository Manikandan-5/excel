import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", {
        email,
        password,
      });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Registration failed. Email might already exist.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {/* success message */}
        {message && <p style={{ color: "green" }}>{message}</p>} 
        {/* error messsage */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
