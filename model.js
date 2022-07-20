var mongoose = require('mongoose'); 
  
var dumbledoresArmySchema = new mongoose.Schema({  
    firstName: String,
    lastName: String,
    house: String 
}); 
  
module.exports = new mongoose.model('DumbledoresArmy', dumbledoresArmySchema);