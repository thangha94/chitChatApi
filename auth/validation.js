import Joi from '@hapi/joi';

// Register Validate
const registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(4).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  }).options({
    abortEarly: false,
    errors: {
      wrap: {
        label: ' ',
      },
    },
  });
  return schema.validate(data);
};
export default registerValidation;
