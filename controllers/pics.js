const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require('../config/config');
const sql = require('mssql');
const { Request, TYPES } = require('mssql');
const Images = require("../models/Images");
const crypto = require('crypto');
const secretKey = process.env.SERVER_SECRETKEY;

function encodeMessage(message, secretKey) {
    const hash = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
    return hash;
}

function decodeMessage(encodedMessage, secretKey) {
    // Decoding is not possible with a hash function like SHA-256
    // Instead, you should compare the encoded message with freshly encoded message
    // using the same secret key to verify if they match
}

const imageController = {

    async getOnePic(req, res) {

        const imageId = req.params.id;
        const encode = req.params.encode;
        // console.log(imageId);
        // console.log(encode);
        try {
            await sql.connect(config);

            const result = await sql.query`
            SELECT * FROM Images WHERE id = ${imageId};
            `;
            // console.log(result.recordset[0].qrImage);
            if (result) {
                if (encode === result.recordset[0].qrImage) {
                    res.status(200).json({ result: result.recordset });
                } else {
                    res.status(401).json({ message: 'Xác thực thất bại!' });
                }
                return;
            } else {
                res.status(404).json({ message: 'Không tìm thấy ảnh.' });
                return;
            }
        } catch (error) {
            console.error('Lỗi khi get ảnh:', error);
            res.status(500).json({ message: 'Lỗi khi get ảnh.' });
            return;
        }
    },

    async getAllPics(req, res) {
        try {
            const pool = await new sql.ConnectionPool(config).connect();

            // Lấy tất cả hình ảnh từ cơ sở dữ liệu bằng Sequelize
            const result = await pool
                .request()
                .query('SELECT * FROM images', {});
            // Trả về dữ liệu cho client
            // console.log(result.recordset);
            res.status(200).json({ result: result.recordset });
        } catch (error) {
            console.error('Error getting images:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async addPic(req, res) {
        // console.log("Insert Data:");
        // console.log(req.body);

        const { author, title, description, img, imgLabel, creator, updator } = req.body;
        const plainTextData = "Img:" + img;

        const encodedMessage = encodeMessage(plainTextData, secretKey);
        // console.log('Encoded Message:', encodedMessage);
        try {
            const pool = await new sql.ConnectionPool(config).connect();

            const result = await pool.request()
                .input('author', sql.NVarChar, author)
                .input('title', sql.NVarChar, title)
                .input('description', sql.NVarChar, description)
                .input('img', sql.NVarChar, img)
                .input('imgLabel', sql.NVarChar, imgLabel)
                .input('creator', sql.Int, creator)
                .input('updator', sql.Int, updator)
                .input('qrData', sql.NVarChar, encodedMessage)
                .query(`
                    INSERT INTO Images 
                    (author, title, description, img, imgLabel, creator, updator, qrImage, createdAt, updatedAt) 
                    VALUES 
                    (@author, @title, @description, @img, @imgLabel, @creator, @updator, @qrData, GETDATE(), GETDATE())
                `);

            res.status(201).json({ message: 'Dữ liệu đã được insert thành công.' });

        } catch (error) {
            console.error('Lỗi khi insert dữ liệu:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi insert dữ liệu.' });
        }
    },

    async updateImage(req, res) {
        // console.log(req.body);
        const imageId = req.body.imageId;
        const updatedData = req.body.updatedData;

        try {
            const pool = await new sql.ConnectionPool(config).connect();

            const imageChangeData = await pool.query`
            SELECT img FROM Images WHERE id = ${imageId};
            `;
            // console.log(imageChangeData.recordset[0].img);

            if (imageChangeData.recordset[0].img !== updatedData.img) {
                console.log("Image changed!");
                const plainTextData = "Img:" + updatedData.img;

                const encodedMessage = encodeMessage(plainTextData, secretKey);
                // console.log('Encoded Message:', encodedMessage);
                const result = await pool.request()
                    .input('author', sql.NVarChar, updatedData.author)
                    .input('title', sql.NVarChar, updatedData.title)
                    .input('description', sql.NVarChar, updatedData.description)
                    .input('img', sql.NVarChar, updatedData.img)
                    .input('imgLabel', sql.NVarChar, updatedData.imgLabel)
                    .input('qrData', sql.NVarChar, encodedMessage)
                    .input('updator', sql.Int, updatedData.updator)
                    .input('imageId', sql.Int, imageId)
                    .query(`
                        UPDATE Images
                        SET
                        author = @author,
                        title = @title,
                        description = @description,
                        img = @img,
                        imgLabel = @imgLabel,
                        qrImage = @qrData,
                        updator = @updator
                        WHERE id = @imageId
                    `);

                if (result.rowsAffected[0] === 1) {
                    res.status(200).json({ message: 'Update thành công. Có generate QR mới!' });
                } else {
                    res.status(404).json({ message: 'Không tìm thấy ảnh cần cập nhật.' });
                }
            }
            else {
                console.log("Image not change!")
                const result = await pool.request()
                    .input('author', sql.NVarChar, updatedData.author)
                    .input('title', sql.NVarChar, updatedData.title)
                    .input('description', sql.NVarChar, updatedData.description)
                    .input('imgLabel', sql.NVarChar, updatedData.imgLabel)
                    .input('updator', sql.Int, updatedData.updator)
                    .input('imageId', sql.Int, imageId)
                    .query(`
                        UPDATE Images
                        SET
                        author = @author,
                        title = @title,
                        description = @description,
                        imgLabel = @imgLabel,
                        updator = @updator
                        WHERE id = @imageId
                    `);

                if (result.rowsAffected[0] === 1) {
                    res.status(201).json({ message: 'Update thành công. Vẫn giữ QR như cũ!' });
                } else {
                    res.status(404).json({ message: 'Không tìm thấy ảnh cần cập nhật.' });
                }
            }

        } catch (error) {
            console.error('Lỗi khi cập nhật ảnh:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật ảnh.' });
        }
    },

    async deleteImage(req, res) {
        const id = req.params.id;

        try {
            await sql.connect(config);
            const result = await sql.query`DELETE FROM Images WHERE id = ${id}`;
            res.json({ success: true, message: "Image deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}

module.exports = imageController;

