const Joi = require('joi');

const validateTodo = (todo) => {
    const  todoSchema = Joi.object({    
        todo_name: Joi.string().min(3).required().messages({
            "string.empty": `"todo_name" cannot be empty`,
            "string.min": `"todo_name" should have a minimum length of {#limit}`,
          "any.required": `"todo_name" field is required`, 
        }),
        todo_description: Joi.string().messages({
            "string.empty": `"surname" cannot be empty`
        }),
    })
    const {error} = todoSchema.validate(todo)
    return error
}

updateTodoValidation = (todo) => {
    const  todoSchema = Joi.object({    
        todo_name: Joi.string().min(3).messages({
            "string.empty": `"todo_name" cannot be empty`,
            "string.min": `"todo_name" should have a minimum length of {#limit}`,
        }),
        todo_description: Joi.string().messages({
            "string.empty": `"todo_description" cannot be empty`
        }),
        todo_status: Joi.string().valid("pending", "completed").messages({
            "string.empty": `"todo_status" cannot be empty`,
            "any.only": `"todo_status" must be one of ['pending', 'completed']`
        })
    })
    const {error} = todoSchema.validate(todo)
    return error
}
module.exports = { validateTodo, updateTodoValidation }