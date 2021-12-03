
const Permiso = require('../MODELS/permisos.model');

const getMenufrontEnd = async (role='USU') => {


  const categoria = role;
  // MyModel.distinct('_id', { foo: 'bar' },
  
  const permiso = await Permiso.find({ctipcat:role})
  const categorias = await Permiso.distinct('csection',{ctipcat:role})
  const menu = []

  for (let i = 0; i < categorias.length; i++) {
      
      menu.push({titulo:categorias[i],submenu:[]})
      
      for (let e = 0; e < permiso.length; e++) {

          if( categorias[i] === permiso[e].csection ){

              menu[i].submenu.unshift({titulo:permiso[e].ctitle,url:permiso[e].URL})

          }
      }

  }
      return menu;

}

module.exports = {
    getMenufrontEnd
}