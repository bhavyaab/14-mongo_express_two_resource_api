
'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const List = require('../model/list.js');
const Note = require('../model/note.js');

require('../server.js');

const url = 'http://localhost:3000/api/list';

const exampleNote = {
  name: 'test note',
  content: 'test note content'
};

const exampleList = {
  name: 'example list',
  timestamp: new Date()
};

describe('Note Routes', function() {
  describe('POST: /api/list/:listID/note', function() {
    describe('with a valid list id and note body', () => {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          List.findByIdAndRemove(this.tempList._id),
        ])
        .then(() => done())
        .catch(done);
      });

      it('should post a note', done => {
        request.post(`${url}/${this.tempList.id}/note`)
        .send(exampleNote)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal(exampleNote.name);
          expect(res.body.listID).to.equal(this.tempList._id.toString());
          done();
        });
      });
    });
  });
  describe('GET: /api/list/:listID/note', function(){
    describe(' it will return notes of one list', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          console.log('this- ', this);
          exampleNote.listID = list._id;
        })
        .then( exampleNote => {
          new Note(exampleNote).save()
          .then(note => {
            this.tempNote = note;
            done();
          });
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList){
          Promise.all([
            List.findByIdAndRemove({}),
            Note.findByIdAndRemove(this.tempNote._id)
          ])
        .then( () => done())
        .catch(done);
        }
      });

      it('should get all the note in one list', done => {
        console.log('GET this.tempNotes = ',this.tempNotes);
        request.get(`${url}/${this.tempList._id}/note`)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
      it('should get one the note of one list', done => {
        request.get(`${url}/${this.tempList._id}/note/${this.tempNote._id}`)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  describe('PUT: /api/list/:listID/note/:id', function(){
    describe('it will return notes of one list', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          exampleNote.listID = list._id;
          new Note(exampleNote).save()
          .then( note => {
            this.tempNote = note;
          });
          this.tempList = list;
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList){
          Promise.all([
            List.findByIdAndRemove(this.tempList._id),
            Note.findByIdAndRemove(this.tempNote._id)
          ])
        .then( () => done())
        .catch(done);
        }
      });
      it('should update one the note of one list', done => {
        request.put(`${url}/${this.tempList._id}/note/${this.tempNote._id}`)
        .send({name:'new name'})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          console.log('note- ', res.body);
          done();
        });
      });
    });
  });
  describe('DELETE: /api/list/:listID/note', function(){
    describe(' it will return notes of one list', function() {
      before( done => {
        new List(exampleList).save()
        .then( list => {
          this.tempList = list;
          exampleNote.listID = list._id;
          new Note(exampleNote).save()
          .then( note => {
            this.tempNote = note;
          });
          done();
        })
        .catch(done);
      });

      after( done => {
        if(this.tempList){
          Promise.all([
            List.findByIdAndRemove({}),
          ])
        .then( () => done())
        .catch(done);
        }
      });

      it('should delete the note in one list', done => {
        console.log('tempNote-',this.tempNotes);
        request.delete(`${url}/${this.tempList._id}/note/${this.tempNotes._id}`)
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

});
