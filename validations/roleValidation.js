
import Joi from 'joi';

export const validateRole = (role) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required()
  });
  
  return schema.validate(role);
};