const {Schema,model, now} = require('mongoose');

const ProyectoSchema = Schema({
    cnompro:{
        type:String,
        require:true,
    },
    ccodcli:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    cdescri:{
        type:String,
        require:true
    },
    cestado:{
        type:Boolean,
        default:true
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
},{collection:'systpro'})

ProyectoSchema.method('toJSON',function(){
    const {__v,_id,cpaswor,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('systpro',ProyectoSchema)