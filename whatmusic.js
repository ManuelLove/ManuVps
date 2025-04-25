const fs = require('fs')
const path = require('path')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg')
const FormData = require('form-data')
const { promisify } = require('util')
const { pipeline } = require('stream')
const streamPipeline = promisify(pipeline)

exports.run = {
   usage: ['whatmusic'],
   use: 'query',
   category: 'downloader',
   async: async (m, { client, Func, users, env, Api }) => {
      try {
         if (!m.quoted || !/audio|video/.test(m.quoted.mtype)) return client.reply(m.chat, '✳️ Responde a un *audio*, *nota de voz* o *video* para identificar la canción.', m)
         client.sendReact(m.chat, '🔍', m.key)

         const tmpDir = path.join(__dirname, '../tmp')
         if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

         const isAudio = m.quoted.mtype.includes('audio')
         const inputPath = path.join(tmpDir, `${Date.now()}.${isAudio ? 'mp3' : 'mp4'}`)

         const stream = await m.quoted.download()
         if (Buffer.isBuffer(stream)) {
            fs.writeFileSync(inputPath, stream)
         } else {
            await streamPipeline(stream, fs.createWriteStream(inputPath))
         }

         const form = new FormData()
         form.append('file', fs.createReadStream(inputPath))
         form.append('expiry', '3600')

         const upload = await axios.post('https://cdn.russellxz.click/upload.php', form, { headers: form.getHeaders() })
         if (!upload.data || !upload.data.url) throw new Error('No se pudo subir el archivo')

         const fileUrl = upload.data.url
         const apiURL = `https://api.neoxr.eu/api/whatmusic?url=${encodeURIComponent(fileUrl)}&apikey=russellxz`
         const res = await axios.get(apiURL)

         if (!res.data.status || !res.data.data) throw new Error('No se pudo identificar la canción')
         const { title, artist, album, release } = res.data.data

         // Usar la API de búsqueda de YouTube (reemplaza yts)
         const yt = await axios.get(`https://api.neoxr.eu/api/play?q=${encodeURIComponent(title + ' ' + artist)}&apikey=russellxz`)
if (!yt.data.status || !yt.data.data || !yt.data.data.url) {
   throw new Error("No se encontró la canción en YouTube")
}
         if (!yt.status || !yt.data || !yt.data.url) throw new Error('No se encontró la canción en YouTube')

         const video = yt
         let caption = `乂  *W H A T - M U S I C*\n\n`
         caption += `◦  *Título* : ${title}\n`
         caption += `◦  *Artista* : ${artist}\n`
         caption += `◦  *Álbum* : ${album || '-'}\n`
         caption += `◦  *Lanzamiento* : ${release || '-'}\n`
         caption += `◦  *YouTube* : ${video.title}\n`
         caption += `◦  *Duración* : ${video.duration}\n`
         caption += `◦  *Tamaño* : ${video.data.size}\n`
         caption += `◦  *Link* : ${video.data.url}\n\n`
         caption += global.footer

         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: video.thumbnail
         })

         const chSize = Func.sizeLimit(video.data.size, users.premium ? env.max_upload : env.max_upload_free)
         if (chSize.oversize) {
            fs.unlinkSync(inputPath)
            return client.reply(m.chat, `⚠️ El archivo es muy grande. Límite actual: ${users.premium ? env.max_upload : env.max_upload_free} MB`, m)
         }

         await client.sendFile(m.chat, video.data.url, video.data.filename, '', m, {
            document: true,
            mimetype: 'audio/mpeg',
            APIC: await Func.fetchBuffer(video.thumbnail)
         }, {
            jpegThumbnail: await Func.createThumb(video.thumbnail)
         })

         fs.unlinkSync(inputPath)
         client.sendReact(m.chat, '✅', m.key)

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