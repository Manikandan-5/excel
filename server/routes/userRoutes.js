const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { uploadUsers, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// authenticate used header route verify

router.post("/upload-users", authenticate, upload.single("file"), uploadUsers);
router.get("/", authenticate, getAllUsers);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

module.exports = router;
