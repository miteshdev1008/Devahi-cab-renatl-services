const mon=require('mongoose');
require('../dbo.js');

//creating a schema
const vehicle=new mon.Schema({
    //name:{type:String},
    vehicleName:{type:String,required:[true,'Please enter vehiclename']},
    isAc:{type:Boolean,default:false,required:[true,'Please enter Boolean']},
    vehicleCapecity:{type:Number,required:[true,'Please enter vehicleCapecityicity.']},
    vehicleType:{type:String,required:[true,'Please enter vehicletype..']},
    isAvalable:{type:Boolean,default:false},
    vehicleImage:{type:String,required:[true,'Please enter vehicleimage']},
    amount:{type:Number,required:[true,'Please enter amount']},
    inclusion:{type:Number,default:250},
    exclusion:{type:Number,default:500},
    facilities:{type:String,default:' '},   
    viewMore:{type:String},
    index:{type:Number},
    kmDay:{type:Number}
},{timestamps:true});
//exporting a schema
module.exports=mon.model('vchlofcab',vehicle);
