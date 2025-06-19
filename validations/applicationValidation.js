import Joi from 'joi';

export const validateApplication=(application)=>{
    const schema=Joi.object({
        applicationId:Joi.string().required().length(10).alphanum(),
        status:Joi.string().valid('pending','approved','rejected').default('pending'),
        companyRef:Joi.string().hex().length(24).required(),
        referredBy:Joi.string().trim(),
        applicationNo:Joi.string().required
    });
    return schema.validate(application);
};
