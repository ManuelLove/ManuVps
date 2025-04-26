const fs = require('fs')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const { promisify } = require('util')
const { pipeline } = require('stream')
const streamPipeline = promisify(pipeline)

exports.run = {
   usage: ['whatmusic'],
   use: 'responde a audio/video',
   category: 'downloader',
   async: async (m, { client, Func, isPrefix, command }) => {
      try {
         if (!m.quoted || !/audio|video/.test(m.quoted.mtype)) {
            return client.reply(m.chat, '✳️ Responde a un *audio*, *nota de voz* o *video* para identificar la canción.', m)
         }

         client.sendReact(m.chat, '🎵', m.key)

         const tmpDir = path.join(__dirname, '../tmp')
         if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

         const ext = m.quoted.mtype.includes('audio') ? 'mp3' : 'mp4'
         const inputPath = path.join(tmpDir, `${Date.now()}.${ext}`)

         const stream = await m.quoted.download()
         if (Buffer.isBuffer(stream)) {
            fs.writeFileSync(inputPath, stream)
         } else {
            await streamPipeline(stream, fs.createWriteStream(inputPath))
         }

         const form = new FormData()
         form.append('file', fs.createReadStream(inputPath))
         form.append('expiry', '3600')

         const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, {
            headers: form.getHeaders()
         })

         const url = upload?.data?.url
         if (!url) throw new Error('No se pudo subir el archivo.')

         const api = `https://api.neoxr.eu/api/whatmusic?url=${encodeURIComponent(url)}&apikey=russellxz`
         const { data } = await axios.get(api)

         if (!data.status || !data.data) throw new Error('No se pudo identificar la canción.')

         const { title, artist, album, release } = data.data
         const info = `乂  *W H A T - M U S I C*\n\n` +
                      `◦  *Título* : ${title}\n` +
                      `◦  *Artista* : ${artist}\n` +
                      `◦  *Álbum* : ${album || '-'}\n` +
                      `◦  *Lanzamiento* : ${release || '-'}\n\n` +
                      `🔎 Buscando en YouTube...`

         await client.reply(m.chat, info, m)

         const query = `${title} ${artist}`
m.text = query
m.command = 'play'

require('./play').run.async(m, {
   client,
   text: query,
   isPrefix,
   command: 'play',
   users: global.db.users.find(v => v.jid == m.sender), // ✅ así se obtiene el usuario
   env: global.env,                                     // ✅ así se evita el error del límite
   Func,
   Api: global.Api
})

         fs.unlinkSync(inputPath)

      } catch (e) {
         client.reply(m.chat, `❌ *Error:* ${e.message}`, m)
         client.sendReact(m.chat, '❌', m.key)
      }
   },
   error: false,
   restrict: true,
   cache: false,
   location: __filename
}