const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Tag = require('../models/tags');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// GET
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const userId = req.user.id;

  let filter = { userId: userId };

  if(searchTerm) {
    filter.name = { $regex: searchTerm, $options: 'i' };
  }

  Tag.find(filter)
    .sort({ name: 'Asc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// GET by ID

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findOne({ userId: userId, _id: id })
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});


// POST
router.post('/', (req, res, next) => {
  const { name } = req.body;
  const userId = req.user.id;

  const newTag = { name, userId };

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Tag.create(newTag)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      if(err.code === 11000) {
        err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

// PUT
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.id;

  const updateFolder = { name, userId };

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if(!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  Tag.findOneAndUpdate({ userId: userId, _id: id }, updateFolder, { new: true })
    .then(result => {
      if(result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      if(err.code === 11000){
        const err = new Error('The tag name already exists');
        err.status = 400;
      }
      next(err);
    });
});

// DELETE

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('the `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findOneAndRemove({ userId: userId, _id: id }, { $unset: { name: '' }})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;