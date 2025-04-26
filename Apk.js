const fetch = require('node-fetch');

exports.run = {
   usage: ['apk'],
   use: 'query',
   category: 'downloader',
   async: async (m, { client, text, isPrefix, command, Func }) => {
      try {
         if (!text) return client.reply(m.chat, `⚠️ *Uso incorrecto.*\n📌 Ejemplo: *${isPrefix + command} whatsapp*`, m);
         
         client.sendReact(m.chat, '⏳', m.key);

         const apiUrl = `https://api.neoxr.eu/api/apk?q=${encodeURIComponent(text)}&no=1&apikey=russellxz`;
         const response = await fetch(apiUrl);

         if (!response.ok) throw new Error(`Error de la API: ${response.status} ${response.statusText}`);

         const data = await response.json();
         if (!data.status || !data.data || !data.file || !data.file.url) {
            throw new Error("No se pudo obtener información del APK.");
         }

         const apkInfo = data.data;
         const apkFile = data.file;

         const caption = `乂  *A P K - D O W N L O A D*\n\n` +
                         `◦  *Nombre:* ${apkInfo.name}\n` +
                         `◦  *Tamaño:* ${apkInfo.size}\n` +
                         `◦  *Rating:* ${apkInfo.rating}\n` +
                         `◦  *Instalaciones:* ${apkInfo.installs}\n` +
                         `◦  *Desarrollador:* ${apkInfo.developer}\n` +
                         `◦  *Categoría:* ${apkInfo.category}\n` +
                         `◦  *Versión:* ${apkInfo.version}\n` +
                         `◦  *Actualizado:* ${apkInfo.updated}\n` +
                         `◦  *Requisitos:* ${apkInfo.requirements}\n` +
                         `◦  *ID:* ${apkInfo.id}\n\n` +
                         global.footer;

         await client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            thumbnail: apkInfo.thumbnail
         });

         const fileResponse = await fetch(apkFile.url);
         if (!fileResponse.ok) throw new Error("No se pudo descargar el archivo APK.");
         const fileBuffer = await fileResponse.buffer();

         await client.sendMessageModify(m.chat, caption, m, {
   largeThumb: true,
   thumbnail: apkInfo.thumbnail
}).then(async () => {
   await client.sendFile(m.chat, fileBuffer, apkFile.filename, '', m, {
      document: true,
      mimetype: 'application/vnd.android.package-archive'
   }, {
      jpegThumbnail: await Func.createThumb(apkInfo.thumbnail)
   })
})

         client.sendReact(m.chat, '✅', m.key);

      } catch (e) {
         console.error(e);
         client.reply(m.chat, `❌ *Error al procesar la solicitud:*\n${e.message}`, m);
         client.sendReact(m.chat, '❌', m.key);
      }
   },
   error: false,
   cache: true,
   location: __filename
}