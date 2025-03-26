const Joi = require("joi");

const expenseSchema = Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().integer().required(),
    date: Joi.date().iso().required(),
    category: Joi.string().valid('food', 'transport', 'utilities', 'entertainment', 'other').required()
});

module.exports = expenseSchema;