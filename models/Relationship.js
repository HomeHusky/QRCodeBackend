const Users = require('./Users');

module.exports = (sequelize, DataTypes) => {
    const Relationships = sequelize.define("Relationships", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        followerUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        followedUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    // Relationships.belongsTo(Users, {
    //     foreignKey: 'followerUserId',
    //     allowNull: false,
    // });
    // Relationships.belongsTo(Users, {
    //     foreignKey: 'followedUserId',
    //     allowNull: false,
    // });
    return Relationships;
};