const User = require("../models/User");
const xlsx = require("xlsx");
const fs = require("fs");

// Upload Users from Excel
exports.uploadUsers = async (req, res) => {
  const filePath = req.file.path;

  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);

    for (const user of users) {
      // Validate required fields
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
        return res.status(400).json({
          error: `Invalid data in the Excel file. Missing fields in row: ${JSON.stringify(
            user
          )}`,
        });
      }

      // Check for duplicate emails
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        return res.status(400).json({
          error: `Duplicate email detected: ${user.email}`,
        });
      }

      // Save valid user
      const newUser = new User({
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        dob: new Date(user.dob), // Ensure date format
        gender: user.gender,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
        state: user.state,
      });

      await newUser.save();
    }

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);

    res.json({ message: "Users uploaded successfully" });
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export Users to Excel
exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found to export." });
    }

    const jsonData = users.map((user) => ({
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      dob: user.dob.toISOString().split("T")[0], // Format DOB
      gender: user.gender,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      state: user.state,
    }));

    const worksheet = xlsx.utils.json_to_sheet(jsonData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="users.xlsx"'
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
    res.send(buffer);
  } catch (err) {
    console.error("Error exporting users:", err);
    res.status(500).json({ message: "Error exporting users." });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
