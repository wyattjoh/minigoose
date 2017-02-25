const Joi = require('joi');

/**
 * A schema provides some convenience functions for managing the validation and
 * assignment states of properties on a document.
 * @param {Object} schema the schema object containing Joi/vanilla validations.
 */
function Schema(schema) {
  this.schema = Joi.compile(schema);
}

/**
 * Used internally to perform validations of properties. Only defined properties
 * will be set by this and this will not return an error.
 * @param  {Object} ctx the document to assign the variables onto
 * @param  {Object} doc the source document to validate/parse and set onto the
 *                      ctx
 */
Schema.prototype.assign = function(ctx, doc) {
  const {value} = Joi.validate(doc, this.schema, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  Object.assign(ctx, value);
};

/**
 * Used internally or externally to perform validations of a given model based
 * on it's schema definition.
 * @param  {Object} ctx the document with the variables assigned on it
 * @return {Promise}    resolves with the cleaned object or throw an error
 */
Schema.prototype.validate = function(ctx) {
  return new Promise((resolve, reject) => {
    Joi.validate(ctx, this.schema, {
      convert: false,
      allowUnknown: false
    }, (err, value) => {
      if (err) {
        return reject(err);
      }

      resolve(value);
    });
  });
};

module.exports = Schema;
