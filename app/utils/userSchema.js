const Joi = require('joi');
const schema = Joi.object({
    name: Joi.string()
        .min(4)
        .max(16),

    username: Joi.string()
        .alphanum()
        .min(4)
        .max(16),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    type: Joi.string()
        .min(4)
        .max(16),

    os: Joi.string()
        .min(4)
        .max(20),

})

module.exports = schema;