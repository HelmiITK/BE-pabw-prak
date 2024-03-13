const router = require("express").Router();

const Auth = require("../controller/authController");
const authMe = require("../middlewares/authMe");

router.post("/register", Auth.register);
router.post("/login", Auth.login);
router.get("/authme", authMe, Auth.authMe);

module.exports = router;
