const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');

const getComments = async (req, res) => {
  const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = @postId ORDER BY c.createdAt DESC`;

  const values = [{ name: 'postId', type: TYPES.Int, value: req.query.postId }];

  const pool = await sql.connect(config);

  try {
    const result = await pool.request()
      .input('postId', TYPES.Int, req.query.postId)
      .query(q);

    return res.status(200).json(result.recordset);
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    await pool.close();
  }
};

const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO comments ([desc], createdAt, userId, postId) VALUES (@desc, @createdAt, @userId, @postId)";

    const values = [
      { name: 'desc', type: TYPES.VarChar, value: req.body.desc },
      { name: 'createdAt', type: TYPES.DateTime, value: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") },
      { name: 'userId', type: TYPES.Int, value: userInfo.id },
      { name: 'postId', type: TYPES.Int, value: req.body.postId }
    ];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
        .input('desc', TYPES.VarChar, req.body.desc)
        .input('createdAt', TYPES.DateTime, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
        .input('userId', TYPES.Int, userInfo.id)
        .input('postId', TYPES.Int, req.body.postId)
        .query(q);

      return res.status(200).json("Comment has been created.");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const deleteComment = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE id = @commentId AND userId = @userId";

    const values = [
      { name: 'commentId', type: TYPES.Int, value: commentId },
      { name: 'userId', type: TYPES.Int, value: userInfo.id }
    ];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
        .input('commentId', TYPES.Int, commentId)
        .input('userId', TYPES.Int, userInfo.id)
        .query(q);

      if (result.rowsAffected[0] > 0) {
        return res.status(200).json("Comment has been deleted!");
      } else {
        return res.status(403).json("You can delete only your comment!");
      }
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

module.exports = {
  getComments,
  addComment,
  deleteComment
}