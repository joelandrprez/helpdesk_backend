
const Permiso = require('../MODELS/permisos.model');

const validarPermisos = async (role='USU',valorFormulario) => {
    const categorias = await Permiso.distinct('ctitle',{ctipcat:role})
    const permisos = categorias
    const valor = permisos.includes(valorFormulario)
    console.log(categorias);
    return valor;
}

module.exports = {
    validarPermisos
}