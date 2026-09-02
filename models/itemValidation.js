const Joi = require("joi");

const itemSchema = Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    category: Joi.string().required(),

    type: Joi.string()
        .valid("Lost", "Found")
        .required(),

    location: Joi.string().required(),

    date: Joi.date().required()
});

module.exports = itemSchema;