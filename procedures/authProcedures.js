const config = require("../config/config");
const sql = require('mssql');
// Import model

// Một ví dụ về stored procedure trong MySQL
const login = (nguoidungObj) => {
    return new Promise((resolve, reject) => {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
                .input('username', sql.VarChar, nguoidungObj.username)
                .execute('SELECT * FROM users WHERE username = @username')
        }).then(result => {
            sql.close();
            resolve(result.returnValue);
        }).catch(err => {
            console.log(err)
            sql.close();
            reject(err)
        });
    });
};

const Nguoidung_Checknguoidung_byHethongvatendangnhapvamatkhau = (nguoidungObj) => {
    return new Promise((resolve, reject) => {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request()
                .input('TEN_DANGNHAP', sql.VarChar, nguoidungObj.TEN_DANGNHAP)
                .input('MAT_KHAU', sql.VarChar, nguoidungObj.MAT_KHAU)
                .execute('Nguoidung_Checknguoidung_byHethongvatendangnhapvamatkhau')
        }).then(result => {
            sql.close();
            resolve(result.returnValue);
        }).catch(err => {
            console.log(err)
            sql.close();
            reject(err)
        });
    });
}

// Một ví dụ về stored procedure trong MySQL
const Nguoidung = async () => {
    try {
        const [results, metadata] = await sequelize.query('Nguoidung_CheckNguoiDungTontai_byTendangnhap(:param1, :param2)', {
            replacements: { param1: 'value1', param2: 'value2' },
            type: Sequelize.QueryTypes.RAW,
        });

        console.log(results);
    } catch (error) {
        console.error("Error executing stored procedure:", error);
    }
};

module.exports = {
    login,
    Nguoidung
}