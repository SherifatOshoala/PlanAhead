const express = require ('express')
const router = express.Router()
const {authorisation} = require('../middlewares/authorisation.js')
const {createTodo, getTodo, getTodos, updateTodo, deleteTodo} = require('../controllers/todo.controllers')

router.post('/todos',authorisation, createTodo)

router.get('/todo/:id',authorisation, getTodo )

router.get('/todos',authorisation, getTodos)

router.patch('/todo/:id',authorisation, updateTodo)

router.delete('/todo/:id',authorisation, deleteTodo)

module.exports = router