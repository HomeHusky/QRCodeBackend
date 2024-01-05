const jwt = require("jsonwebtoken");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');

const getRelationships = async (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = @followedUserId";

  const values = [{ name: 'followedUserId', type: TYPES.Int, value: req.query.followedUserId }];

  const pool = await sql.connect(config);

  try {
    const result = await pool.request()
      .input('followedUserId', TYPES.Int, req.query.followedUserId)
      .query(q);

    return res.status(200).json(result.recordset.map(relationship => relationship.followerUserId));
  } catch (err) {
    return res.status(500).json(err);
  } finally {
    await pool.close();
  }
};

const addRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO relationships (followerUserId, followedUserId) VALUES (@followerUserId, @followedUserId)";

    const values = [
      { name: 'followerUserId', type: TYPES.Int, value: userInfo.id },
      { name: 'followedUserId', type: TYPES.Int, value: req.body.userId }
    ];

    const pool = await sql.connect(config);

    try {
      await pool.request()
        .input('followerUserId', TYPES.Int, userInfo.id)
        .input('followedUserId', TYPES.Int, req.body.userId)
        .query(q);

      return res.status(200).json("Following");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

const deleteRelationship = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM relationships WHERE followerUserId = @followerUserId AND followedUserId = @followedUserId";

    const values = [
      { name: 'followerUserId', type: TYPES.Int, value: userInfo.id },
      { name: 'followedUserId', type: TYPES.Int, value: req.query.userId }
    ];

    const pool = await sql.connect(config);

    try {
      await pool.request()
        .input('followerUserId', TYPES.Int, userInfo.id)
        .input('followedUserId', TYPES.Int, req.query.userId)
        .query(q);

      return res.status(200).json("Unfollow");
    } catch (err) {
      return res.status(500).json(err);
    } finally {
      await pool.close();
    }
  });
};

module.exports = {
  getRelationships,
  addRelationship,
  deleteRelationship
}