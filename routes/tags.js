const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Tag = require('../models/tags');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

// GET
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;

  let filter = {};

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

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findById(id)
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
  const newTag = {
    name: "test tag",
  };

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

  const updateFolder = { name };

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

  Tag.findByIdAndUpdate(id, updateFolder, { new: true })
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

  if(!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('the `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Tag.findByIdAndRemove(id, { $unset: { name: '' }})
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;