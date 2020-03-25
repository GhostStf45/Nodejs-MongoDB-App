const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');
router.get('/notes/add', isAuthenticated ,(req, res)=>{
    res.render('notes/new-note');
});
//********************CRUD NOTE SYSTEM*************/


//Create note
router.post('/notes/new-note',isAuthenticated , async (req, res)=>{
  const {title, description } =req.body;
  const errors = [];
  //Validations
  if(!title){
      errors.push({
          text:'Please, write a title'
      });
  }
  if(!description){
    errors.push({
        text:'Please, write a description'
    });
  }
  if(errors.length > 0){
      res.render('notes/new-note', {
          errors,
          title,
          description
      });
  }else{
      //Save data
    const newNote = new Note({ title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/notes');
  }
    
});

// get all notes
router.get('/notes', isAuthenticated , async (req,res)=>{
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});
//Edit note
router.get('/notes/edit/:id',isAuthenticated , async (req, res)=>{
   const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
});
//update note
router.put('/notes/edit-note/:id',isAuthenticated , async (req, res)=>{
    const {title, description }=req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Note Update Successfully');
    res.redirect('/notes');
});
//delete note
router.delete('/notes/delete/:id',isAuthenticated , async (req, res)=>{
   await Note.findByIdAndDelete(req.params.id);
   req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');
});
/************END CRUD*****************/
module.exports = router;