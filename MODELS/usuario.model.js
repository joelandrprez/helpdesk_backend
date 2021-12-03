const {Schema,model, now} = require('mongoose');

const UsuarioSchema = Schema({
    ccorusu:{
        type:String,
        require:true,
        unique:true
    },
    cnomusu:{
        type:String,
        require:true
    },
    cpaswor:{
        type:String,
        require:true
    },
    cestusu:{
        type:Boolean,
        default:true
    },
    ccodcat:{
        type:String,
        require:true,
        default:'USU'
    },
    nnumint:{
        type:Number,
        default:'0'
    },

    cdirusu:{
        type:String,
        default:'Arequipa '
    },
    csexusu:{
        type:String,
        default:'M'
    },
    dfecnac:{
        type: String
    },
    nimgusu:{
        type: String,
        default:'no-imagen.jpg'
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
},{collection:'systusu'})

UsuarioSchema.method('toJSON',function(){
    const {__v,_id,cpaswor,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('systusu',UsuarioSchema)