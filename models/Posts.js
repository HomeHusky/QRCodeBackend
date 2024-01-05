const Users = require('./Users');

module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        desc: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },

    });

    // Posts.belongsTo(Users, {
    //     foreignKey: 'userId',
    //     allowNull: false,
    // });
    return Posts;
};