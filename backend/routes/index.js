module.exports = function(app) {
    var todoList = require('../controllers/contactsController');
  
    // todoList Routes
    app.route('/contacts')
      .get(todoList.getAllContacts)
      .post(todoList.createContact);
     
     app.route('/contacts/:id')
      .get(todoList.readContact)
      .put(todoList.updateContact)
      .delete(todoList.deleteContact);
      };