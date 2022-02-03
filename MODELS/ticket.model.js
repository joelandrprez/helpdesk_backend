const {Schema,model, now} = require('mongoose');



const ticketSchema = Schema({

    ctiptic:{
        type:String,
        require:true
    },
    cnompro:{
        type:Schema.Types.ObjectId,
        ref:'systpro'
    },
    cdesasu:{
        type:String,
        require:true
    },
    cdescri:{
        type:String,
        require:true
    },
    cpriori:{
        type:String,
        ref:'systusu'
    },
    cestado:{
        type: String,
        default:'registrado'
    },
    carcadj:{
        type: String,
        default:'no-archivo'
    },
    cdesate:{
        type: String,
        default:''
    },
    cdesdes:{
        type: String,
        default:''
    },
    cdesasi:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    cestdev:{
        type:Boolean,
        default:false
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


},{collection:'sysmtic'})

ticketSchema.method('toJSON',function(){
    const {__v,_id,...object} = this.toObject();
    object.uid = _id
    return object;
})
module.exports = model('sysmtic',ticketSchema)