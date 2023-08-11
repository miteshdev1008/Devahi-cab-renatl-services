const mon=require('mongoose');
require('../dbo.js');

//creating a schema
const userofcab=new mon.Schema({
    //name:{type:String},
    username:{type:String},
    password:{type:String},
    mobile:{type:String},
    wp_message:{type:String},
   
},{timestamps:true});
//exporting a schema
module.exports=mon.model('uadmincab',userofcab);