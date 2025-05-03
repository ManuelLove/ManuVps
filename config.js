const { Component } = require('@neoxr/wb')
const { Function: Func, NeoxrApi } = new Component
global.Api = new NeoxrApi(process.env.API_ENDPOINT, process.env.API_KEY)
global.header = `𝙏𝙚𝙘𝙝𝙁𝙞𝙭 🅥${require('package.json').version}`
global.footer = `ᴡᴀʙᴏᴛ ʜᴇᴄʜᴏ ᴘᴏʀ ᴛᴇᴄʜғɪx ッ`
global.status = Object.freeze({
   process: Func.Styles('Por favor, espera . . .'),
   invalid: Func.Styles('URL inválida'),
   wrong: Func.Styles('Formato incorrecto.'),
   fail: Func.Styles('No se puede obtener los metadatos'),
   error: Func.Styles('Ocurrió un error'),
   errorF: Func.Styles('Lo siento, esta función tiene un error.'),
   premium: Func.Styles('Esta función es solo para usuarios premium.'),
   operator: Func.Styles('Este comando es solo para operadores.'),
   owner: Func.Styles('Este comando es solo para el owner.'),
   moderator: Func.Styles('Este comando es solo para el owner y moderadores.'),
   group: Func.Styles('Este comando solo funcionará en grupos.'),
   botAdmin: Func.Styles('Este comando funcionará cuando yo sea administrador.'),
   admin: Func.Styles('Este comando es solo para administradores del grupo.'),
   private: Func.Styles('Usa este comando en un chat privado.'),
   gameSystem: Func.Styles('Las funciones del juego han sido desactivadas.'),
   gameInGroup: Func.Styles('Las funciones del juego no han sido activadas para este grupo.'),
   gameLevel: Func.Styles('No puedes jugar al juego porque tu nivel ha alcanzado el límit máximo.')
})