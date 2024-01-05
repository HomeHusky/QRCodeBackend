const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config/config');
const sql = require('mssql');
const { Users } = require('../models');
const authProcedure = require('../procedures/authProcedures');

const AuthController = {
  async register(req, res) {
    const pool = await new sql.ConnectionPool(config).connect();

    const username = req.body.username;

    const result = await pool
      .request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username', { username: username });
    if (result.recordset.length) {
      res.status(409).json("User has been created!");
      return;
    }

    const user = req.body;
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    await Users.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
      name: user.name
    })
      .then((createdUser) => {
        console.log('User created:', createdUser);
        return res.status(200).json("User has been created.");
      })
      .catch((err) => {
        console.error('Error creating user:', err);
        return res.status(500).json(err);
      });
  },

  async login(req, res) {
    try {
      const pool = await new sql.ConnectionPool(config).connect();

      const username = req.body.username;

      const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM users WHERE username = @username', { username: username });
      if (result.recordset.length === 0) {
        res.status(404).json("Tài khoản không chính xác!");
        return;
      }

      const checkPassword = bcrypt.compareSync(req.body.password, result.recordset[0].password);

      if (!checkPassword) {
        res.status(400).json("Mật khẩu không chính xác!");
        return;
      }

      const token = jwt.sign({ id: result.recordset[0].id }, "secretkey");

      const { password, ...others } = result.recordset[0];
      // console.log(result.recordset);
      res
        .cookie("accessToken", token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    } catch (err) {
      console.error(err);
      res.status(500).json(err.message);
    } finally {
      await sql.close();
    }
  },

  async logout(req, res) {
    res.clearCookie("accessToken", {
      secure: true,
      sameSite: "none"
    }).status(200).json("User has been logged out.")
  }
}

module.exports = AuthController