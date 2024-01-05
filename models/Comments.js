const { Users } = require('./Users');
const { Posts } = require('./Posts')

module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        desc: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
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

    // Comments.belongsTo(Users, {
    //     foreignKey: 'userId',
    //     allowNull: false,
    // });
    // Comments.belongsTo(Posts, {
    //     foreignKey: 'postId',
    //     allowNull: false,
    // });
    return Comments;
};