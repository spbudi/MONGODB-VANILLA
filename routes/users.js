var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')
// const moment = require('moment')

module.exports = (db) => {
  const collection = db.collection('todos');

  router.get('/', async function (req, res, next) {
    try {
      const findResult = await collection.find({}).toArray();
      res.status(200).json(findResult);
    } catch (err) {
      res.json(err);
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const insertResult = await collection.insertOne({string: req.body.string, integer: req.body.integer, float: req.body.float, date: req.body.date, boolean: req.body.boolean});
      res.status(201).json(insertResult);
    } catch (err) {
      res.json(err);
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const updateResult = await collection.updateOne({_id: ObjectId(req.params.id)}, {$set: {string: req.body.string, integer: req.body.integer , float: req.body.float, date: req.body.date, boolean: req.body.boolean}});
      res.status(201).json(updateResult);
    } catch (err) {
      res.json(err);
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const deleteResult = await collection.deleteOne({_id: ObjectId(req.params.id)});
      res.status(201).json(deleteResult);
    } catch (err) {
      res.json(err);
    }
  });

  return router;
};
