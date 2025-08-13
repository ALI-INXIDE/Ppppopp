const { File } = require("megajs");
const { https } = require("follow-redirects");
const unzipper = require("unzipper");
const { exec } = require("child_process"),
   path = require("path"),
    fs = require("fs"),
    os = require("os"),
     axios = require("axios"),
    AdmZip = require("adm-zip");
    git = require("git"),
    { gmd, config, commands, runtime, sleep } = require("../lib"),
    { BOT_PIC: botPic, 
      MODE: botMode, 
      VERSION: version,
      PREFIX: prefix, 
      TIME_ZONE: tz } = config, 
    moment = require("moment-timezone"),
    more = String.fromCharCode(8206),
    readmore = more.repeat(4001);

const byteToKB = 1 / 1024;
const byteToMB = byteToKB / 1024;
const byteToGB = byteToMB / 1024;

function formatBytes(bytes) {
    if (bytes >= Math.pow(1024, 3)) {
        return (bytes * byteToGB).toFixed(2) + " GB";
    } else if (bytes >= Math.pow(1024, 2)) {
        return (bytes * byteToMB).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
        return (bytes * byteToKB).toFixed(2) + " KB";
    } else {
        return bytes.toFixed(2) + " bytes";
    }
}

const totalMemoryBytes = os.totalmem();
const freeMemoryBytes = os.freemem();
const ram = `${formatBytes(freeMemoryBytes)}/${formatBytes(totalMemoryBytes)}`;


gmd({
    pattern: "system",
    alias: ["status"],
    react: "⚙️",
    desc: "Check Bot's System Status",
    category: "system",
    filename: __filename
},
async(Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {

    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
    
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
const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
}).format(now);
const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
}).format(now);

const uptime = formatUptime(process.uptime());
        
        let giftedMess = {
            image: { url: botPic },
            caption: `\`「 BOT SYSTEM STATUS 」\`
╭───────────────────⊷
│⌛ *Mode:*  ${botMode}
│🚅 *Prefix:*  [ ${prefix} ]
│👮 *User:*  ${pushname}
│🎯 *Version:*  ${version}
│🛜 *Plugins:* ${commands.filter((command) => command.pattern).length}
│⏰ *Uptime:* ${uptime} 
│🕐 *Time Now:*  ${time}
│📆 *Date Today:*  ${date}
🏷️ *Platform:* ${os.platform()}
│🏞 *Time Zone:* ${tz}
│💻 *RAM Usage:* ${ram}
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
});

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
});


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
});

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
});



gmd({
    pattern: "checkupdate",
    desc: "Check for new Updates on GitHub Repository",
    category: "system",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        if (!isOwner) return reply("Owner Only Command!");
        const fetchCommits = async () => {
            const response = await fetch(`${global.giftedApiRepo}/commits`);
            const commits = await response.json();
            return commits;
        };
        const commits = await fetchCommits();
        const latestCommit = commits[0];
        let newCommits = "New Updates:\n";
        for (let i = 0; i < commits.length; i++) {
            newCommits += `\n│ ☄︎ *Commit ${i + 1}:* ${commits[i].commit.message} - ${commits[i].commit.author.name}\n  ${commits[i].html_url}`;
        }
        reply(newCommits);
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

gmd({
    pattern: "checkstatus",
    desc: "Check the Status of the Bot",
    category: "system",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        exec("pm2 status", (err, stdout, stderr) => {
            if (err || stderr) {
                console.error(err || stderr);
                return reply(`❌ Error: ${stderr || err.message}`);
            }
            reply(`✔️ Bot status:\n${stdout}`);
        });
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});



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
