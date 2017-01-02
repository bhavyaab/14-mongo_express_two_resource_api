'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const List = require('../model/list.js');
const debug = require('debug')('note:note-route');
const Note = require('../model/note.js');
const createError = require('http-errors');


const noteRouter = module.exports = new Router();

noteRouter.post('/api/list/:listID/note', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:listID/note');
  List.findByIdAndAddNote(req.params.listID, req.body)
  .then( note => res.json(note))
  .catch(next);
});

noteRouter.get('/api/list/:listID/note', jsonParser, function(req, res, next){
  debug('GET: /api/list/:listID/note');

  List.findById(req.params.listID)
  .populate('notes')
  .then( list => res.json(list.notes))
  .catch(next);
});

noteRouter.get('/api/list/:listID/note/:id', jsonParser, function(req, res, next){
  debug('GET: /api/list/:listID/note/:id');

  List.findByIdAndGetNote (req.params.listID, req.params.id)
  .then(note => {
    if(note) return res.json(note);
    if(!note) return next(createError(404, 'not found'));
  })
  .catch(next);
});

noteRouter.put('/api/list/:listID/note/:id', jsonParser, function(req, res, next){
  debug('PUT: /api/list/:listID/note/:id');

  List.findByIdAndGetNote (req.params.listID, req.params.id)
  .then(note => {
    Note.findByIdAndUpdate(note._id, req.body, {new: true})
    .then( note => res.json(note))
    .catch(next);
  })
  .catch(next);
});

noteRouter.delete('/api/list/:listID/note/:id', jsonParser, function(req, res, next){
  debug('DELETE: /api/list/:listID/note/:id');
  if(!req.params.listID) return next(createError(400, 'listID expected'));
  List.findByIdAndGetNote(req.params.listID, req.params.id)
  .then(note => {
    Note.findByIdAndRemove(note._id, function (err, note){
      var response = {
        message: 'Note successfully deleted',
        id: note._id
      };
      res.send(response);
    });
  })
  .catch(next);
});
