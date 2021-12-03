const {Schema,model, now} = require('mongoose');



const errorLogSchema = Schema({

    detalle:{
        type:String,
        require:true
    },
    
    cusureg:{
        type:Schema.Types.ObjectId,
        ref:'sysdlog'
    },
    dfecreg:{
        type: String
    }
},{collection:'sysdlog'})

errorLogSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('sysdlog',errorLogSchema)