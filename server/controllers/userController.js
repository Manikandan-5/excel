const User = require("../models/User");
const xlsx = require("xlsx");

// excel data form

exports.uploadUsers = async (req, res) => {
  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);

    for (const user of users) {
      if (
        !user.first_name ||
        !user.last_name ||
        !user.role ||
        !user.dob ||
        !user.gender ||
        !user.email ||
        !user.mobile ||
        !user.city ||
        !user.state
      ) {
        return res.status(400).json({ error: "Invalid data in the Excel file" });
      }

      const newUser = new User(user);
      await newUser.save();
    }

    res.json({ message: "Users uploaded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
