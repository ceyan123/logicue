const router = require('express').Router();
const upload = require("../utils/multer");

const {  add_user, user_list, user_update, user_detail }  = require("../controller/user")

router.post("/user/register", upload.single('image'), add_user)
router.get("/user/list", user_list)
router.get("/user/:id", user_detail)
router.patch("/user/:id", user_update)



module.exports = router;