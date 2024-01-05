const express = require("express");
const app = express();
var cors = require('cors')
const db = require("./models");
require('dotenv').config();
const multer = require("multer");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/users.js");
const postRoutes = require("./routes/posts.js");
const picRoutes = require("./routes/pics.js")
const commentRoutes = require("./routes/comments.js");
const likeRoutes = require("./routes/likes.js");
const relationshipRoutes = require("./routes/relationships.js");
const slugify = require('slugify');
const os = require('os');

// Lấy địa chỉ IP của máy tính
const networkInterfaces = os.networkInterfaces();
//middlewares
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.DOMAIN_SERVER); // Thay bằng origin của bạn
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: [process.env.DOMAIN_CLIENT, process.env.DOMAIN_CLIENT_IP],
        // origin: '*',
        optionsSuccessStatus: 200
    })
);
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: (req, file, cb) => {
        const randomNumber = Math.floor(Math.random() * 1000); // Số ngẫu nhiên từ 0 đến 999
        const fileName = `${Date.now()}_${randomNumber}.jpg`; // hoặc sử dụng phần mở rộng của file được gửi lên
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pics", picRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server run in " + process.env.PORT + "!");
    });
});