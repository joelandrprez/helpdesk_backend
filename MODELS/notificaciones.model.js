const {Schema,model, now} = require('mongoose');

const NotificacionSchema = Schema({
    cusunot:{
        type:Schema.Types.ObjectId,
        ref:'systpro'
    },
    cmsgnot:{
        type: String
    },
    cnomtic:{
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