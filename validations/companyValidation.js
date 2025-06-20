import Joi from 'joi'

export const companyValidate=(company)=>{
    const schema=Joi.object({
        businessName: Joi.string().min(2).max(100).trim().required(),
        address: Joi.string().min(5).trim().required(),
        userRef: Joi.string().hex().length(24).trim().required(),
         GSTIN: Joi.string()
        .trim()
        .length(15)
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/)
        .required()
        .messages({
            'string.length':  'GSTIN must be exactly 15 characters',
            'string.pattern.base': 'GSTIN must follow the official format (e.g. 29ABCDE1234F2Z5)'
        }),
        PAN: Joi.string()
        .trim()
        .length(10)
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)
        .required()
        .messages({
            'string.length':     'PAN must be exactly 10 characters',
            'string.pattern.base': 'PAN must follow the official format (e.g. ABCDE1234F)'
        }),
        CIN: Joi.string()
        .trim()
        .length(21)
        .pattern(/^[A-Z0-9]{21}$/)
        .required()
        .messages({
            'string.length':     'CIN must be exactly 21 characters',
            'string.pattern.base': 'CIN must be 21 uppercase alphanumeric characters'
        }),
        incorporationDate: Joi.date(),
        activeAddress: Joi.string().trim(),
        registerAddress: Joi.string().trim(),
        state: Joi.string().trim(),
        city: Joi.string().trim(),
        applicationId: Joi.array().items(Joi.string().hex().length(24))
    });
    return schema.validate(company);
};