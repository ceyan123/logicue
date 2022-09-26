const router = require('express').Router();
const upload = require("../utils/multer");
const {  add_product, edit_product, delete_product, update_product}  = require("../controller/product")

// router.get("/edit", editproduct)
router.post("/", upload.single('image'), add_product)
router.get("/edit/:id", edit_product)
router.get("/delete/:id", delete_product)
router.post("/update/:id", update_product)



module.exports = router;