const {DataTypes} = require("sequelize")
const sequelize = require('../config/sequelize.js')

const Customers = sequelize.define('Customers', {
    sn: {
      type: DataTypes.INTEGER,
      unique: true,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.STRING(50),
      primaryKey: true
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    other_names: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true,
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    password_salt: {
      type: DataTypes.STRING(255),
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
    tableName: 'Customers', 
    timestamps: false,
  });
  
  module.exports = Customers;