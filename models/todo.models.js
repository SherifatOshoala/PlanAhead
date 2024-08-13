const {DataTypes} = require("sequelize")
const sequelize = require('../config/sequelize.js')

const Todo = sequelize.define('Todo', {
  sn: {
    type: DataTypes.INTEGER,
    unique: true,
    autoIncrement: true
  },
  todo_id: {
    type: DataTypes.STRING(50),
    primaryKey: true
},
  customer_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'Customers', 
      key: 'customer_id',
    },
  },
  todo_name: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false
  },
  todo_description: {
    type: DataTypes.STRING(255),
    allowNull: true, 
  },
  todo_status: {
    type: DataTypes.ENUM('pending', 'completed'),
    allowNull: false,
    defaultValue: 'pending', 
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true, 
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
  tableName: 'Todo', 
  timestamps: false,
  indexes: [
    {
      name: 'idx_todo_status', 
      fields: ['todo_status'], 
    },
    {
      name: 'idx_is_deleted', 
      fields: ['is_deleted'], 
    },
  ],
});

module.exports = Todo;
