const {Schema,model, now} = require('mongoose');



const variablesSchema = Schema({

    cconvar:{
        type:String,
        require:true
    },
    cnomvar:{
        type:String,
        require:true,
        unique:true
    },
    cdesvar:{
        type:String,
        require:true
    },
    ctipvar:{
        type:String,
        require:true
    },
    cusumod:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    dfecmod:{
        type: String
    }


},{collection:'systvar'})

variablesSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('systvar',variablesSchema)