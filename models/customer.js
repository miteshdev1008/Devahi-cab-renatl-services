const mon=require('mongoose');
require('../dbo.js');

//creating a schema
const vehicle=new mon.Schema({
    //name:{type:String},
    pickupAddress:{type:String},
    dropAddress:{type:String},
    startDate:{type:String},
    endDate:{type:String},
    pasangerNo:{type:String},
    email:{type:String},
    phoneNo:{type:String},
    message:{type:String},
    selectedcar:{type:String},
    paymentDone:{type:Number,default:0}
},{timestamps:true});


//exporting a schema
module.exports=mon.model('inquiry',vehicle);
