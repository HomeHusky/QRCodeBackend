const jwt = require("jsonwebtoken");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');

const getLikes = async (req, res) => {
  const q = "SELECT userId FROM likes WHERE postId = @postId";

  const values = [{ name: 'postId', type: TYPES.Int, value: req.query.postId }];

  const pool = await sql.connect(config);

  try {
    const result = await pool.request()
      .input('postId', TYPES.Int, req.query.postId)
      .query(q);

    return res.status(200).json(result.recordset.map(like => like.userId));
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    await pool.close();
  }
};

const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO likes (userId, postId) VALUES (@userId, @postId)";

    const values = [
      { name: 'userId', type: TYPES.Int, value: userInfo.id },
      { name: 'postId', type: TYPES.Int, value: req.body.postId }
    ];

    const pool = await sql.connect(config);

    try {
      await pool.request()
        .input('userId', TYPES.Int, userInfo.id)
        .input('postId', TYPES.Int, req.body.postId)
        .query(q);

      return res.status(200).json("Post has been liked.");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM likes WHERE userId = @userId AND postId = @postId";

    const values = [
      { name: 'userId', type: TYPES.Int, value: userInfo.id },
      { name: 'postId', type: TYPES.Int, value: req.query.postId }
    ];

    const pool = await sql.connect(config);

    try {
      await pool.request()
        .input('userId', TYPES.Int, userInfo.id)
        .input('postId', TYPES.Int, req.query.postId)
        .query(q);

      return res.status(200).json("Post has been disliked.");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

module.exports = {
  getLikes,
  addLike,
  deleteLike
}