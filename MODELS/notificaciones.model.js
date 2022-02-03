const {Schema,model, now} = require('mongoose');

const NotificacionSchema = Schema({
    ctiptic:{
        type:String,
        require:true,
    },
    cnompro:{
        type:Schema.Types.ObjectId,
        ref:'systpro'
    },
    cdesasu:{
        type:String,
        require:true
    },
    cdesnot:{
        type:String,
    }, 
    cestado:{
        type:String,
    }, 
    ccatego:{
        type:String,
        default:''
    }, 
    cusureg:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    dfecreg:{
        type: String
    },
    cusumod:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    dfecmod:{
        type: String
    }
},{collection:'systnot'})

NotificacionSchema.method('toJSON',function(){
    const {__v,_id,cpaswor,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('systnot',NotificacionSchema)