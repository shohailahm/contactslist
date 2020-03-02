var Contact = require('../model/contactsModel.js');

exports.getAllContacts = function(req, res) {
  Contact.getAllContacts(function(err, task) {

    console.log('controller')
    if (err)
      res.send(err);
     // console.log('res', task);
    res.send(task);
  });
};



exports.createContact = function(req, res) {
  var new_task = new Contact(req.body);
   console.log("new",req.body);
  //handles null error 
   if(!new_task.name || !new_task.phone){

            res.status(400).send({ error:true, message: 'Please provide name/phone' });

        }
else{
  
    Contact.createContact(new_task, function(err, task) {
    
    if (err)
      res.send(err);
    res.json(task);
  });
}
};


exports.readContact = function(req, res) {
    Contact.getContactById(req.params.id, function(err, task) {
    if (err){
      res.send(err);
    }

       res.json(task);
  });
};


exports.updateContact = function(req, res) {
    Contact.updateById(req.params.id, new Contact(req.body), function(err, task) {
    if (err)
      res.send(err);
    res.json({message:'Updated successfully!'});
  });
};


exports.deleteContact = function(req, res) {

    console.log("delete",req.params);
    Contact.remove( req.params.id, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Contact successfully deleted' });
  });
};