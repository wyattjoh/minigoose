const pluralize = require('pluralize');

/**
 * Creates a new Mongo model that is capable of performing validations on input
 * models to ensure consistency.
 * @param {String}  name   the name of the model to be created and used to set
 *                         the class name
 * @param {Schema}  schema the constructed Schema for the model
 * @param {Promise} mongo  the promise for which returns the database, created
 *                         by calling MongoClient.connect(...) which will be
 *                         used directly to perform database actions
 */
function Model(name, schema, mongo) {

  /**
   * Model constructor.
   * @param {Object} obj the data to store on the object itself, strict to the
   *                     schema of course.
   */
  function Model(obj) {
    schema.assign(this, obj);
  }

  /**
   * Returns the database collection for the model.
   * @return {Promise} resolves to the database collection
   */
  Model.collection = function() {
    return mongo.then((db) => db.collection(Model.collection_name));
  };

  /**
   * Executes a find operation against the mongo connection and maps the results
   * to the underlying model.
   * @param  {Object} query the query document
   * @return {Promise}      resolves to an array of results
   */
  Model.find = function(query) {
    return Model.collection()
      .then((collection) => collection.find(query).toArray())
      .then((docs) => docs.map((doc) => new Model(doc)));
  };

  /**
   * Executes a findOne operation against the mongo connection and wraps result
   * to the underlying model.
   * @param  {Object} query the query document
   * @return {Promise}      resolves to the document found by the query or null
   *                        if not found
   */
  Model.findOne = function(query) {
    return Model.collection()
      .then((collection) => collection.findOne(query))
      .then((doc) => doc ? new Model(doc) : null);
  };

  /**
   * Executes a insert operation against the mongo connection by first
   * validating the underlying model and using it's result to insert, if an
   * error is thrown, no document will be inserted.
   * @param  {Model} doc the document to insert
   * @return {Promise}    resolves to the document inserted
   */
  Model.insert = function(doc) {
    return schema
      .validate(doc)
      .then(() => Model.collection())
      .then((collection) => collection.insert(doc))
      .then(() => doc);
  };

  /**
   * A convenience function which executes a pipeline operation against
   * validating the underlying model and using it's result to insert, if an
   * error is thrown, no document will be inserted.
   * @param  {Array}   pipeline the aggregation pipeline
   * @return {Promise}          resolves to the results of the aggregation
   */
  Model.aggregate = function(pipeline) {
    return Model.collection()
      .then((collection) => collection.aggregate(pipeline).toArray());
  };

  // Assign the pretty name passed into the Model constructor.
  Object.defineProperty(Model, 'name', {writable: true});
  Model.name = name;
  Object.defineProperty(Model, 'name', {writable: false});

  // Set the collection name to be the pluralized lowercased name.
  Model.collection_name = pluralize(name.toLowerCase());

  // Save a copy of the schema on the model.
  Model.schema = schema;

  return Model;
}

module.exports = Model;
