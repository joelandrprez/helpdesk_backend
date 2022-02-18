const Notificacion = require('../MODELS/notificaciones.model');
const Usuarios = require('../MODELS/usuario.model');


const registrarNotificaciones = async (tipo,ticket) => {
    if(tipo === 'registro'){
        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:'Se registro el Ticket',
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        const notificacion = new Notificacion({
            cusunot:ticket.cusumod,
            cmsgnot:'Se registro tu Ticket',
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion.save();

    }
    if(tipo === 'asignar'){
        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:'Se asigno el Ticket',
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }

        const notificacion = new Notificacion({
            cusunot:ticket.cdesasi._id,// desarrollador asignado
            cmsgnot:'Se te asigno el Ticket',
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion.save();
        const notificacion1 = new Notificacion({
            cusunot:ticket.cusureg._id,//  cliente
            cmsgnot:'Se asigno tu Ticket',
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion1.save();

    }
    if(tipo === 'resuelto'|| tipo === 'pendiente por devolver'){

        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:`Cambio a ${tipo}`,
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        const notificacion = new Notificacion({
            cusunot:ticket.cdesasi._id,// atencion al cliente
            cmsgnot:`Cambio a ${tipo}`,
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion.save();
        const notificacion1 = new Notificacion({
            cusunot:ticket.cusureg._id,// atencion al cliente
            cmsgnot:`Cambio a ${tipo}`,
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion1.save();
        
    }
    if(tipo === 'terminado' || tipo === 'devuelto'){
        console.log(ticket);
        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:`Se a ${tipo} el Ticket`,
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        if(tipo === 'terminado'){
            const notificacion = new Notificacion({
                cusunot:ticket.cdesasi._id,// desarrollador asignado
                cmsgnot:`Se a ${tipo} el Ticket`,
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        
        const notificacion1 = new Notificacion({
            cusunot:ticket.cusureg._id,// cliente que registro
            cmsgnot:`Se a ${tipo} tu Ticket!`,
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion1.save();

    }
    if(tipo === 'anular_cliente'){
        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:'El cliente anulo su Ticket',
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        const notificacion1 = new Notificacion({
            cusunot:ticket.cusureg._id,// cliente
            cmsgnot:'Anulaste tu Ticket tu Ticket!',
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion1.save();

    }
    if(tipo === 'pendiente_anular'){
        const usuariosEnvio = await Usuarios.find({ccodcat:'ATENCION AL CLIENTE'},'cnomusu')
        for (const type of usuariosEnvio) { 
            console.log(type);
            const notificacion = new Notificacion({
                cusunot:type._id,
                cmsgnot:'El cliente anulo su Ticket',
                cnomtic:ticket.cdesasu,
                cusumod:ticket.cusumod,
                dfecmod:ticket.dfecmod
            })
            await notificacion.save();
        }
        const notificacion1 = new Notificacion({
            cusunot:ticket.cusureg._id,// cliente
            cmsgnot:'Anulaste tu Ticket tu Ticket!',
            cnomtic:ticket.cdesasu,
            cusumod:ticket.cusumod,
            dfecmod:ticket.dfecmod
        })
        await notificacion1.save();

    }

}

module.exports = {
    registrarNotificaciones
}