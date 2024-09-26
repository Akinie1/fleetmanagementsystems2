const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');


// This creates a new schema object, we are creating the schema(the structure of the object)

// Mongoose is also used to error handling
const userModelSchema = new Schema({    
email: {
    type : String, 
    required : [true,'Please enter an email'],
    unique: true,
    lowercase:true,
    validate: [isEmail,'Please enter a valid email address'] // using the validator package to handle wrong email address.
},
Password : {
    type : String, 
    // required : [true,'Please enter a password'],
    // minlength :[6, 'Minimum password length is a 6 characters']
},

confirmPassword : {
    type : String, 
    // required : [true,'Please confirm your password.'],
    // minlength :[6, 'Minimum password length is a 6 characters']
},


telephone :  {
    type : String, 
    // required : [true,"Please enter your high school name."],
     },
},
// This is an option object from Schema constructor.
{
    timestamps: true
}
);


//creating the model based on the schema so we could use methods and properties from that model.

const userModel = mongoose.model('user',userModelSchema); // mongoose is going to look for the plural of techChat on the database.

module.exports = userModel;
