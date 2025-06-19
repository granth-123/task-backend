import Joi from 'joi'

export const companyValidate=(company)=>{
    const schema=Joi.object({
        businessName: Joi.string().min(2).max(100).required(),
        address: Joi.string().min(5).required(),
        userRef: Joi.string().hex().length(24).required(),
        GSTIN: Joi.string().trim(),
        PAN: Joi.string().trim(),
        incorporationDate: Joi.date(),
        CIN: Joi.string().trim(),
        activeAddress: Joi.string().trim(),
        registerAddress: Joi.string().trim(),
        state: Joi.string().trim(),
        city: Joi.string().trim(),
        applicationId: Joi.array().items(Joi.string().hex().length(24))
    });
    return schema.validate(company);
};