module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        permission: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: "user"
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(50),
        },
        coverPic: {
            type: DataTypes.STRING(100),
            defaultValue: "defaultAvatar.jpg"
        },
        profilePic: {
            type: DataTypes.STRING(100),
            defaultValue: "defaultAvatar.jpg"
        },
        city: {
            type: DataTypes.STRING(50),
            defaultValue: ""
        },
        website: {
            type: DataTypes.STRING(50),
            defaultValue: ""
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
    });
    return Users;
};