const router = require("express").Router();

const Auth = require("./authRouter");

router.use("/auth", Auth);

module.exports = router;
