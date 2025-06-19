import Joi from 'joi';

export const validateUser=(user)=>{
const schema=Joi.object({
    name:Joi.string().min(2).max(50).required().pattern(/^[a-zA-Z\s]+$/).messages({
    'string.pattern.base': 'Name must only contain letters.'
  }),
    email:Joi.string().email().trim().lowercase().required(),
    password:Joi.string().min(5).trim().required(),
    roleRef: Joi.array().items(Joi.string().hex().length(24)),
    designation: Joi.string().optional()
});
return schema.validate(user);
}
