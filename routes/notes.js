'use strict';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Note = require('../models/note');

const router = express.Router();

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const { searchTerm, folderId, tagId  } = req.query;
  const userId = req.user.id;

  let filter = { userId: userId };

  if (searchTerm) {
    filter.title = { $regex: searchTerm, $options: 'i' };
  }

  if (folderId) {
    filter.folderId = folderId;
  }

  if (tagId) {
    filter.tagId = tagId;
  }

  Note.find(filter)

    .sort({ updatedAt: 'desc' })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findOne({ userId: userId, _id: id })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {
  const { title, content, folderId, tags } = req.body;
  const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  if (mongoose.Types.ObjectId.isValid(folderId) && !folderId.userId === userId) {
    const err = new Error('The `folderId` is not valid');
    err.status(400);
    return next(err);
  }

  if (!typeof tags === 'array'){
    tags.forEach(item => {
      if (mongoose.Types.ObjectId.isValid(item) && item.userId === userId) {
        next();
      }
    });
    const err = new Error('The `tagId` is not valid');
    err.status = 400;
    return next(err);
  }

  const newNote = { title, content, folderId, tags, userId };


  Note.create(newNote)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { title, content, folderId, tags } = req.body;
  const userId = req.user.id;

  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  if (!title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }


  if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
    const err = new Error('The `folderId` is not valid');
    err.status = 400;
    return next(err);
  }

  console.log("id", typeof tags);
  if (tags && typeof tags !== 'object'){
    const err = new Error('The `tagId` iis not valid');
    err.status = 400;
    return next(err);
  } else {
    tags.forEach(item => {
      console.log("item: ", item);
      if (!mongoose.Types.ObjectId.isValid(item)) {
        const err = new Error('A `tagId` is not valid');
        err.status = 400;
        return next(err);
      }
    });
  }

  const updateNote = { title, content, folderId, tags, userId };

  Note.findOneAndUpdate({ userId: userId, _id: id }, updateNote, { new: true })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  /***** Never trust users - validate input *****/
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Note.findOneAndRemove({ userId: userId, _id: id })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;