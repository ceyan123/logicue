const router = require('express').Router();

const {sign_up, sign_in, home, signin, log_out}  = require("../controller/user")

router.post("/sign_up", sign_up)
router.post("/sign_in", sign_in)
router.get("/", home)
router.get("/signin", signin)
router.get("/logout", log_out)
  

module.exports = router;