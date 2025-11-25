import Joi from "joi";

//JOI is used for the input validations
//This is the object based schema validation
const userScheme = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
});

export const validateUser = (req, res, next) => {
  const { error } = userScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      //400 is the bad request
      status: 400,
      message: error.details[0].message,
    });
  next();
};
