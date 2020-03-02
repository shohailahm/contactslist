var sql = require('../db.js');


 const redis = require('../index');

//Contact object constructor
const Contact = function(task){
    this.name = task.name;
    this.email = task.email;
    this.phone =task.phone;
};


Contact.createContact = function (newTask, result) {   
        sql.query("Select COUNT(*) as count from contacts where  email= ? OR phone = ?",[newTask.email,newTask.phone],function(err,res){
            if(err)
            return result(err);
           
          if(res[0].count>0){
           return result(null, {id:null,success:false,message:'already exists'});
          }else{
            sql.query("INSERT INTO contacts set ?", newTask, function (err, res) {
                
                if(err) {
                    
                    result(err, null);
                }
                else{
                    
                    result(null, {id:res.insertId,success:true,message:'added successfully'});
                }
            });   
          }
        }) 
              
};


Contact.getContactById = function (taskId, result) {
      let data=checkCache(taskId,result);
      if(data)
      return result(null,data);

        sql.query("Select * from contacts where id = ? ", taskId, function (err, res) {             
                if(err) {
                    
                    result(err, null);
                }
                else{
                    //setting in redis
                    redis.redis_client.setex(taskId, 1000*60*5 , JSON.stringify(res));
                    result(null, res);
              
                }
            });   
};
Contact.getAllContacts = function (result) {
        sql.query("Select * from contacts", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                 result(null, res);
                }
            });   
};
Contact.updateById = function(id, task, result){
  sql.query("UPDATE contacts SET name = ?,email =? ,phone=? WHERE id = ?", [task.name,task.email,task.phone, id], function (err, res) {
          if(err) {
              console.log("error: ", err);
                result(null, err);
             }
           else{   
           
             result(null, res);
                }
            }); 
};
Contact.remove = function(id, result){
     sql.query("DELETE FROM contacts WHERE id = ?", [id], function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
               
                 result(null, res);
                }
            }); 
};

Contact.search=function(body, result){
  console.log("body",body);
  sql.query(`Select * from contacts where email like '%${body.value}%' OR name like '%${body.value}%' OR phone like '%${body.value}%' `, [body], function (err, res) {

             if(err) {
                 console.log("error: ", err);
                 result(null, err);
             }
             else{
              console.log("res: ", res);
              result(null, res);
             }
         }); 
};


const checkCache = (id, res) => {
    
    redis.redis_client.get(id, (err, data) => {
      if (err) {
        console.log(err);
      // return err;
      }
      //if no match found
      if (data != null) {
          // console.log("redis",data);
       return JSON.parse(data);
      } else {
        //proceed to next middleware function
        // next();
      }
    });
  };

module.exports= Contact;