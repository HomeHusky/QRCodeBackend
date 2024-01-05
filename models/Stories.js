const Users = require('./Users');

module.exports = (sequelize, DataTypes) => {
    const Stories = sequelize.define("Stories", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        img: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    // Stories.belongsTo(Users, {
    //     foreignKey: 'userId',
    //     allowNull: false,
    // });
    return Stories;
};