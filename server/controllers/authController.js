const Credential = require("../models/Credential");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "exceldatapassword";

// register data

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const existingUser = await Credential.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const credential = new Credential({ email, password: hashedPassword });
    await credential.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// login data

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  try {
    const credential = await Credential.findOne({ email });
    if (!credential) return res.status(400).json({ error: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, credential.password);
    if (!isPasswordValid) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ userId: credential._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: credential._id });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
