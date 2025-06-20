// import Joi from 'joi';

// export const applicationValidate=(application)=>{
//     const schema=Joi.object({
//         // applicationId:Joi.string().required().length(10).alphanum(),
//         status:Joi.string().valid('pending','approved','rejected').default('pending').trim(),
//         companyRef:Joi.string().hex().length(24).required(),
//         referredBy:Joi.string().trim(),
//         applicationNo:Joi.string().required.trim()
//     });
//     return schema.validate(application);
// };
import Joi from 'joi';
export const applicationValidate = (application) => {
  const schema = Joi.object({
    companyRef: Joi.string().hex().length(24).required(),
    referredBy: Joi.string().valid('Amazon', 'Zomato', 'Data Scraping', 'Marketing').required(),
    financeType: Joi.string().valid('FTL', 'RBF', 'SID').required(),
    leadSource: Joi.string().valid('Referral', 'Website', 'DirectScouting', 'Event').required()
  });

  return schema.validate(application);
};
