const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config');

const Note = require('../models/note');

// FIND ALL
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    const searchTerm = 'lady gaga';
    let filter = {};
    let re = new RegExp(searchTerm, 'gi')

    if (searchTerm) {
      filter = {
        $or: [{
          title: re
        }, {
          content: re
        }]
      };
    }

    return Note.find(filter).sort({
      updatedAt: 'desc'
    });
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// FIND BY ID
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    const searchId = '5ba14dc17798eb02658c6c54';

    return Note.findById(searchId);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// CREATE
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    const newNote = {
      title: 'New Note',
      content: 'New Content'
    };
    return Note.create(newNote);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// UPDATE
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    const noteId = '5ba14dc17798eb02658c6c54';
    const updateNote = {
      title: 'Update Note2',
      content: 'Update Content2'
    }
    return Note.findOneAndUpdate({
      _id: noteId
    }, updateNote);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });

// DELETE
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(() => {
    const noteId = '5ba14dc17798eb02658c6c54';

    return Note.findByIdAndRemove(noteId);
  })
  .then(results => {
    console.log(results);
  })
  .then(() => {
    return mongoose.disconnect()
  })
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });