const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');

const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    //console.log(userId);

    const pool = await sql.connect(config);

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = @userId ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= @followerUserId OR p.userId = @userId
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [{ name: 'userId', type: TYPES.Int, value: userId }] : [
        { name: 'followerUserId', type: TYPES.Int, value: userInfo.id },
        { name: 'userId', type: TYPES.Int, value: userInfo.id }
      ];
    try {
      const result = await pool.request()
        .input('userId', TYPES.Int, userId)
        .input('followerUserId', TYPES.Int, userInfo.id)
        .query(q);

      return res.status(200).json(result.recordset);
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts ([desc], img, createdAt, userId) VALUES (@desc, @img, @createdAt, @userId)";

    const values = [
      { name: 'desc', type: TYPES.VarChar, value: req.body.desc },
      { name: 'img', type: TYPES.VarChar, value: req.body.img },
      { name: 'createdAt', type: TYPES.DateTime, value: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") },
      { name: 'userId', type: TYPES.Int, value: userInfo.id }
    ];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
        .input('desc', TYPES.VarChar, req.body.desc)
        .input('img', TYPES.VarChar, req.body.img)
        .input('createdAt', TYPES.DateTime, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
        .input('userId', TYPES.Int, userInfo.id)
        .query(q);

      return res.status(200).json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE id = @postId AND userId = @userId";

    const values = [
      { name: 'postId', type: TYPES.Int, value: req.params.id },
      { name: 'userId', type: TYPES.Int, value: userInfo.id }
    ];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
        .input('postId', TYPES.Int, req.params.id)
        .input('userId', TYPES.Int, userInfo.id)
        .query(q);

      if (result.rowsAffected[0] > 0) {
        return res.status(200).json("Post has been deleted.");
      } else {
        return res.status(403).json("You can delete only your post");
      }
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

module.exports = {
  getPosts,
  addPost,
  deletePost
}
