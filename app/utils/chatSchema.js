const Joi = require('joi');
const schema = Joi.object({
    message: Joi.string()
        .alphanum()
        .min(1)
        .max(20000),

})

module.exports = schema;