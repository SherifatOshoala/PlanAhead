const Todo = require('../models/todo.models');
const Customers = require("../models/customers.model.js");
const messages = require("../messages");
const { validateTodo, updateTodoValidation } = require('../validations/todo.validations')
const { v4: uuidv4 } = require('uuid'); 
const { Op, fn, col } = require('sequelize');

const createTodo = async(req, res) => {
  const id = req.params.customer_id
    const { todo_name, todo_description  } = req.body
    try{
        const checkCustomer = await Customers.findOne({where:{customer_id:id}})
        if(checkCustomer == null) throw new Error(messages.customerExistsNot)
    
    const validate = validateTodo(req.body)
    if(validate != undefined) throw new Error(error.details[0].message)
    const checkIfTodoExist = await Todo.findOne({where:{ todo_name: todo_name} })
    if(checkIfTodoExist != null ) throw new Error(messages.todoExists)
    await Todo.create({
        todo_id: uuidv4(),
        customer_id: id,
        todo_name: todo_name,
        todo_description: todo_description || null
    })
    res.status(200).json({
        status: true,
        message: messages.todoCreated
    })
}catch(error){
    res.status(400).json({
        status: false,
        message: error.message
    })
}
}

const getTodo = async(req, res) => {
  try {
      const {id, customer_id} = req.params;
     const getTodo = await Todo.findOne({where:{todo_id:id, customer_id:customer_id, is_deleted:false}})

            if (getTodo) {
            delete getTodo.dataValues.is_deleted
            delete getTodo.dataValues.deleted_at}
            
            res.status(200).json({
              success: true,
              message:messages.getTodo ,
              data: getTodo
            });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

const getTodos = async (req, res) => {
  const id = req.params.customer_id
let { search } = req.query
    try {
      if (search) {
        search = search.toLowerCase()
       const getTodosBySearch = await Todo.findAll({where:
        {[Op.or]: [
          fn('LOWER', col('todo_name')), { is_deleted:false, customer_id:id, todo_name: { [Op.like]: `%${search}%` } },
          fn('LOWER', col('todo_description')), { is_deleted:false,customer_id:id, todo_description: { [Op.like]: `%${search}%`}},
          fn('LOWER', col('todo_status')),{ is_deleted:false, customer_id:id, todo_status: { [Op.like]: `%${search}%`} },
        ] }})
         res.status(200).json({
                status: true,
                message: messages.getTodos,
                data: getTodosBySearch[0].dataValues
              });
          }
    else {
  const getTodos = await Todo.findAll({where:{is_deleted:false, customer_id:id}})
       res.status(200).json({
                status: true,
                message: messages.getTodos,
                data: getTodos
              });
          }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}

const updateTodo = async(req, res) => {
  try {
  
const {id,customer_id} = req.params;
const todo = await Todo.findOne({where: {todo_id:id, customer_id: customer_id,is_deleted:false}})
if(!todo) throw new Error ('failed!')
const { todo_name, todo_description, todo_status} = req.body;
    const validate = updateTodoValidation(req.body)
    if(validate != undefined){
      throw new Error(validate.details[0].message)
    }
    let keys = {}; // in a bid not to expose req.body

    if (todo_name) {
     keys.todo_name= todo_name
    }
    if (todo_description) {
     keys.todo_description = todo_description
    }
    if (todo_status) {
    keys.todo_status = todo_status
    }

const updateTodo = await Todo.update(keys, {where:{todo_id:id}})

          if (updateTodo[0] == 0) throw new Error(messages.noChangeDetected);
          else {
            res.status(200).json({
              status: true,
              message: messages.updateTodo,
              data: keys
            });
          }
      }
      catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}

const deleteTodo = async (req, res) => {
const {id, customer_id} = req.params
try{
const todo = await Todo.update({is_deleted: true}, {where:{todo_id:id, customer_id:customer_id}})
if(todo[0] ==0) throw new Error ('failed')
res.status(200).json({
  status: true,
  message: messages.todoDeleted
})}
catch(error){
  res.status(500).json({
    status: false,
    message: error.message
  })
}

}
module.exports = {
    createTodo,
    getTodo,
    getTodos,
    updateTodo,
    deleteTodo
}