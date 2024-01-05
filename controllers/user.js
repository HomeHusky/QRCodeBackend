const jwt = require("jsonwebtoken");
const sql = require("mssql");
const config = require('../config/config');

const getUser = async (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=@userId";
  try {
    const pool = await new sql.ConnectionPool(config).connect();
    const result = await pool.request().input('userId', sql.Int, userId).query(q);
    await sql.close();

    if (result.recordset.length === 0) {
      return res.status(404).json("User not found!");
    }
    console.log(userId);
    const { password, ...info } = result.recordset[0];
    return res.json(info);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};

const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET [name]=@name, [city]=@city, [website]=@website, [profilePic]=@profilePic, [coverPic]=@coverPic WHERE id=@userId";

    try {
      const pool = await new sql.ConnectionPool(config).connect();
      const result = await pool.request()
        .input('name', sql.NVarChar, req.body.name)
        .input('city', sql.NVarChar, req.body.city)
        .input('website', sql.NVarChar, req.body.website)
        .input('profilePic', sql.NVarChar, req.body.profilePic)
        .input('coverPic', sql.NVarChar, req.body.coverPic)
        .input('userId', sql.Int, userInfo.id)
        .query(q);

      await sql.close();

      if (result.rowsAffected[0] > 0) {
        return res.json("Updated!");
      } else {
        return res.status(403).json("You can update only your post!");
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json(err.message);
    }
  });
};

module.exports = {
  getUser,
  updateUser
};
