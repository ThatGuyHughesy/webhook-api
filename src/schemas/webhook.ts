import Joi from "joi";

const webhookSchema = Joi.object({
  url: Joi.string().uri().required(),
  token: Joi.string().required(),
});

export { webhookSchema };
