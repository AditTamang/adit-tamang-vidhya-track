import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10-15 digits",
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
  role: Joi.string().valid("student", "teacher", "parent").required().messages({
    "any.only": "Role must be one of 'student', 'teacher', or 'parent'",
  }),
  className: Joi.string().optional().allow(null, ""),
  section: Joi.string().optional().allow(null, ""),
  status: Joi.string()
    .valid("active", "pending", "approved", "rejected")
    .optional()
    .messages({
      "any.only":
        "Status must be one of 'active', 'pending', 'approved', 'rejected'",
    }),
});

const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSimpleSchema = Joi.object({
  email: Joi.string().email().required(),
  newPassword: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one number, and one special character",
    }),
});

export const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

export const validateVerifyOTP = (req, res, next) => {
  const { error } = verifyOTPSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  }
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { error } = resetPasswordSimpleSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};
