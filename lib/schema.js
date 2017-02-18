function Schema(schema) {
  this.schema = schema;

  this.validations = [];

  Object.keys(schema).forEach((key) => {
    if (schema[key].required !== undefined && schema[key].required === true) {
      this.validations.push({key, validation: (val) => {
        if (val === undefined || val === null) {
          return Promise.reject(new Error(`${key} was required`));
        }

        return Promise.resolve();
      }});
    }

    if (schema[key].enum !== undefined) {
      this.validations.push({key, validation: (val) => {
        if (schema[key].enum.indexOf(val) === -1) {
          return Promise.reject(new Error(`${val} is not in ${schema[key].enum}`));
        }

        return Promise.resolve();
      }});
    }
  });
}

Schema.prototype.assign = function(ctx, doc) {
  Object.keys(this.schema).forEach((key) => {
    if (key in doc) {
      ctx[key] = doc[key];
    } else if (this.schema[key].default !== undefined) {
      if (typeof this.schema[key].default === 'function') {
        ctx[key] = this.schema[key].default();
      } else {
        ctx[key] = this.schema[key].default;
      }
    }
  });
};

Schema.prototype.validate = function(ctx) {
  return Promise.all(this.validations.map(({key, validation}) => validation(ctx[key], ctx)));
};

module.exports = Schema;
