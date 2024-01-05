module.exports = (sequelize, DataTypes) => {
    const Images = sequelize.define("Images", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        author: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(2400),
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: "null.png",
        },
        imgLabel: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: "null",
        },
        qrImage: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        creator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "null"
        },
        updator: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "null"
        }
    });

    return Images;
};