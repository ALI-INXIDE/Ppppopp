const { File } = require("megajs");
const { https } = require("follow-redirects");
const unzipper = require("unzipper");
const { exec } = require("child_process"),
const { gmd, config, getBuffer, monospace, sleep, commands } = require('../lib'), 
      { BOT_PIC: botPic, 
       BOT_NAME: botName, 
       MODE: botMode, 
       VERSION: version,
       PREFIX: prefix, 
       TIME_ZONE: tz, 
       OWNER_NAME: displayName, 
       OWNER_NUMBER: waid } = config, 
      { totalmem: totalMemoryBytes, 
      freemem: freeMemoryBytes } = require('os'), 
      fs = require('fs'), 
      path = require("path"),
      fs = require("fs"),
      os = require("os"),
      axios = require("axios"),
      AdmZip = require("adm-zip"),
      git = require("git"),
      axios = require('axios'), 
      moment = require('moment-timezone'), 
      more = String.fromCharCode(8206), 
      readmore = more.repeat(4001);
      
      
      
const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

function formatBytes(bytes) {
  if (bytes >= Math.pow(1024, 3)) {
    return (bytes * byteToGB).toFixed(2) + ' GB';
  } else if (bytes >= Math.pow(1024, 2)) {
    return (bytes * byteToMB).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes * byteToKB).toFixed(2) + ' KB';
  } else {
    return bytes.toFixed(2) + ' bytes';
  }
    }
const ram = `${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}`;


function smallCaps(text) {

  const smallCapsMap = {

    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ',

    g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ',

    m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',

    s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',

    y: 'ʏ', z: 'ᴢ'

  };

  return text.toLowerCase().split('').map(c => smallCapsMap[c] || c).join('');

}



gmd({
    pattern: "menu",
    alias: ["help", "helpmenu"],
    desc: "Shows Bot Menu List",
    react: "🪀",
    category: "general",
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
       let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const totalCommands = commands.filter((command) => command.pattern).length;

        const categorized = commands.reduce((menu, gmd) => {
            if (gmd.pattern && !gmd.dontAddCommandList) {
                if (!menu[gmd.category]) menu[gmd.category] = [];
                menu[gmd.category].push(gmd.pattern);
            }
            return menu;
        }, {});
   
                let header = `
╭┈───〔 *${monospace(botName)}* 〕┈───⊷
│ 🫟 *ᴍᴏᴅᴇ* : ${monospace(botMode)}
│ 🪄 *ᴘʀᴇғɪx* : ${monospace(prefix)}
│ 🇦🇱 *ᴜsᴇʀ* : ${monospace(pushname)}
│ ⛲ *ᴘʟᴜɢɪɴs* : ${monospace(totalCommands.toString())}
│ 🎐 *ᴠᴇʀsɪᴏɴ* : ${monospace(version)}
│ ⏰ *ᴜᴘᴛɪᴍᴇ* : ${monospace(uptime)}
│ 🎗️ *ᴛɪᴍᴇ ɴᴏᴡ* : ${monospace(time)}
│ 📆 *ᴅᴀᴛᴇ ᴛᴏᴅᴀʏ* : ${monospace(date)}
│ 🌏 *ᴛɪᴍᴇ ᴢᴏɴᴇ* : ${monospace(tz)}
│ 🏓 *sᴇʀᴠᴇʀ ʀᴀᴍ* : ${monospace(ram)}
╰───────────────────⊷${readmore}\n`;

        const formatCategory = (category, gmds) => {
    const title = `\`『 *${monospace(category.toUpperCase())}* 』\`\n╭───────────────────⊷\n`;
    const body = gmds.map(gmd => `*┋ ⬡ ${smallCaps(gmd)}*`).join('\n');
    const footer = `╰───────────────────⊷`;
    return `${title}${body}\n${footer}`;
};


        let menu = header;
        for (const [category, gmds] of Object.entries(categorized)) {
            menu += formatCategory(category, gmds) + '\n';
        }
        
    const giftedMess = {
        image: { url: botPic },
        caption: menu.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363318387454868@newsletter',
                        newsletterName: config.BOT_NAME,
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅");
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

gmd({
    pattern: "list",
    alias: ["listmenu"],
    desc: "Show All Commands and their Usage",
    react: "📜",
    category: "general",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, isCmd, command, args, q, isGroup, sender, pushname, reply }) => {
    try {
      let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };

        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const totalCommands = commands.filter((command) => command.pattern).length;

        let list =  `
╭┈───〔 *${monospace(botName)}* 〕┈───⊷
│ 🏔️ *ᴍᴏᴅᴇ* : ${monospace(botMode)}
│ 🎗️ *ᴘʀᴇғɪx* : ${monospace(prefix)}
│ 👤 *ᴜsᴇʀ* : ${monospace(pushname)}
│ ⛲ *ᴘʟᴜɢɪɴs* : ${monospace(totalCommands.toString())}
│ 🔖 *ᴠᴇʀsɪᴏɴ* : ${monospace(version)}
│ ⏰ *ᴜᴘᴛɪᴍᴇ* : ${monospace(uptime)}
│ 🧿 *ᴛɪᴍᴇ ɴᴏᴡ* : ${monospace(time)}
│ 📆 *ᴅᴀᴛᴇ ᴛᴏᴅᴀʏ* : ${monospace(date)}
│ 🌏 *ᴛɪᴍᴇ ᴢᴏɴᴇ* : ${monospace(tz)}
│ 🏓 *sᴇʀᴠᴇʀ ʀᴀᴍ* : ${monospace(ram)}
╰┈──────────────────┈⊷${readmore}\n`;

        commands.forEach((gmd, index) => {
            if (gmd.pattern && gmd.desc) {
                list += `*${index + 1} ${monospace(gmd.pattern)}*\n  ${gmd.desc}\n`;
            }
        });

        const giftedMess = {
        image: { url: botPic },
        caption: list.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝅄𝐀𝐋𝐈 𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
await m.react("✅");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "menus",
    alias: ["allmenu", "listmenu"],
    desc: "Display Bot's Uptime, Date, Time, and Other Stats",
    react: "📜",
    category: "general",
    filename: __filename,
}, 
async (Gifted, mek, m, { from, quoted, sender, pushname, reply }) => {
    try {
      let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        
        function formatUptime(seconds) {
            const days = Math.floor(seconds / (24 * 60 * 60));
            seconds %= 24 * 60 * 60;
            const hours = Math.floor(seconds / (60 * 60));
            seconds %= 60 * 60;
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        const now = new Date();
        const date = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(now);

        const time = new Intl.DateTimeFormat('en-GB', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).format(now);

        const uptime = formatUptime(process.uptime());
        const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const memoryTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

        let menus = `
*🦄 Uᴘᴛɪᴍᴇ :* ${monospace(uptime)}
*🍁 Dᴀᴛᴇ Tᴏᴅᴀʏ:* ${monospace(date)}
*🎗 Tɪᴍᴇ Nᴏᴡ:* ${monospace(time)}

➮Fᴏᴜɴᴅᴇʀ - Ali Tech
➮Usᴇʀ - ${monospace(pushname)}
➮Nᴜᴍ - ${monospace(waid)} 
➮Mᴇᴍᴏʀʏ - ${monospace(ram)}

*🧑‍💻 :* ${monospace(botName)} Iꜱ Aᴠᴀɪʟᴀʙʟᴇ

╭──❰ *ALL MENU* ❱
│🎀 Lɪꜱᴛ
│🎀 Cᴀᴛᴇɢᴏʀʏ
│🎀 Hᴇʟᴘ
│🎀 Aʟɪᴠᴇ
│🎀 Uᴘᴛɪᴍᴇ
│🎀 Wᴇᴀᴛʜᴇʀ
│🎀 Lɪɴᴋ
│🎀 Cᴘᴜ
│🎀 Rᴇᴘᴏꜱɪᴛᴏʀʏ
╰─────────────⦁`;

      const giftedMess = {
        image: { url: botPic },
        caption: menus.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363318387454868@newsletter',
             newsletterName: "𝅄𝐀𝐋𝐈 𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅");
    } catch (e) {
        console.error(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "report",
    alias: ["request"],
    react: '💫',
    desc: "Request New Features.",
    category: "owner",
    use: '.request',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
const reportedMessages = {};
const devlopernumber = '923003588997';
try{
const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(sender);
  if (!isOwner) return reply("*Owner Only Command*");
  if (!q) return reply(`Example: ${prefix}request hi dev downloaders commands are not working`);
    const messageId = mek.key.id;
    if (reportedMessages[messageId]) {
        return reply("This report has already been forwarded to the owner. Please wait for a response.");
    }
    reportedMessages[messageId] = true;
    const textt = `*| REQUEST/REPORT |*`;
    const teks1 = `\n\n*User*: @${sender.split("@")[0]}\n*Request:* ${q}`;
    const teks2 = `\n\n*Hi ${pushname}, your request has been forwarded to my Owners.*\n*Please wait...*`;
    Gifted.sendMessage(devlopernumber + "@s.whatsapp.net", {
        text: textt + teks1,
        mentions: [m.sender],
    }, {
        quoted: mek,
    });
    reply("Tʜᴀɴᴋ ʏᴏᴜ ꜰᴏʀ ʏᴏᴜʀ ʀᴇᴘᴏʀᴛ. Iᴛ ʜᴀs ʙᴇᴇɴ ꜰᴏʀᴡᴀʀᴅᴇᴅ ᴛᴏ ᴛʜᴇ ᴏᴡɴᴇʀ. Pʟᴇᴀsᴇ ᴡᴀɪᴛ ꜰᴏʀ ᴀ ʀᴇsᴘᴏɴsᴇ.");
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})


  gmd({
    pattern: "repo",
    alias: ["sc", "script", "botrepo"],
    desc: "Repo/Script of the Bot",
    category: "general",
    react: "🌟",
    filename: __filename
},

async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const response = await axios.get(global.giftedApiRepo);
    const repoData = response.data;
    const { full_name, name, forks_count, stargazers_count, created_at, updated_at, owner } = repoData;
    const messageText = `╭─────────────────⳹\n│ *🎗️ ɴᴀᴍᴇ:* ALI-MD\n│ *⭐ sᴛᴀʀs:* 254\n│ *🧩 ғᴏʀᴋs:* 1226\n│ *🧮 ᴄʀᴇᴀᴛᴇᴅ ᴏɴ:* 3/14/2025\n│ *📮 ʟᴀsᴛ ᴜᴘᴅᴀᴛᴇᴅ:* 8/5/2025\n│ *👑 ᴏᴡɴᴇʀ:* ALI INXIDE\n╰─────────────────⳹\n*ʀᴇᴘᴏ ʟɪɴᴋ:* https://github.com/itx-alii-raza/ALI-MD\n\n*sɪᴍᴘʟᴇ, ɪᴄʏ, ᴄᴏʟᴅ  & ʀɪᴄʜ ʟᴏᴀᴅᴇᴅ ʙᴏᴛ ᴡɪᴛʜ ᴀᴍᴀᴢɪɴɢ ғᴇᴀᴛᴜʀᴇs, ᴅᴏɴ'ᴛ ғᴏʀɢᴇᴛ ᴛᴏ sᴛᴀʀ & ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ🌟🍴*`;
    let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈-𝐌𝐃`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
    const giftedMess = {
        image: { url: botPic },
        caption: messageText,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363318387454868@newsletter',
             newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓¬💸",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
await m.react("✅");
}catch(e){
console.log(e)
reply(`${e}`)
}
})



gmd({
    pattern: "ping",
    alias: ["speed","pong"],use: '.ping',
    desc: "Check bot's response time.",
    category: "general",
    react: "⚡",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '👑', '💸', '🍹', '🧸', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using Gifted.sendMessage()
        await Gifted.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        const text = `*${reactionEmoji} 𝐏๏፝֟ƞ̽g: ${responseTime.toFixed(2)} 𝐌ʂ*`;

        await Gifted.sendMessage(from, {
            text}, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
})

gmd({
  pattern: "owner",
  desc: "Shows Owner the Bot",
  category: "owner",
  react: "👑",
  filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
const vcard = 'BEGIN:VCARD\n'
          + 'VERSION:3.0\n' 
          + `FN:${config.OWNER_NAME}\n` 
          + 'ORG:BOT-CREATER;\n' 
          + `TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}\n`
          + 'END:VCARD';
  await Gifted.sendMessage(
  from,
  { 
      contacts: { 
          displayName, 
          contacts: [{ vcard }] 
      }
  }, { quoted: mek }
);
await m.react("✅");
}catch(e){
console.log(e)
reply(`${e}`)
}
})

gmd({
    pattern: "test",
    desc: "Check Bot's Status",
    category: "general",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const audioUrls = [
        'https://files.catbox.moe/nfnb5k.mp3',
        'https://files.catbox.moe/u8mlc9.mp4',
        'https://files.catbox.moe/c0p5t8.mp3',
        'https://files.catbox.moe/s41x34.mp3',
        'https://files.catbox.moe/rys34d.mp3'
      ];
      const randomAudioUrl = audioUrls[Math.floor(Math.random() * audioUrls.length)];
        let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        const buffer = await getBuffer(randomAudioUrl);
        const giftedMess = {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: true,
        waveform: [1000, 0, 1000, 0, 1000, 0, 1000],
        contextInfo: {
        mentionedJid: [m.sender], 
          forwardingScore: 0,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
           newsletterJid: '120363318387454868@newsletter',
           newsletterName: "𝅄𝐀𝐋𝐈 𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
           serverMessageId: 143
           }, 
          externalAdReply: {
            title: "𝐀𝐋𝐈 𝐌𝐃 𝐈𝐒 𝐀𝐂𝐓𝐈𝐕𝐄",
            body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʟɪ ᴛᴇᴄʜ `,
            thumbnailUrl: botPic,
            sourceUrl: `https://whatsapp.com/channel/0029VaoRxGmJpe8lgCqT1T2h`,
            mediaType: 5,
            renderLargerThumbnail: false
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { quoted: mek });
      await m.react("✅"); 
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

gmd({
    pattern: "alive",
    react: "🌸",
    desc: "Check bot online or no.",
    category: "general",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Sound file URLs
        const audioFiles = [
            'https://files.catbox.moe/triobt.mp3',
            'https://files.catbox.moe/6kvcfg.mp4'
        ];

        // Randomly pick an audio file
        const vn = audioFiles[Math.floor(Math.random() * audioFiles.length)];

        // Other variables
        const name = pushname || Gifted.getName(sender);
        const url = 'https://github.com/itx-alii-raza/ALI-MD';
        const murl = 'https://wa.me/message/TAMAX6V3VD2RG1';

        // Constructing the contact message
        const con = {
            key: {
                fromMe: false,
                participant: `${sender.split('@')[0]}@s.whatsapp.net`,
                ...(isGroup ? { remoteJid: '923003588997@s.whatsapp.net' } : {}),
            },
            message: {
                contactMessage: {
                    displayName: name,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
                },
            },
        };
        // Audio file message with external ad reply info
        const doc = {
            audio: {
                url: vn,
            },
            mimetype: 'audio/mpeg',
            ptt: true,
            waveform: [100, 0, 100, 0, 100, 0, 100],
            fileName: 'shizo',
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: "𝐀𝐋𝐈 𝐌𝐃 𝐈𝐒 𝐀𝐂𝐓𝐈𝐕𝐄",
                    body: config.BOT_NAME || 'POWERED BY ALI INXIDE 🤌💗',
                    thumbnailUrl: config.BOT_PIC || 'https://files.catbox.moe/6ku0eo.jpg',
                    sourceUrl: murl,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        };

        // Send the message
        await Gifted.sendMessage(from, doc, { quoted: con });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
})
                  


gmd({
    pattern: "runtime",
    alias: ["uptime"],
    desc: "Check Bot's Server Runtime.",
    category: "general",
    react: "⏱️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
    try {
    let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `𝐀𝐋𝐈 𝐓𝐄𝐂𝐇`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${
                        m.sender.split("@")[0]
                    }:${
                        m.sender.split("@")[0]
                    }\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
    const giftedMess = {
      text: `*Bot Has Been Up For: ${days}days ${hours}hour ${minutes}minutes ${seconds} second*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363318387454868@newsletter',
          newsletterName: "𝅄𝐀𝐋𝐈 𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
          serverMessageId: 143
        }
      }
    };
    await Gifted.sendMessage(from, giftedMess, { quoted: mek}); 
    await m.react("✅"); 
} catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
 
gmd({
    pattern: "uptime2",
    alias: ["runtime2"],
    desc: "Check Bot's Server Runtime.",
    category: "general",
    react: "⚡",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const uptimeSeconds = process.uptime();
        const days = Math.floor(uptimeSeconds / (24 * 3600));
        const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);
        const message = await Gifted.sendMessage(from, 
            { text: '*Connecting Server...*' }, 
            { quoted: mek });
        const text =  `*Bot Has Been Up For: _${days}d ${hours}h ${minutes}m ${seconds}s_*`;
        await Gifted.sendMessage(from, {
            text: text,
            edit: message.key }, 
            { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
})

gmd({
  pattern: "restart",
  desc: "Restart the Bot (PM2/Heroku compatible)",
  category: "system",
  filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

    reply("♻️ *Restarting the bot...*");
    await sleep(1500);

    // Check if pm2 is installed
    exec("pm2 -v", (err, stdout, stderr) => {
      if (!err && stdout) {
        // PM2 exists → restart using pm2
        exec("pm2 restart all", (err2, out2) => {
          if (err2) {
            reply(`❌ PM2 restart failed:\n${err2.message}`);
          }
        });
      } else {
        // No PM2 → fallback to kill process (Heroku-style)
        exec("kill 1", (err3, out3) => {
          if (err3) {
            reply(`❌ Fallback restart failed:\n${err3.message}`);
          }
        });
      }
    });
  } catch (e) {
    console.error("Restart error:", e);
    reply("❌ An error occurred during restart:\n" + e.message);
  }
})

gmd({
    pattern: "allvar",
    react: "⚙️",
    alias: ["setting", "env", "vars"],
    desc: "Get Bot's Settings List.",
    category: "system",
    use: '.menu',
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, body, isCmd, umarmd, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {

    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
         let giftedMess = {
            image: { url: config.BOT_PIC },
            caption: `\`「 BOT VARIABLES 」\`
╭───────────────────⊷
│ ☄︎ *Auto Read Status:* ${config.AUTO_READ_STATUS}  
│ ☄︎ *Mode:* ${config.MODE}  
│ ☄︎ *Auto Audio:* ${config.AUTO_AUDIO}  
│ ☄︎ *Auto Like Status:* ${config.AUTO_LIKE_STATUS}  
│ ☄︎ *Auto Like Emoji(s):* ${config.AUTO_LIKE_EMOJIS}  
│ ☄︎ *Auto Reply Status:* ${config.AUTO_REPLY_STATUS}  
│ ☄︎ *Status Reply Message:* ${config.STATUS_REPLY_MSG}  
│ ☄︎ *Owner Number:* ${config.OWNER_NUMBER}  
│ ☄︎ *Owner Name:* ${config.OWNER_NAME}  
│ ☄︎ *Pack Author:* ${config.PACK_AUTHOR}  
│ ☄︎ *Pack Name:* ${config.PACK_NAME}  
│ ☄︎ *Prefix:* [${config.PREFIX}]  
│ ☄︎ *Anti-Delete:* ${config.ANTI_DELETE}  
│ ☄︎ *Anti-Link:* ${config.ANTILINK}  
│ ☄︎ *Anti-Call:* ${config.ANTICALL}  
│ ☄︎ *Anti-Bad Words:* ${config.ANTIBAD}  
│ ☄︎ *Bad Words List:* ${config.BAD_WORDS}  
│ ☄︎ *Anti-Call Message:* ${config.ANTICALL_MSG}  
│ ☄︎ *Auto React:* ${config.AUTO_REACT}  
│ ☄︎ *Bot Name:* ${config.BOT_NAME}  
│ ☄︎ *Bot Picture:* ${config.BOT_PIC}  
│ ☄︎ *Chat Bot:* ${config.CHAT_BOT}  
│ ☄︎ *Welcome:* ${config.WELCOME}  
│ ☄︎ *Goodbye:* ${config.GOODBYE}  
│ ☄︎ *Auto Read Messages:* ${config.AUTO_READ_MESSAGES}  
│ ☄︎ *Auto Block:* ${config.AUTO_BLOCK}  
│ ☄︎ *Presence:* ${config.PRESENCE}  
│ ☄︎ *Time Zone:* ${config.TIME_ZONE}   
╰────────────────┈⊷`,
            contextInfo: {
                  forwardingScore: 5,
                  isForwarded: true,
                  forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓¬💸",
                  serverMessageId: 143
                }
              }
    };

        await Gifted.sendMessage(from, giftedMess, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`🚨 *Error:* ${e}`);
    }
})


gmd({
  pattern: "update",
  desc: "Update bot from GitHub repo and restart",
  react: "🔁",
  category: "owner",
  filename: __filename
},
async (Gifted, mek, m, { from, sender, isOwner, reply }) => {
  if (!isOwner) {
    return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
  }

  try {
    await Gifted.sendMessage(from, { text: '🔄 *Downloading update from GitHub...*' }, { quoted: mek });

    const zipUrl = 'https://github.com/itx-alii-raza/ALI-MD/archive/refs/heads/main.zip';
    const zipPath = path.join(process.cwd(), 'update.zip');
    const tempExtractPath = path.join(process.cwd(), 'update_temp');

    const downloadZip = () => new Promise((resolve, reject) => {
      const file = fs.createWriteStream(zipPath);
      const request = https.get(zipUrl, {
        headers: { 'User-Agent': 'NodeJS-Updater' }
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ZIP. Status code: ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      });

      request.on('error', (err) => {
        fs.unlink(zipPath, () => {});
        reject(err);
      });

      file.on('error', (err) => {
        fs.unlink(zipPath, () => {});
        reject(err);
      });
    });

    await downloadZip();

    // Check ZIP file size
    const stats = fs.statSync(zipPath);
    if (stats.size < 10000) { // less than 10 KB = probably broken
      throw new Error("Downloaded ZIP file is too small or corrupted.");
    }

    await fs.promises.mkdir(tempExtractPath, { recursive: true });

    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: tempExtractPath }))
      .promise();

    const [extractedFolder] = fs.readdirSync(tempExtractPath).filter(f =>
      fs.statSync(path.join(tempExtractPath, f)).isDirectory()
    );
    const extractedPath = path.join(tempExtractPath, extractedFolder);

    const copyRecursive = (src, dest) => {
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };

    copyRecursive(extractedPath, process.cwd());

    fs.rmSync(zipPath);
    fs.rmSync(tempExtractPath, { recursive: true, force: true });

    await Gifted.sendMessage(from, {
      text: `✅ *ᴜᴘᴅᴀᴛᴇ ᴄᴏᴍᴘʟᴇᴛᴇᴅ sᴜᴄᴄᴇssғᴜʟʟʏ! ᴜsᴇ .ʀᴇsᴛᴀʀᴛ ᴄᴏᴍᴍᴀɴᴅ ᴛᴏ ʀᴇʟᴏᴀᴅ ᴛʜᴇ ʙᴏᴛ*`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "ALI-MD 🚩",
          body: "ᴜᴘᴅᴀᴛᴇ ᴄᴏᴍᴘʟᴇᴛᴇ 🛬",
          thumbnailUrl: "https://files.catbox.moe/6ku0eo.jpg",
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: "https://github.com"
        }
      }
    }, { quoted: mek });

  } catch (err) {
    console.error('Update error:', err);
    reply("❌ *An error occurred while updating.*\n" + err.message);
  }
})

gmd({
  pattern: "restart",
  desc: "Restart the Bot (PM2/Heroku compatible)",
  category: "system",
  filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
  try {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

    reply("♻️ *Restarting the bot...*");
    await sleep(1500);

    // Check if pm2 is installed
    exec("pm2 -v", (err, stdout, stderr) => {
      if (!err && stdout) {
        // PM2 exists → restart using pm2
        exec("pm2 restart all", (err2, out2) => {
          if (err2) {
            reply(`❌ PM2 restart failed:\n${err2.message}`);
          }
        });
      } else {
        // No PM2 → fallback to kill process (Heroku-style)
        exec("kill 1", (err3, out3) => {
          if (err3) {
            reply(`❌ Fallback restart failed:\n${err3.message}`);
          }
        });
      }
    });
  } catch (e) {
    console.error("Restart error:", e);
    reply("❌ An error occurred during restart:\n" + e.message);
  }
})

gmd({
    pattern: "reboot",
    desc: "Reboot the Bot",
    category: "system",
    filename: __filename
},
async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
reply("*Bot is Rebooting...*")
await sleep(1500)
exec("pm2 reload all")
}catch(e){
console.log(e)
reply(`${e}`)
}
})

gmd({
    pattern: "shutdown",
    alias: ["logout", "stop"],
    desc: "Terminate the Bot",
    category: "system",
    filename: __filename
},
async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
reply("*Bot is Shutting Down Now...*")
await sleep(1500)
exec("pm2 stop all")
}catch(e){
console.log(e)
reply(`${e}`)
}
})
