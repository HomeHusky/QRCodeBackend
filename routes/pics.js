const express = require("express");
const imageController = require("../controllers/pics.js");
// const { getPics, addPost, deletePost } = require("../controllers/pics.js");

const router = express.Router();

router.get("/all", imageController.getAllPics);
router.put("/update", imageController.updateImage);
// router.get("/find/:userId", getPic)

router.post("/new", imageController.addPic);
router.delete("/deleteImage/:id", imageController.deleteImage);
router.get("/img/:id/:encode", imageController.getOnePic);

module.exports = router;
