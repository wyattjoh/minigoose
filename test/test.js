const {expect} = require('chai');
const Joi = require('joi');

const {Model, Schema} = require('../lib');

describe('Schema', () => {
  const userSchema = new Schema({
    id: Joi.string().required(),
    name: Joi.string().required(),
    roles: Joi.string().valid(['ADMIN', 'MODERATOR']),
    color: Joi.string().default('blue')
  });

  describe('#assign', () => {
    [
      {user: {id: '123', name: 'Wyatt', color: 'blue'}, input: {id: '123', name: 'Wyatt', pcormac: 'mac'}},
      {user: {color: 'red'}, input: {color: 'red'}},
      {user: {color: 'blue'}, input: {}}
    ].forEach(({user, input}) => {

      it(`assigns user=${JSON.stringify(user)} from input=${JSON.stringify(input)}`, () => {
        let ctx = {};

        userSchema.assign(ctx, input);

        expect(ctx).to.deep.equal(user);
      });

    });
  });

  describe('#validate', () => {
    [
      {user: {}, error: true},
      {user: {id: '1'}, error: true},
      {user: {id: '1', name: 'Wyatt', roles: 'CAPTAIN'}, error: true},
      {user: {id: '1', name: 'Wyatt', color: 'red'}, error: false},
      {user: {id: '1', name: 'Wyatt', roles: 'ADMIN', color: 'blue'}, error: false},
    ].forEach(({user, error}) => {

      it(`validates user=${JSON.stringify(user)} error=${error}`, () => {
        if (error) {
          return userSchema
            .validate(user)
            .catch((err) => {
              expect(err).to.not.be.null;
              expect(err).to.not.be.undefined;
            })
            .then((value) => {
              expect(value).to.be.undefined;
            });
        }

        return userSchema
          .validate(user)
          .then((value) => {
            expect(value).to.not.be.undefined;
            expect(value).to.deep.equal(user);
          });
      });

    });
  });
});

describe('Model', () => {
  describe('#constructor', () => {
    [
      {name: 'User', error: true, collection_name: 'users'},
      {name: 'Asset', error: true, collection_name: 'assets'},
      {name: 'Action', error: true, collection_name: 'actions'},
      {name: 'User', schema: new Schema({}), error: false, collection_name: 'users'},
      {name: 'Asset', schema: new Schema({}), error: false, collection_name: 'assets'},
      {name: 'Action', schema: new Schema({}), error: false, collection_name: 'actions'}
    ].forEach(({name, schema, error, collection_name}) => {

      it(error ? 'does not construct the Model' : 'constructs the Model', () => {
        if (error) {
          expect(new Model(name, schema)).to.throw();
        } else {
          expect(new Model(name, schema)).not.to.throw();
        }
      });

      if (!error) {

        it('has the correct collection name', () => {
          const model = new Model(name, schema);

          expect(model).to.have.property('collection_name', collection_name);
        });

        it('has the correct name', () => {
          const model = new Model(name, schema);

          expect(model).to.have.property('name', name);
        });

      }

    });
  });
});
