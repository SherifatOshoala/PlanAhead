const {DataTypes} = require("sequelize")
const sequelize = require('../config/sequelize.js')


const OTP = sequelize.define('OTP', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'email'
      }
    },
    otp: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
      allowNull: false,
      onUpdate: DataTypes.NOW, 
    },
  }, {
    tableName: 'OTP', 
    timestamps: false,

  });
  
  module.exports = OTP;