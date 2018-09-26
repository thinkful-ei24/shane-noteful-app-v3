'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Note = require('../models/note');
const Folder = require('../models/folder');
const Tag = require('../models/tags');
const User = require('../models/users');

const { users, notes, folders, tags } = require('../db/seed/data');
// const { folders } = require('../db/seed/folders');
// const { tags } = require('../db/seed/tags');

console.info('Connecting to:', MONGODB_URI);
mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
  .then(() => {
    console.info('Dropping Database');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    console.info('Seeding Database');
    return Promise.all([
      User.insertMany(users),
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Tag.insertMany(tags),
      Folder.createIndexes(),
      Tag.createIndexes()
    ]);
  })
  .then(() => {
    console.info('Disconnecting');
    return mongoose.disconnect();
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
