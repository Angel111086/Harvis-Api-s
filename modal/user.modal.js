var mysql = require('mysql');
const pool = require('../authorization/pool');
const passwordHash = require('password-hash');

// constructor
const User = function(user, file) {   
  this.user_name = user.user_name;
  this.user_email = user.user_email;     
  this.user_mobile = user.user_mobile;   
  this.user_image = file;   
  this.statusId = user.statusId;
  this.createdById = user.createdById;  
  this.creationDate = user.creationDate;
  this.modifiedById = user.modifiedById;
  this.modificationDate = user.modificationDate;
};

User.createUser = function (user, result) {     
    pool.query("INSERT INTO user SET ?", user, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"User Details Saved Successfully.", id:res.insertId});

            }
        });           
};

User.updateUser = function(id,user,result) {
    var update_query, value;
    pool.query(`select * from user where user_id=${id}`,function(err, data){
        if(err){
            console.log(err);
            result(err, null);
        }
        else{
            console.log(data.length);
            if(data.length>0)
            {
                if(user.user_image !== undefined){
                    update_query = `update user SET user_email=?, user_mobile=?,user_image=?, modifiedById=?, 
                    modificationDate=? where user_id=?`;

                    value = [user.user_email, user.user_mobile, user.user_image,user.modifiedById,
                    user.modificationDate, id];
                }
                else{
                    update_query = `update user SET user_email=?, user_mobile=?, modifiedById=?, 
                    modificationDate=? where user_id=?`;

                    value = [user.user_email, user.user_mobile,user.modifiedById,
                    user.modificationDate, id];
                }
                pool.query(update_query, value, function (err, res) 
                {
                    if(err) 
                    {
                        console.log(err);
                        result(err, null);
                    }
                    else
                    {                       
                            result(null, {status:200,success:true,message:"Details Updated Successfully."});
            
                    }
                });

            }

        }
    });
}

User.getAllUsers = function (result) {       
    pool.query(`select * from user Where statusId=1`, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{                       
                result(null, res);

            }
        });           
};

User.changePassword = function (id,password, result) {  
    var pass = password;
    var hashedPassword = passwordHash.generate(pass);
    password = hashedPassword;      
    pool.query(`update user SET user_password=? where user_id=${id}`, password, function (err, res) {
            if(err) {
                console.log(err);
                result(err, null);
            }
            else{
                console.log(res.insertId);         
                result(null, {status:200,success:true,message:"User Password Updated Successfully."});

            }
        });           
};

module.exports = User;