const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerVehicleSchema = new Schema({
// properties.
ownerName : {
    type: String,
    required: true
},

vehicleBrand : {
    type: String,
    required: true
},

registrationNumber : {
    type: String,
    required: true
},

color : {
    type: String,
    required: true
},

vehicleType : {
    type: String,
    required: true
},

vehicleModel : {
    type: String,
    required: true
},

manufactureYear : {
    type: Number,
    required: true
},

},{timestamps:true})

// let's create the model
const RegisterVehicles = mongoose.model('registerVehicle',registerVehicleSchema);

module.exports = RegisterVehicles;