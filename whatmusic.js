const fs = require('fs')
const path = require('path')

exports.run = {
   usage: ['whatmusic'],
   category: 'downloader',
   async: async (m, {
      client,
      isPrefix,
      command,
      env,
      Func,
      Api
   }) => {
      try {
         if (!m.quoted || !/audio/.test(m.quoted.mimetype))
            return client.reply(m.chat, `Responde a un audio con *${isPrefix + command}* para identificar la canción.`, m)

         client.sendReact(m.chat, '🔍', m.key)
         const mediaPath = path.join(__dirname, '../temp', `${Func.makeId(5)}.mp3`)
         const stream = await m.quoted.download()
         await Func.saveStreamToFile(stream, mediaPath)

         const json = await Api.neoxr('/whatmusic', { media: fs.createReadStream(mediaPath) })
         fs.unlinkSync(mediaPath)

         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)

         const { title, artist } = json.data
         const query = `${title} ${artist}`

         client.reply(m.chat, `✅ *Canción identificada:*\n\n*🎵 ${title}*\n*👤 ${artist}*\n\nBuscando en YouTube...`, m)

         // Carga el usuario desde la base local
         const user = global.db.users.find(v => v.jid == m.sender)

         // Ejecuta directamente el .play usando los datos identificados
         require('./play').run.async(m, {
            client,
            text: query,
            isPrefix,
            command: 'play',
            users: user,
            env,
            Func,
            Api
         })

      } catch (e) {
         client.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   error: false,
   restrict: true,
   cache: true,
   location: __filename
}