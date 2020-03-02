module.exports = function(app) {
    var todoList = require('../controllers/contactsController');
  
    // contacts Routes
    app.route('/contacts')
      .get(todoList.getAllContacts)
      .post(todoList.createContact);
     
     app.route('/contacts/:id')
      .get(todoList.readContact)
      .put(todoList.updateContact)
      .delete(todoList.deleteContact);
      
      app.route('/search').get(todoList.getContact)

      };

  