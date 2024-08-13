const express = require ('express')
const router = express.Router()
const {createTodo, getTodo, getTodos, updateTodo, deleteTodo} = require('../controllers/todo.controllers')

router.post('/todos/:customer_id', createTodo)

router.get('/todo/:id', getTodo )

router.get('/todos', getTodos)

router.patch('/todo/:id', updateTodo)

router.delete('/todo/:id', deleteTodo)

module.exports = router