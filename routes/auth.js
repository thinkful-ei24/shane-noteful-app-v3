const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);

const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

function createAuthToken (user) {
  console.log(user);
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  console.log(authToken);
  res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

module.exports = router;