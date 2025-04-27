exports.run = {
    usage: ['follar'],
    category: 'games',
    async: async (m, { client, text, isPrefix, command, users, env, Func }) => {
        try {
            // Verificar si se proporcionó un texto (usuario al que se le debe enviar el saludo)
            if (!text) return client.reply(m.chat, '✳️ Debes mencionar a alguien. Ejemplo: .follar @usuario', m);
client.sendReact(m.chat, '🥵', m.key)
            // Asegurarse de que se mencione un usuario
            let user = m.mentionedJid?.[0] || m.quoted?.sender;
            if (!user) return client.reply(m.chat, 'Debes mencionar o responder a alguien.', m);

            // Esperar a que el sistema pueda proceder
            if (!(await Func.firely(m, 'espera'))) return;

            // Generar un mensaje de saludo
            const tag = '@' + user.split('@')[0];
            const texto = `🤤👅🥵 *𝐀𝐂𝐀𝐁𝐀𝐒 𝐃𝐄 𝐅𝐎𝐋𝐋𝐀𝐑𝐓𝐄𝐋@!*🥵👅🤤

𝙏𝙚 𝙖𝙘𝙖𝙗𝙖𝙨 𝙙𝙚 𝙛𝙤𝙡𝙡𝙖𝙧 𝙖 𝙡𝙖 𝙥𝙚𝙧𝙧𝙖 𝙙𝙚 ${tag} 𝙖 𝟰 𝙥𝙖𝙩𝙖𝙨 𝙢𝙞𝙚𝙣𝙩𝙧𝙖𝙨 𝙩𝙚 𝙜𝙚𝙢𝙞𝙖 𝙘𝙤𝙢𝙤 𝙪𝙣𝙖 𝙢𝙖𝙡𝙙𝙞𝙩𝙖 𝙥𝙚𝙧𝙧𝙖 "𝐀𝐚𝐚𝐡.., 𝐀𝐚𝐚𝐡𝐡, 𝐬𝐢𝐠𝐮𝐞, 𝐧𝐨 𝐩𝐚𝐫𝐞𝐬, 𝐧𝐨 𝐩𝐚𝐫𝐞𝐬.." 𝙮 𝙡𝙖 𝙝𝙖𝙨 𝙙𝙚𝙟𝙖𝙙𝙤 𝙩𝙖𝙣 𝙧𝙚𝙫𝙚𝙣𝙩𝙖𝙙𝙖 𝙦𝙪𝙚 𝙣𝙤 𝙥𝙪𝙚𝙙𝙚 𝙨𝙤𝙨𝙩𝙚𝙣𝙚𝙧 𝙣𝙞 𝙨𝙪 𝙥𝙧𝙤𝙥𝙞𝙤 𝙘𝙪𝙚𝙧𝙥𝙤 𝙡𝙖 𝙢𝙖𝙡𝙙𝙞𝙩𝙖 𝙯𝙤𝙧𝙧𝙖!

${tag}
🤤🥵 *¡𝐘𝐀 𝐓𝐄 𝐇𝐀𝐍 𝐅𝐎𝐋𝐋𝐀𝐃𝐎!* 🥵🤤`;
            
            // Enviar mensaje de felicitación
            client.reply(m.chat, texto, m);

            // Enviar mensaje de audio (solo si es necesario)
            await client.sendMessage(m.chat, {
                audio: { url: 'https://qu.ax/VFYun.mp3' },
                mimetype: 'audio/mpeg',
                ptt: true
            }, { quoted: m });

        } catch (err) {
            console.error(err);
            return client.reply(m.chat, 'Hubo un error al enviar follar. Intenta nuevamente.', m);
        }
    },
    error: false,
    cache: true,
    location: __filename
};