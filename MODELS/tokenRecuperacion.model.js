const {Schema,model, now} = require('mongoose');

const tokenSchema = Schema({
    token:{
        type:String
    },
    ccodusu:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    cestado:{
        type:Boolean,
        default:true,
        require:true
    }})

tokenSchema.method('toJSON',function(){
    const {__v,_id,cpaswor,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('sysdtok',tokenSchema)
