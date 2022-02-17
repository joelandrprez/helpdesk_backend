const {Schema,model, now} = require('mongoose');



const ticketSchema = Schema({

    ctiptic:{
        type:Schema.Types.ObjectId,
        ref:'systvar'
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
        type:Schema.Types.ObjectId,
        ref:'systvar'
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
    cdesfin:{
        type: String,
        default:''
    },
    cdesasi:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    cateasi:{
        type:Schema.Types.ObjectId,
        ref:'systusu'
    },
    cdiaapr:{
        type: String
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