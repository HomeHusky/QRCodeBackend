const express = require("express");
const { getPic, addPic } = require("../controllers/pic.js");

const router = express.Router();

router.get("/pic", getPosts);
router.post("/addPic", addPost);
// router.delete("/:id", deletePost);

module.exports = router;
