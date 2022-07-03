import Joi from "joi";

const payloadSchema = Joi.object({
  payload: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
});

export { payloadSchema };
