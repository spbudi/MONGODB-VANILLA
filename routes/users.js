var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')
// const moment = require('moment')

module.exports = (db) => {
  const collection = db.collection('todos');

  router.get('/', async function (req, res, next) {

    const page = req.query.page || 1
    const limit = 5
    const values = {}
    const offset = page * limit - limit

    if(req.query.string){
      values['string'] = new RegExp(`${req.query.string}`, 'i')
    }
    if (req.query.integer) {
      values['integer'] = parseInt(req.query.integer)
    }
    if (req.query.float) {
      values['float'] = JSON.parse(req.query.float)
    }
    if(req.query.fromdate && req.query.todate){
      values['date'] = {
        $gte: new Date(`${req.query.fromdate}`),
        $lte: new Date(`${req.query.todate}`),
      }
    } else if(req.query.fromdate){
      values['date'] = {$gte: new Date(`${req.query.fromdate}`)}
    } else if(req.query.todate){
      values['date'] = {$gte: new Date(`${req.query.todate}`)}
    }
    if(req.query.boolean){
      values['boolean'] = (req.query.boolean)
    }

    try {
      const collection = db.collection('todos')
      const totalData = await collection.find(values).count()
      const totalPages = Math.ceil(totalData / limit)
      const limitation = { limit: parseInt(limit), skip: offset}

      const breads = await collection.find(values, limitation).toArray()

      res.status(200).json({
        data: breads,
        totalData,
        totalPages,
        display: limit,
        page: parseInt(page)
      })
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
