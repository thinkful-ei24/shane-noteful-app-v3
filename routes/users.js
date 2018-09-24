const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/users');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password, fullName } = req.body;
  const newUser = {
    username: "username",
    password: "password",
    fullName: "Joe Smith"
  };

  if(!name) {
    const err = new Error('Missing `username` in request body');
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
        err = new Error('The user already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;