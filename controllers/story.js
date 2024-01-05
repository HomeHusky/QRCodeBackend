const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');

const getStories = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT s.*, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId= @followerUserId) LIMIT 4`;

    const values = [{ name: 'followerUserId', type: TYPES.Int, value: userInfo.id }];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
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

const addStory = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO stories (img, createdAt, userId) VALUES (@img, @createdAt, @userId)";

    const values = [
      { name: 'img', type: TYPES.VarChar, value: req.body.img },
      { name: 'createdAt', type: TYPES.DateTime, value: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") },
      { name: 'userId', type: TYPES.Int, value: userInfo.id }
    ];

    const pool = await sql.connect(config);

    try {
      await pool.request()
        .input('img', TYPES.VarChar, req.body.img)
        .input('createdAt', TYPES.DateTime, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"))
        .input('userId', TYPES.Int, userInfo.id)
        .query(q);

      return res.status(200).json("Story has been created.");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const deleteStory = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE id = @storyId AND userId = @userId";

    const values = [
      { name: 'storyId', type: TYPES.Int, value: req.params.id },
      { name: 'userId', type: TYPES.Int, value: userInfo.id }
    ];

    const pool = await sql.connect(config);

    try {
      const result = await pool.request()
        .input('storyId', TYPES.Int, req.params.id)
        .input('userId', TYPES.Int, userInfo.id)
        .query(q);

      if (result.rowsAffected[0] > 0) {
        return res.status(200).json("Story has been deleted.");
      } else {
        return res.status(403).json("You can delete only your story!");
      }
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

module.exports = {
  getStories,
  addStory,
  deleteStory
}