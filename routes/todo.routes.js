const express = require ('express')
const router = express.Router()
const {createTodo, getTodo, getTodos, updateTodo, deleteTodo} = require('../controllers/todo.controllers')

router.post('/todos/:customer_id', createTodo)

router.get('/todo/:id/:customer_id', getTodo )

router.get('/todos/:customer_id', getTodos)

router.patch('/todo/:id/:customer_id', updateTodo)

router.delete('/todo/:id/:customer_id', deleteTodo)

module.exports = router