const Users = require('./Users');
const Posts = require('./Posts')

module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define("Likes", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    // Likes.belongsTo(Users, {
    //     foreignKey: 'userId',
    //     allowNull: false,
    // });
    // Likes.belongsTo(Posts, {
    //     foreignKey: 'userId',
    //     allowNull: false,
    // });
    return Likes;
};