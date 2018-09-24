const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/users');

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password, fullName } = req.body;
  const newUser = { username, password, fullName}


  if(!username) {
    const err = new Error('Missing `username` in request body');
    err.status = 400;
    return next(err);
  };
  if(!password) {
    const err = new Error('Missing `password` in request body');
    err.status = 400;
    return next(err);
  };
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        fullName
      };
      return User.create(newUser);
    })
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