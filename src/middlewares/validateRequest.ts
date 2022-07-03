import type { RequestHandler } from "express";
import { ObjectSchema } from "joi";

const validateRequest = (schema: ObjectSchema) => {
  const handler: RequestHandler = (req, res, next) => {
    const valid = schema.validate(req.body);
    if (valid.error) {
      res
        .status(422)
        .json({
          error: "Validation failed",
        })
        .end();
    } else {
      next();
    }
  };

  return handler;
};

export { validateRequest };
