const { gmd, commands } = require('../lib'), 
      axios = require('axios');

gmd({
    pattern: "milf",
    react: '💫',
    desc: "Download Milf Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("❌ You are not the owner!");
let res = await axios.get('https://api.waifu.im/search/?included_tags=milf')
await Gifted.sendMessage(from, { image: { url: res.data.images[0].url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "ero",
    react: '💫',
    desc: "Download Erotic Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("❌ You are not the owner!");
let res = await axios.get('https://api.waifu.im/search/?included_tags=ero')
await Gifted.sendMessage(from, { image: { url: res.data.images[0].url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "ecchi",
    react: '💫',
    desc: "Download Echi Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("❌ You are not the owner!");
let res = await axios.get('https://api.waifu.im/search/?included_tags=ecchi')
await Gifted.sendMessage(from, { image: { url: res.data.images[0].url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "ass",
    react: '💫',
    desc: "Download Ass Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!isOwner) return reply("❌ You are not the owner!");
let res = await axios.get('https://api.waifu.im/search/?included_tags=ass')
await Gifted.sendMessage(from, { image: { url: res.data.images[0].url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "ranime",
    alias: ["randomanime"],
    react: '💫',
    desc: "Download Random Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const response = await axios.get('https://api.jikan.moe/v4/random/anime'); 
const data = response.data.data;
    const title = data.title;
    const synopsis = data.synopsis;
    const imageUrl = data.images.jpg.image_url; 
    const episodes = data.episodes;
    const status = data.status;
    const message = `📺 Titre: ${title}\n🎬 Épisodes: ${episodes}\n📡 Statut: ${status}\n📝 Synopsis: ${synopsis}\n🔗 URL: ${data.url}\n\n> ${global.caption}`;
      const infoMess = {
        image: { url: imageUrl },
        caption: message,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363322606369079@newsletter',
                        newsletterName: "PRINCE TECH",
            serverMessageId: 143
          }
        }
      };
await Gifted.sendMessage(from, infoMess, { quoted: mek });
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})


gmd({
    pattern: "loli",
    alias: ["imgloli"],
    react: '💫',
    desc: "Download Loli Anime Images.",
    category: "anime",
    use: '.loli',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.lolicon.app/setu/v2?num=1&r18=0&tag=lolicon')
await Gifted.sendMessage(from, { image: { url: res.data.data[0].urls.original }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "waifu",
    alias: ["imgwaifu"],
    react: '💫',
    desc: "Download Waifu Anime Images.",
    category: "anime",
    use: '.waifu',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/waifu')
await Gifted.sendMessage(from, { image: { url: res.data.url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(cants)
console.log(e)
}
})

gmd({
    pattern: "neko",
    alias: ["imgneko"],
    react: '💫',
    desc: "Download Neko Anime Images.",
    category: "anime",
    use: '.neko',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/neko')
await Gifted.sendMessage(from, { image: { url: res.data.url  }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})
  
gmd({
    pattern: "megumin",
    alias: ["imgmegumin"],
    react: '💫',
    desc: "Download Megumin Anime Images.",
    category: "anime",
    use: '.megumin',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/megumin')
await Gifted.sendMessage(from, { image: { url: res.data.url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "maid",
    alias: ["imgmaid"],
    react: '💫',
    desc: "Download Maid Anime Images.",
    category: "anime",
    use: '.maid',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.im/search/?included_tags=maid')
await Gifted.sendMessage(from, { image: { url: res.data.images[0].url  }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})

gmd({
    pattern: "awoo",
    alias: ["imgawoo"],
    react: '💫',
    desc: "Download Awoo Anime Images.",
    category: "anime",
    use: '.awoo',
    filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let res = await axios.get('https://api.waifu.pics/sfw/awoo')
await Gifted.sendMessage(from, { image: { url: res.data.url }, caption: `> ${global.footer}` }, { quoted: mek })
await m.react("✅"); 
} catch (e) {
reply(e)
console.log(e)
}
})
