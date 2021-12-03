const {Schema,model, now} = require('mongoose');



const permisosSchema = Schema({

    ctipcat:{
        type:String,
        require:true
    },
    URL:{
        type:String,
        require:true
    },
    ctitle:{
        type:String,
        require:true
    },
    csection:{
        type:String,
        require:true
    }


},{collection:'sysdper'})

permisosSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('sysdper',permisosSchema)