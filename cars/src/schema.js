const Joi = require("joi")


const schemaCars = Joi.object({
    module : Joi.string().min(2).max(20).required(),
    year : Joi.string().required(),
    color : Joi.string().optional()
})


const schemaUser = Joi.object({
    login : Joi.string().min(3).max(20).required(),
    password : Joi.string().required(),
    fullname : Joi.string().optional()
})


module.exports = {schemaCars, schemaUser}