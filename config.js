const { Component } = require('@neoxr/wb')
const { Function: Func, NeoxrApi } = new Component
global.Api = new NeoxrApi('https://api.neoxr.my.id/api', process.env.API_KEY)
global.header = `𝙏𝙚𝙘𝙝𝙁𝙞𝙭 🅥❹ v${require('package.json').version} (Beta)`
global.footer = `ᴛᴇᴄʜɴᴏʟᴏɢíᴀ ᴡᴀʙᴏᴛ ʜᴇᴄʜᴏ ᴘᴏʀ ᴛᴇᴄʜғɪx ッ`
global.status = Object.freeze({
   invalid: Func.Styles('URL no válida'),
   wrong: Func.Styles('Formato incorrecto.'),
   fail: Func.Styles('No se puede obtener los metadatos.'),
   error: Func.Styles('Se ha producido un error'),
   errorF: Func.Styles('Lo siento, esta función tiene un error.'),
   premium: Func.Styles('Esta función es solo para usuarios premium.'),
   auth: Func.Styles('No tienes permiso para usar esta función, pide autorización al owner primero.'),
   owner: Func.Styles('Este comando es solo para el owner.'),
   group: Func.Styles('Este comando solo funcionará en grupos.'),
   botAdmin: Func.Styles('Este comando funcionará cuando me convierta en administrador.'),
   admin: Func.Styles('Este comando es solo para administradores del grupo.'),
   private: Func.Styles('Usa este comando en un chat privado.'),
   gameSystem: Func.Styles('Las funciones de juego han sido desactivadas.'),
   gameInGroup: Func.Styles('Las funciones de juego no han sido activadas para este grupo.'),
   gameLevel: Func.Styles('No puedes jugar el juego porque tu nivel ha alcanzado el límite máximo.')
})