const Joi = require("joi");

const createCustomerValidation = (data) => {
    const validateCustomerSchema = Joi.object({
        surname: Joi.string().min(3).required().messages({
          "string.empty": `"surname" cannot be empty`,
          "string.min": `"surname" should have a minimum length of {#limit}`,
          "any.required": `"surname" field is required`,
        }),
        other_names: Joi.string().min(3).required().messages({
            "string.empty": `"other_names" cannot be empty`,
            "string.min": `"other_names" should have a minimum length of {#limit}`,
            "any.required": `"other_names" field is required`,
          }),
    
        email: Joi.string().email().required().messages({
          "string.empty": `"email" cannot be empty`,
          "string.email": `"email" must be a valid email`,
          "any.required": `"email" field is required`,
        }),
    
        phone: Joi.string().messages({
          "string.empty": `"phone" cannot be empty`,
          "any.required": `"phone" field is required`,
        }),
        password: Joi.string().min(8).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required().messages({
          "string.empty": `"password" cannot be empty`,
          "string.min": `"password" should have a minimum length of {#limit}`,
          "string.pattern.base": `"password" should include at least one uppercase letter, one lowercase letter, one number, and one special character`,
          "any.required": `"password" field is required`,
        }), 
        password_confirmation: Joi.string().valid(Joi.ref('password')).required().messages({
          "any.only": `"password confirmation" does not match "password"`,
          "any.required": `"password confirmation" field is required`,
        })
      });
      const {error} = validateCustomerSchema.validate(data);
      return error
}

const validateVerificationData = (data) => {
  const validateVerificationDataSchema =  Joi.object({
    email: Joi.string().email().required(),
otp: Joi.string().required()
  })
  const {error} = validateVerificationDataSchema.validate(data)
  return error

}

const emailAndPasswordValidation = (data) => {
  const emailAndPasswordValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
const {error} = emailAndPasswordValidationSchema.validate(data)
return error
}

const emailValidation = (data) => {
  const emailValidationSchema = Joi.object({
    email: Joi.string().email().required()
  })
const {error} = emailValidationSchema.validate(data)
return error
}

const changePasswordValidation = (data) => {
const  changePasswordValidationSchema = Joi.object({
  old_password: Joi.string().required().messages({
    "string.empty": `"old_password" cannot be empty`,
    "any.required": `"old_password" field is required`,
  }),
    new_password: Joi.string().min(8).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required().messages({
    "string.empty": `"password" cannot be empty`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "string.pattern.base": `"password" should include at least one uppercase letter, one lowercase letter, one number, and one special character`,
    "any.required": `"password" field is required`,
  }), 
  password_confirmation: Joi.string().valid(Joi.ref('new_password')).required().messages({
    "any.only": `"password confirmation" does not match "new_password"`,
    "any.required": `"password confirmation" field is required`,
  })
})
const {error} = changePasswordValidationSchema.validate(data);
return error
}

const completeForgotPasswordValidation = (data) => {
  const completeForgotPasswordValidationSchema = Joi.object({
    otp: Joi.required().messages({
      "any.required": `"otp" field is required`,
    }), 
    email: Joi.string().email().required().messages({
      "string.empty": `"email" cannot be empty`,
      "string.email": `"email" must be a valid email`,
      "any.required": `"email" field is required`,
    }),
    new_password: Joi.string().min(8).pattern(new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])")).required().messages({
      "string.empty": `"password" cannot be empty`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "string.pattern.base": `"password" should include at least one uppercase letter, one lowercase letter, one number, and one special character`,
      "any.required": `"password" field is required`,
    }), 
    password_confirmation: Joi.string().valid(Joi.ref('new_password')).required().messages({
      "any.only": `"password confirmation" does not match "new_password"`,
      "any.required": `"password confirmation" field is required`,
    })
  });
  const {error} = completeForgotPasswordValidationSchema.validate(data);
  return error
}

const updateProfileValidation = (data) => {
  const validateUpdateProfileSchema = Joi.object({
      surname: Joi.string().min(3).messages({
        "string.empty": `"surname" cannot be empty`,
        "string.min": `"surname" should have a minimum length of {#limit}`,
      }),
      other_names: Joi.string().min(3).messages({
        "string.empty": `"other_names" cannot be empty`,
        "string.min": `"other_names" should have a minimum length of {#limit}`,
      }),
      phone: Joi.string().min(11).max(14).messages({
        "string.empty": `"phone" cannot be empty`,
        "string.min": `"phone" should have a minimum length of {#limit}`,
        "string.max": `"phone" should have a maximum length of {#limit}`,
      }),
    }).or("surname","other_names","phone");
    const { error} = validateUpdateProfileSchema.validate(data);
   return error
  } 

module.exports = {
    createCustomerValidation, 
    validateVerificationData,
    emailAndPasswordValidation,
    emailValidation,
    completeForgotPasswordValidation,
    updateProfileValidation,
    changePasswordValidation
}