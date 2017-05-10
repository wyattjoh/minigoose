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
  Model.collection = async function() {
    let db = await mongo;

    return db.collection(Model.collection_name);
  };

  /**
   * Executes a find operation against the mongo connection and maps the results
   * to the underlying model.
   * @param  {Object} query the query document
   * @return {Promise}      resolves to an array of results
   */
  Model.find = async function(query) {
    let c = await Model.collection();

    let docs = await c.find(query).toArray();
    
    return docs.map((doc) => new Model(doc));
  };

  /**
   * Executes a findOne operation against the mongo connection and wraps result
   * to the underlying model.
   * @param  {Object} query the query document
   * @return {Promise}      resolves to the document found by the query or null
   *                        if not found
   */
  Model.findOne = async function(query) {
    let c = await Model.collection();

    let doc = await c.findOne(query);

    return doc ? new Model(doc) : null;
  };

  /**
   * Executes a insert operation against the mongo connection by first
   * validating the underlying model and using it's result to insert, if an
   * error is thrown, no document will be inserted.
   * @param  {Model} doc the document to insert
   * @return {Promise}    resolves to the document inserted
   */
  Model.insert = async function(doc) {
    await schema.validate(doc);

    let c = await Model.collection();

    await c.insert(doc);
    
    return doc;
  };

  /**
   * A convenience function which executes a pipeline operation against
   * validating the underlying model and using it's result to insert, if an
   * error is thrown, no document will be inserted.
   * @param  {Array}   pipeline the aggregation pipeline
   * @return {Promise}          resolves to the results of the aggregation
   */
  Model.aggregate = async function(pipeline) {
    let c = await Model.collection();

    return c.aggregate(pipeline).toArray();
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
