const { gmd, config, commands, getBuffer, getSudoNumbers,
  addSudo, removeSudo, fetchJson } = require('../lib'), 
      { PREFIX, 
       TIME_ZONE: tz } = config, 
       fs = require('fs'), 
       path = require('path'), 
       axios = require('axios'), 
       util = require('util'), 
       moment = require('moment-timezone'), 
      { exec } = require('child_process'), 
      { WA_DEFAULT_EPHEMERAL, 
       downloadContentFromMessage, 
       makeInMemoryStore } = require('@whiskeysockets/baileys');
//const store = makeInMemoryStore({});

let chatbotEnabled = false, 
       chatbotInGroups = false, 
       chatbotInInbox = false, 
       autoBioEnabled = false;
let autoBioInterval;
let secondCount = 1;  

autoBioEnabled = config.AUTO_BIO === "true";
chatbotEnabled = config.CHAT_BOT === "true";
chatbotInInbox = config.CHAT_BOT === "inbox";
chatbotInGroups = config.CHAT_BOT === "groups";


function saveConfig() {
    let configContent = '';
    for (let key in config) {
        configContent += `${key}=${config[key]}\n`;
    }
    const envFilePath = path.resolve(__dirname, '../.env');
    fs.writeFileSync(envFilePath, configContent, 'utf8');
}

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

gmd({
    pattern: "broadcast",
    desc: "Broadcast a Message to All Groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (args.length === 0) return reply("📢 Provide a message to breadcast after the command.");
    const message = args.join(' ');
    const groups = Object.keys(await Gifted.groupFetchAllParticipating());
    for (const groupId of groups) {
    await Gifted.sendMessage(groupId, {
    image: { url: config.BOT_PIC },
    caption: message 
}, { quoted: mek });

    }
    reply("📢 Message Delivered to all your groups.");
});



    gmd({
    pattern: "setpp",
    desc: "Set Bot Profile Picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (Gifted, mek, m, { isOwner, quoted, reply }) => {
    try {
        if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");

        if (!quoted || quoted.mtype !== "image") {
            return reply("❌ Please reply to an image.");
        }

        const buffer = await quoted.download(); // gets image as buffer

        if (!buffer) return reply("⚠️ Could not download the image.");

        await Gifted.updateProfilePicture(Gifted.user.id, buffer);
        reply("✅ Bot profile picture updated successfully!");
    } catch (error) {
        console.error("❌ Error updating profile picture:", error);
        reply(`❌ Failed to update profile picture: ${error.message}`);
    }
});

gmd({
    pattern: "exec",
    alias: ["$", "run", "terminal", "code", "execute", ">", "shell"],
    desc: "Execute Terminal Commands.",
    category: "owner",
    react: "💻",
    filename: __filename
}, async (Gifted, mek, m, { reply, isOwner, isMe, botNumber2, botNumber, q }) => {
    if (!isOwner && !isMe && !botNumber2 && !botNumber) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!q) return reply("Provide a terminal command to execute.");
    exec(q, (err, stdout, stderr) => {
        if (err) return reply(`❌ Error: ${err.message}`);
        if (stderr) return reply(`⚠️ Stderr: ${stderr}`);
        if (stdout) reply(stdout.trim());
    });
});




gmd({
    pattern: "eval3",
    alias: ["<", "e", "evaluate"],
    desc: "Evaluate JavaScript Code.",
    category: "owner",
    react: "🧠",
    filename: __filename
}, async (Gifted, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!q) return reply("Provide some code to evaluate.");

    try {
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

        const fn = new AsyncFunction("Gifted", "mek", "m", "reply", "console", `
            (async () => {
                try {
                    ${q}
                } catch (innerErr) {
                    await reply("❌ Eval Error: " + (innerErr?.stack || innerErr?.message || innerErr));
                }
            })();
        `);

        await fn(Gifted, mek, m, reply, console);
    } catch (err) {
        await reply("❌ Fatal Eval Error: " + (err?.stack || err?.message || err));
    }
});

gmd({
    pattern: "eval",
    alias: ["<", "e", "evaluate"],
    desc: "Evaluate JavaScript Code.",
    category: "owner",
    react: "🧠",
    filename: __filename
}, async (Gifted, mek, m, { reply, isOwner, q }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!q) return reply("Provide some code to evaluate.");
    try {
        let result = /await/i.test(q)
            ? await eval(`(async () => { ${q} })()`)
            : eval(q);
        reply(util.format(result));
    } catch (err) {
        reply(`❌ Error: ${util.format(err)}`);
    }
});



gmd({
    pattern: "fetch",
    alias: ["get", "download", "load", "axios"],
    desc: "Get Data/Files from URLs",
    category: "owner",
    react: "🔎",
    filename: __filename
}, async (Gifted, mek, m, { from, reply, isOwner, q }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!q) return reply("Provide a URL to get data from");
    if (!/^https?:\/\//.test(q)) return reply('Start the *URL* with http:// or https://');
    try {
        const url = new URL(q).href;
        const response = await fetch(url);
        const contentLength = response.headers.get('content-length');
        if (contentLength && contentLength > 50 * 1024 * 1024) {
            return reply(`❌ Content-Length exceeds limit: ${contentLength}`);
        }
        const contentType = response.headers.get('content-type') || '';
        if (/image\//.test(contentType)) {
            const buffer = Buffer.from(await response.arrayBuffer());
            await Gifted.sendMessage(from, { image: buffer, caption: `> ${global.footer}` });
            return;
        } else if (/audio\//.test(contentType)) {
            const buffer = Buffer.from(await response.arrayBuffer());
            await Gifted.sendMessage(from, { audio: buffer, mimetype: contentType, ptt: false }); 
            return;
        } else if (/video\//.test(contentType)) {
            const buffer = Buffer.from(await response.arrayBuffer());
            await Gifted.sendMessage(from, { video: buffer, caption: `> ${global.footer}` });
            return;
        }
        let content = '';
        if (/application\/json/.test(contentType)) {
            content = JSON.stringify(await response.json(), null, 2);
        } else if (/text/.test(contentType)) {
            content = await response.text();
        } else {
            return reply("❌ Unsupported content type.");
        }
        reply(content.slice(0, 65536)); 
    await m.react("✅"); 
    } catch (error) {
        console.error('Fetch Error:', error);
        reply(`❌ Error: ${error.message}`);
    }
});


gmd({
    pattern: "pair",
    alias: ["getsess", "paircode", "linkphone", "getpaircodd"],
    desc: "Generate Paircode",
    category: "owner",
    react: "📱",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!q) return reply("Provide a Phone Number to Genrrate PairingCode!");
    try {
        const response = await fetchJson(`${global.session}/code?number=${encodeURIComponent(q)}`);
        const getsess = response.code;
        const answer = `Dear *_${m.pushName}_*,\nYour ALI MD PairingCode is: *${getsess}*\nUse it to Link Your WhatsApp Within 1 Minute Before it Expires\nThereafter, Obtain Your Session ID.\nHappy Bot Deployment!!!\n\n${global.caption}`;
        const giftedMess = {
        image: { url: config.BOT_PIC },
        caption: answer,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 5,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
            serverMessageId: 143
          }
        }
      };
      await Gifted.sendMessage(from, giftedMess, { disappearingMessagesInChat: true, ephemeralExpiration: 100 }, { quoted: mek });
      await Gifted.sendMessage(from, { text: getsess }, { quoted: mek });
      await m.react('✅');
  } catch (error) {
        reply(`❌ Error fetching paircode code: ${error.message}`);
    }
});



gmd({
    pattern: "welcome",
    alias: ["setwelcome"],
    desc: "Enable or Disable Welcome Messages in Groups",
    category: "owner",
    react: "👋",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє gʀσυρ ωєℓ¢σмє мєѕѕαgєѕ*
*2. тσ ∂ιѕαвℓє gʀσυρ ωєℓ¢σмє мєѕѕαgєѕ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("👋");
                switch (messageContent) {
                    case "1": 
                        config.WELCOME = "true";
                        saveConfig();
                        return reply("Welcome messages are enabled.");
                        break;

                    case "2": 
                        config.WELCOME = "false";
                        saveConfig();
                        return reply("Welcome messages are disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});




gmd({
    pattern: "goodbye",
    alias: ["setgoodbye"],
    desc: "Enable or Disable Goodbye Messages in Groups",
    category: "owner",
    react: "👋",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐆𝐎𝐎𝐃𝐁𝐘𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє gʀσυρ gσσ∂вує мєѕѕαgєѕ*
*2. тσ ∂ιѕαвℓє gʀσυρ gσσ∂вує мєѕѕαgєѕ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("👋");
                switch (messageContent) {
                    case "1": 
                        config.GOODBYE = "true";
                        saveConfig();
                        return reply("Goodbye messages are enabled.");
                        break;

                    case "2": 
                        config.GOODBYE = "false";
                        saveConfig();
                        return reply("Goodbye messages are disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});




gmd({
    pattern: "myprivacy",
    alias: ["allprivacy", "listprivacy", "privacy", "privacy-settings", "myprivacy"],
    desc: "Get Current Privacy Settings",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const privacySettings = await Gifted.fetchPrivacySettings(true);
        console.log("Privacy settings: " + JSON.stringify(privacySettings));
        reply(`*💬 Current Privacy Settings:*\n\n${JSON.stringify(privacySettings, null, 2)}`);
    } catch (error) {
        reply(`❌ Error fetching privacy settings: ${error.message}`);
    }
});

gmd({
    pattern: "lastseen",
    desc: "Update Last Seen Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        await Gifted.updateLastSeenPrivacy(value);
        reply(`✅ Last seen privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating last seen privacy: ${error.message}`);
    }
});

gmd({
    pattern: "online",
    desc: "Update Online Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'match_last_seen'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'match_last_seen'.");
        await Gifted.updateOnlinePrivacy(value);
        reply(`✅ Online privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating online privacy: ${error.message}`);
    }
});

gmd({
    pattern: "myprofile-pic",
    desc: "Update Profile Picture Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];  
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");     
        await Gifted.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating profile picture privacy: ${error.message}`);
    }
});

gmd({
    pattern: "mystatus",
    desc: "Update Status Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none']; 
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'."); 
        await Gifted.updateStatusPrivacy(value);
        reply(`✅ Status privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating status privacy: ${error.message}`);
    }
});

gmd({
    pattern: "read-receipts",
    desc: "Update Read Receipts Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂**📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'none'];    
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'none'.");   
        await Gifted.updateReadReceiptsPrivacy(value);
        reply(`✅ Read receipts privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating read receipts privacy: ${error.message}`);
    }
});

gmd({
    pattern: "groups-privacy",
    desc: "Update Group add Privacy",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const value = args[0] || 'all'; 
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options are: 'all', 'contacts', 'contact_blacklist', 'none'.");
        await Gifted.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy updated to: ${value}`);
    } catch (error) {
        reply(`❌ Error updating group add privacy: ${error.message}`);
    }
});

gmd({
    pattern: "setdisapp",
    alias: ["disappearing", "default-disapp", "disapp-msgs"],
    desc: "Update Default Disappearing Messages",
    category: "owner",
    react: "🔐",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, isItzcp, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const duration = args[0] || 86400; // Default to 86400 (1 day)
        
        await Gifted.updateDefaultDisappearingMode(duration);
        reply(`✅ Default disappearing messages updated to: ${duration} seconds`);
    } catch (error) {
        reply(`❌ Error updating disappearing messages: ${error.message}`);
    }
});


gmd({
    pattern: "block",
    desc: "Block a User.",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the bot owner!");
    if (!m.quoted) return reply("❌ Please reply to the user you want to block.");
    const user = quoted.sender;
    try {
        await Gifted.updateBlockStatus(user, 'block');
        reply('🚫 User ' + user + ' blocked successfully.');
    } catch (error) {
        reply('❌ Error blocking user: ' + error.message);
    }
});

gmd({
    pattern: "unblock",
    desc: "Unblock a User.",
    category: "owner",
    react: "✅",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (!m.quoted) return reply("❌ Please reply to the user you want to unblock.");
    const user = quoted.sender;
    try {
        await Gifted.updateBlockStatus(user, 'unblock');
        reply(`✅ User ${user} unblocked successfully.`);
    } catch (error) {
        reply(`❌ Error unblocking user: ${error.message}`);
    }
});

gmd({
pattern: "del",
react: "🧹",
alias: ["delete"],
desc: "Delete Message",
category: "owner",
use: '.del',
filename: __filename
},
async(Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
if (!isOwner) return;
try{
if (!m.quoted) return reply('No Message Quoted for Deletion');
const key = {
            remoteJid: m.chat,
            fromMe: false,
            id: m.quoted.id,
            participant: m.quoted.sender
        }
        await Gifted.sendMessage(m.chat, { delete: key })
await m.react("✅"); 
} catch(e) {
console.log(e);
reply('success..')
} 
})

gmd({
    pattern: "clearchats",
    alias: ["clear", "delchats"],
    desc: "Clear all Chats.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const chats = Gifted.chats.all();
        for (const chat of chats) {
            await Gifted.modifyChat(chat.jid, 'delete');
        }
        reply("🧹 All Chats Successfully cleared!");
    } catch (error) {
        reply(`❌ Error: ${error.message}`);
    }
});

gmd({
    pattern: "jid",
    desc: "Get the Bot's JID.",
    category: "owner",
    react: "🤖",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    reply(`🤖 *Bot JID:* ${Gifted.user.id}`);
});


gmd({
    pattern: "gjid",
    alias: ["groupjids"],
    desc: "Get the list of JIDs for all groups the bot is part of.",
    category: "group",
    react: "📝",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const groups = await Gifted.groupFetchAllParticipating();
    const groupJids = Object.keys(groups).join('\n');
    reply(`📝 *Group JIDs:*\n\n${groupJids}`);
});        

gmd({
    pattern: "archive",
    desc: "Archive a Specific Chat",
    category: "owner",
    react: "📦",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        store.bind(Gifted.ev);
        Gifted.store = store;
        const chatId = from; 
        const chatMessages = await Gifted.store.messages[chatId]?.last; 
        if (!chatMessages) {
            return reply("❌ No messages found in this chat!");
        }
        await Gifted.chatModify({ archive: true, lastMessages: [chatMessages] }, chatId);
        reply("📦 Chat archived successfully!");
    } catch (error) {
        reply(`❌ Error archiving chat: ${error.message}`);
    }
});


gmd({
    pattern: "pin",
    desc: "Pin a Specific Chat",
    category: "owner",
    react: "📌",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        await Gifted.chatModify({ pin: true }, from);
        reply("📌 Chat pinned successfully!");
    } catch (error) {
        reply(`❌ Error pinning chat: ${error.message}`);
    }
});

gmd({
    pattern: "unpin",
    desc: "Unpin a Specific Chat",
    category: "owner",
    react: "📌",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        await Gifted.chatModify({ pin: false }, from);
        reply("📌 Chat unpinned successfully!");
    } catch (error) {
        reply(`❌ Error unpinning chat: ${error.message}`);
    }
});


gmd({
    pattern: "star",
    desc: "Star a Specific Message in a Chat",
    category: "owner",
    react: "⭐",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const messageId = args[0];
        await Gifted.chatModify({
            star: { messages: [{ id: messageId, fromMe: true, star: true }] }
        }, from);
        reply("⭐ Message starred!");
    } catch (error) {
        reply(`❌ Error starring message: ${error.message}`);
    }
});

gmd({
    pattern: "unstar",
    desc: "Unstar a Specific Message in a Chat",
    category: "owner",
    react: "⭐",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const messageId = args[0];
        await Gifted.chatModify({
            star: { messages: [{ id: messageId, fromMe: true, star: false }] }
        }, from);
        reply("⭐ Message unstarred!");
    } catch (error) {
        reply(`❌ Error unstarring message: ${error.message}`);
    }
});


gmd({
    pattern: "disapp-on",
    desc: "Turn on Disappearing Messages",
    category: "owner",
    react: "⏳",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const jid = from; 
        await Gifted.sendMessage(jid, { disappearingMessagesInChat: WA_DEFAULT_EPHEMERAL });
        reply("⏳ Disappearing messages turned on!");
    } catch (error) {
        reply(`❌ Error enabling disappearing messages: ${error.message}`);
    }
});


gmd({
    pattern: "disapp-off",
    desc: "Turn off Disappearing Messages",
    category: "owner",
    react: "⏳",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const jid = from;
        await Gifted.sendMessage(jid, { disappearingMessagesInChat: false });
        reply("⏳ Disappearing messages turned off!");
    } catch (error) {
        reply(`❌ Error disabling disappearing messages: ${error.message}`);
    }
});


gmd({
    pattern: "onwa",
    desc: "Check if a Number is on WhatsApp",
    category: "owner",
    react: "📱",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const id = args[0];
        const [result] = await Gifted.onWhatsApp(id);
        if (result.exists) {
            reply(`${id} exists on WhatsApp, as jid: ${result.jid}`);
        } else {
            reply(`${id} does not exist on WhatsApp.`);
        }
    } catch (error) {
        reply(`❌ Error checking WhatsApp number: ${error.message}`);
    }
});


gmd({
    pattern: "wa",
    desc: "Generates a wa.me link for the Mentioned/Quoted User.",
    category: "owner",
    filename: __filename,
}, async (Gifted, mek, m, { quoted, text, args, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        let user;
        if (m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
            user = m.message.extendedTextMessage.contextInfo.mentionedJid[0].split('@')[0];
        } else if (quoted) {
            user = quoted.sender.split('@')[0];
        } else if (text) {
            user = text.replace('@', '');
        } else {
            return Gifted.sendMessage(m.key.remoteJid, { text: "Please mention a user, quote a message, or provide a number." }, { quoted: mek });
        }
        return Gifted.sendMessage(m.key.remoteJid, { text: `https://wa.me/${user}` }, { quoted: mek });
    } catch (error) {
        console.error(error);
        return Gifted.sendMessage(m.key.remoteJid, { text: "An error occurred while processing your request." }, { quoted: mek });
    }
});


gmd({
    pattern: "setstatus",
    desc: "Change Profile Status",
    category: "owner",
    react: "📲",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const status = args.join(" ");
        await Gifted.updateProfileStatus(status);
        reply(`📲 Profile status updated to: ${status}`);
    } catch (error) {
        reply(`❌ Error changing profile status: ${error.message}`);
    }
});

gmd({
    pattern: "setmyname",
    desc: "Change Profile Name",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, reply, args }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    try {
        const name = args.join(" ");
        await Gifted.updateProfileName(name);
        reply(`📝 Profile name updated to: ${name}`);
    } catch (error) {
        reply(`❌ Error changing profile name: ${error.message}`);
    }
});


gmd({
    pattern: "chatbot",
    desc: "Enable or Disable Chatbot",
    category: "owner",
    react: "🤖",
    filename: __filename
}, async (Gifted, mek, m, { from, body, isGroup, isOwner, q, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isOwner) return reply('*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*');
          
          const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐂𝐇𝐀𝐓𝐁𝐎𝐓 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє gℓσвαℓℓу*
*2. тσ єɴαвℓє ιɴ gʀσυρѕ*
*3. тσ єɴαвℓє ιɴ ιɴвσχ*
*4. тσ ∂ιѕαвℓє gℓσвαℓℓу*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("🤖");
                switch (messageContent) {
                    case "1": 
                       chatbotEnabled = true;
                       return reply("*Chatbot has been enabled globally(all chats)!*");
                        break;

                    case "2": 
                        chatbotInGroups = true;
                        chatbotInInbox = false;
                        return reply("*Chatbot will work in group chats Only!*");
                        break;

                    case "3": 
                        chatbotInInbox = true;
                        chatbotInGroups = false;
                        return reply("*Chatbot will work in personal chats (inbox) Only!*");
                        break;

                    case "4": 
                        chatbotEnabled = false;
                        return reply("*Chatbot has been disabled globally(all chats)!*");
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, 3 or 4)." });
                }
            }
        }); 
      await m.react("✅");
    } catch (e) {
        console.log(e);
        reply(`Error: ${e}`);
    }
});

gmd({
    on: "body"
}, async (Gifted, mek, m, { from, body, isMe, isOwner, isGroup, reply }) => {
    try {
        if (chatbotEnabled) {
            if (isMe) {
                return;
            }
            if ((chatbotInGroups && !isGroup) || (chatbotInInbox && isGroup)) {
                return; 
            }
            const q = body;
            let data;
            try {
                data = await fetchJson(`${global.api}/ai/gpt?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
                if (data && data.result) {
                     return reply(data.result);
                }
            } catch (e) {
                console.log('Gpt API failed or no valid response:', e);
            }
            try {
                data = await fetchJson(`${global.api}/ai/geminiaipro?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
                if (data && data.result) {
                  return reply(data.result);
                }
            } catch (e) {
                console.log('Gemini API failed or no valid response:', e);
            }
            try {
                data = await fetchJson(`${global.api}/ai/gpt-turbo?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
                if (data && data.result) {
                   return reply(data.result);
                }
            } catch (e) {
                console.log('GPT-3 Turbo API failed or no valid response:', e);
            }
            try {
                data = await fetchJson(`${global.api}/ai/geminiai?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
                if (data && data.result) {
                   return reply(data.result);
                }
            } catch (e) {
                console.log('Gemini failed or no valid response:', e);
            }
            return reply("Sorry, I couldn't generate a response. Please try again later.");
        }

        if (config.AUTO_BIO === "true") {
            startAutoBio(Gifted);
            console.log("👨‍💻 AutoBIO started automatically as per config.");
        }
        // Auto audio
        if (config.AUTO_AUDIO === 'true') {
            try {
                let { data } = await axios.get('https://github.com/edugifted/gifted-db/raw/refs/heads/main/autovoice/autovoice.json');
                for (let vr in data) {
                    let escapedVr = vr.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                    let regex = new RegExp(`\\b${escapedVr}\\b`, 'gi');
                    if (regex.test(body)) {
                      const buffer = await getBuffer(data[vr]);
                        return Gifted.sendMessage(from, {
                            audio: buffer,
                            mimetype: 'audio/mpeg',
                            ptt: true
                        }, { quoted: mek });
                    }
                }
            } catch (error) {
                console.error(error);
                reply("An error occurred while processing the message.");
            }
        }
    } catch (error) {
        console.error(error);
        reply("An unexpected error occurred.");
    }
});

gmd({
    pattern: "autoread",
    alias: ["setautoread", "setread", "readmessages", "setreadmessages", "autoreadmessages", "setautoreadmessages"],
    desc: "Enable or Disable Auto Read Messages",
    category: "owner",
    react: "📖",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐔𝐓𝐎 𝐑𝐄𝐀𝐃 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσʀєα∂ αℓℓ мєѕѕαgєѕ*
*2. тσ єɴαвℓє αυтσʀєα∂ ¢σммαɴ∂ѕ σɴℓу*
*3. тσ ∂ιѕαвℓє αυтσʀєα∂ fєαтυʀє gℓσвαℓℓу*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("📖");
                switch (messageContent) {
                    case "1": 
                       config.AUTO_READ_MESSAGES = "true";
                       saveConfig();
                       return reply("Auto Read is enabled for all.");
                        break;

                    case "2": 
                        config.AUTO_READ_MESSAGES = "commands";
                        saveConfig();
                        return reply("*Auto Read is enabled for commands only*");
                        break;

                    case "3": 
                        config.AUTO_READ_MESSAGES = "false";
                        saveConfig();
                        return reply("Auto Read is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2 or 3)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "autoview",
    alias: ["setviewstatus", "setautoview", "autoviewstatus", "viewstatus", "setautoviewstatus"],
    desc: "Enable or disable Auto Read",
    category: "owner",
    react: "📖",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐒𝐓𝐀𝐓𝐔𝐒 𝐕𝐈𝐄𝐖 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσνιєω ѕтαтυѕ*
*2. тσ ∂ιѕαвℓє αυтσνιєω ѕтαтυѕ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("📖");
                switch (messageContent) {
                    case "1": 
                       config.AUTO_READ_STATUS = "true";
                       saveConfig();
                       return reply("Auto View Status is enabled.");
                        break;

                    case "2": 
                        config.AUTO_READ_STATUS = "false";
                        saveConfig();
                        return reply("Auto View Status is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "autolike",
    alias: ["setlikestatus", "setautolike", "autolikestatus", "likestatus", "setautolikestatus"],
    desc: "Enable or disable Auto Like Status",
    category: "owner",
    react: "👍",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂**📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐒𝐓𝐀𝐓𝐔𝐒 𝐋𝐈𝐊𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσℓιкє ѕтαтυѕ*
*2. тσ ∂ιѕαвℓє αυтσℓιкє ѕтαтυѕ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("📖");
                switch (messageContent) {
                    case "1": 
                       config.AUTO_LIKE_STATUS = "true";
                       saveConfig();
                       return reply("Auto Like Status is enabled.");
                        break;

                    case "2": 
                        config.AUTO_LIKE_STATUS = "false";
                        saveConfig();
                        return reply("Auto Like Status is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "autoreact",
    alias: ["setautoreact", "areact", "setareact"],
    desc: "Enable or Disable Auto React to all Messages",
    category: "owner",
    react: "❤️",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐔𝐓𝐎 𝐑𝐄𝐀𝐂𝐓 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσʀєα¢т*
*2. тσ ∂ιѕαвℓє αυтσʀєα¢т*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("❤️");
                switch (messageContent) {
                    case "1": 
                       config.AUTO_REACT = "true";
                       saveConfig();
                       return reply("Auto React is enabled.");
                        break;

                    case "2": 
                       config.AUTO_REACT = "false";
                       saveConfig();
                       return reply("Auto React is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "anticall",
    alias: ["setanticall"],
    desc: "Enable or Disable Anticall",
    category: "owner",
    react: "📵",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐍𝐓𝐈𝐂𝐀𝐋𝐋 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ ∂є¢ℓιɴє ¢αℓℓѕ*
*2. тσ ∂є¢ℓιɴє & вℓσ¢к ¢αℓℓєʀѕ*
*3. тσ ∂ιѕαвℓє αɴтι¢αℓℓ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇🤖");
                switch (messageContent) {
                    case "1": 
                       config.ANTICALL = "true";
                       saveConfig();
                        return reply("Anticall has been enabled! Calls will be declined without any action.");

                    case "2": 
                       config.ANTICALL = "block";
                       saveConfig();
                       return reply("Anticall has been set to decline calls and  block callers!");
                        break;

                    case "3": 
                        config.ANTICALL = "false";
                        saveConfig();
                        return reply("Anticall has been disabled!");
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, or 3 )." });
                }
            }
        }); 
      await m.react("✅");
});




gmd({
    pattern: "antiword",
    alias: ["setantiword"],
    desc: "Enable or Disable Anti Word Feature",
    category: "owner",
    react: "🛑",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐍𝐓𝐈𝐖𝐎𝐑𝐃 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αɴтιωσʀ∂*
*2. тσ ∂ιѕαвℓє αɴтιωσʀ∂*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("🛑");
                switch (messageContent) {
                    case "1": 
                        config.ANTIWORD = "true";
                        saveConfig();
                        return reply("Anti Word is enabled.");
                        break;

                    case "2": 
                        config.ANTIWORD = "false";
                        saveConfig();
                        return reply("Anti Word is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "autoaudio",
    alias: ["setautoaudio", "autovoice", "setautovoice"],
    desc: "Enable or Disable Auto Reply Status Feature",
    category: "owner",
    react: "💬",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐔𝐓𝐎 𝐀𝐔𝐃𝐈𝐎 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσαυ∂ισ*
*2. тσ ∂ιѕαвℓє αυтσαυ∂ισ*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("💬");
                switch (messageContent) {
                    case "1": 
                        config.AUTO_AUDIO = "true";
                        saveConfig();
                        return reply("Auto Audio Reply is enabled.");
                        break;

                    case "2": 
                        config.AUTO_AUDIO = "false";
                        saveConfig();
                        return reply("Auto Audio Reply is disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});


gmd({
    pattern: "mode",
    alias: ["setmode", "botmode", "newmode"],
    desc: "Set Bot Mode",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐌𝐎𝐃𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє ρυвℓι¢ мσ∂є
*2. тσ єɴαвℓє ρʀιναтє мσ∂є*
*3. тσ єɴαвℓє ιɴвσχ мσ∂є*
*4. тσ єɴαвℓє gʀσυρ мσ∂є*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("⬇🔄");
                switch (messageContent) {
                    case "1": 
                        config.MODE = "public";
                        saveConfig();
                        return reply("Bot Mode Has Been Set to Public (All Chats).");
                        break;

                    case "2": 
                        config.MODE = "private";
                        saveConfig();
                        return reply("Bot Mode Has Been Set to Private.");
                        break;

                    case "3": 
                        config.MODE = "inbox";
                        saveConfig();
                        return reply("Bot Has Been Set to Work in Inbox(pm) Only.");
                        break;

                    case "4": 
                        config.MODE = "groups";
                        saveConfig();
                        return reply("Bot Has Been Set to work in Groups Only.");
                        break;

                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, 3 or 4)." });
                }
            }
        }); 
      await m.react("✅");
});


gmd({
    pattern: "prefix",
    alias: ["setprefix", "newprefix", "changeprefix"],
    desc: "Change Bot Prefix",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async (Gifted, mek, m, { from, q, reply, isOwner }) => {
    try {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
        const newPrefix = q.trim().toLowerCase();
        if (!newPrefix) {
            return reply("Please provide a new prefix.");
        }
        config.PREFIX = newPrefix;
        saveConfig(); 
        return reply(`Bot prefix has been changed to: ${newPrefix}`);
    } catch (error) {
        console.error(error);
        reply("An error occurred while changing the prefix.");
    }
});

gmd({
    pattern: "setstatusreplymsg",
    alias: ["statusreplymsg", "statusreplymessage", "setstatusreplymessage"],
    desc: "Change Status Reply Message",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async (Gifted, mek, m, { from, q, reply, isOwner }) => {
    try {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
        const newMsg = q.trim();
        if (!newMsg) {
            return reply("Please provide a new status reply message.");
        }
        config.STATUS_REPLY_MSG = newMsg;
        saveConfig(); 
        return reply(`Status Reply Message has been changed to: ${newMsg}`);
    } catch (error) {
        console.error(error);
        reply("An error occurred while changing the status reply message.");
    }
});

gmd({
    pattern: "statusreact",
    alias: ["statuslikeemoji", "autolikeeoji", "setlikeemoji", "setstatuslikeemoji"],
    desc: "Change Status Like Emoji",
    category: "owner",
    react: "🔄",
    filename: __filename
}, async (Gifted, mek, m, { from, q, reply, isOwner }) => {
    try {
      if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
        const newEmoji = q.trim();
        
        if (!newEmoji) {
            return reply("Please provide a new status like emoji.");
        }
        config.AUTO_LIKE_EMOJI = newEmoji;
        saveConfig(); 
        return reply(`Bot status like emoji has been changed to: ${newEmoji}`);
    } catch (error) {
        console.error(error);
        reply("An error occurred while changing the status like emoji.");
    }
});

gmd({
    pattern: "antilink",
    alias: ["setantilink"],
    desc: "Enable/Disable Anti-Link Feature",
    category: "owner",
    react: "🔗",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
      const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐍𝐓𝐈𝐋𝐈𝐍𝐊 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αɴтιℓιɴк => ωαʀɴ*
*2. тσ єɴαвℓє αɴтιℓιɴк => ∂єℓєтє*
*3. тσ єɴαвℓє αɴтιℓιɴк => ʀємσνє/кι¢к*
*4. тσ ∂ιѕαвℓє αɴтιℓιɴк fєαтυʀє*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("🔗");
                switch (messageContent) {
                    case "1": 
                        config.ANTILINK = "warn";  
                        saveConfig();
                        return reply("Anti Link is enabled. Links will be deleted and users warned 3 times before being removed.");
                        break;

                    case "2": 
                        config.ANTILINK = "delete";  
                        saveConfig();
                        return reply("Anti Link is enabled. Links will be deleted without users being removed.");
                        break;

                    case "3": 
                        config.ANTILINK = "true";  
                        saveConfig();
                        return reply("Anti Link is enabled. Users who send links will be automatically removed.");
                        break;

                    case "4": 
                        config.ANTILINK = "false";  
                        saveConfig();
                        return reply("Anti Link is disabled. Links will not be moderated.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, 3 or 4)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "antidelete",
    desc: "Enable or Disable the Antiddelete Feature.",
    category: "owner",
    react: "🍀",
    filename: __filename
}, async (Gifted, mek, m, { from, isOwner, q, reply }) => {
    if (!isOwner) return reply("Owner Only Command!");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐍𝐓𝐈𝐃𝐄𝐋𝐄𝐓𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє gℓσвαℓℓу*
*2. тσ єɴαвℓє fσʀ ¢нαтѕ σɴℓу*
*3. тσ єɴαвℓє fσʀ ¢нαтѕ & gʀσυρѕ*
*4. тσ ∂ιѕαвℓє αɴтι∂єℓєтє*

╭───────────────┄┈┈  
│ *${global.footer}*
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("🍀");
                switch (messageContent) {
                    case "1": 
                        config.ANTI_DELETE = "true";
                        saveConfig();
                        return reply("Antidelete Has Been Enabled Globally( Chats, Groups and Statuses).");
                        break;

                    case "2": 
                        config.ANTI_DELETE = "inboxonly";
                        saveConfig();
                        return reply("Antidelete Has Been Enabled for Chats Only.");
                        break;

                    case "3": 
                        config.ANTI_DELETE = "chatsonly";
                        saveConfig();
                        return reply("Antidelete Has Been Enabled for Chats & Groups.");
                        break;

                    case "4": 
                        config.ANTI_DELETE = "false";
                        saveConfig();
                        return reply("Antidelete Has Been Disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, 3 or 4)." });
                }
            }
        }); 
      await m.react("✅");
});


gmd({
    pattern: "presence",
    alias: ["setpresence", "wapresence", "setwapresence"],
    desc: "Set Bot Wapresence",
    category: "owner",
    react: "💬",
    filename: __filename
}, async (Gifted, mek, m, { from, q, body, reply, isOwner }) => {
if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐖𝐀𝐏𝐑𝐄𝐒𝐄𝐍𝐂𝐄 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αℓωαуѕ σɴℓιɴє"
*2. тσ єɴαвℓє νιʀтυαℓ туριɴg*
*3. тσ єɴαвℓє νιʀтυαℓ ʀє¢σʀ∂ιɴg αυ∂ισ*
*4. тσ ∂ιѕαвℓє ωαρʀєѕєɴ¢є (мαιɴтαιɴɴ ∂єfαυℓт)*

╭───────────────┄┈┈  
│ **${global.footer}**
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("💬");
                switch (messageContent) {
                    case "1": 
                        config.PRESENCE = "online";
                        saveConfig();
                        return reply("Bot Presence Has Been Set to Always Online.");
                        break;

                    case "2": 
                        config.PRESENCE = "typing";
                        saveConfig();
                        return reply("Bot Presence Has Been Set to Always Composing a Message.");
                        break;

                     case "3": 
                        config.PRESENCE = "recording";
                        saveConfig();
                        return reply("Bot Presence Has Been Set to Always Recording Audio.");
                        break;

                     case "4": 
                        config.PRESENCE = "unavailable";
                        saveConfig();
                        return reply("Bot Presence Has Been Set to Default.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1, 2, 3 or 4)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
    pattern: "autobio",
    desc: "Enable or Disable the Autobio Feature.",
    category: "owner",
    react: "🍀",
    filename: __filename
}, async (Gifted, mek, m, { from, isOwner, q, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    const infoMess = {
            image: { url: config.BOT_PIC },
            caption: `*𝐀𝐔𝐓𝐎𝐁𝐈𝐎 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒*  

*ʀєρℓу ωιтн ɴυмвєʀ:*

*1. тσ єɴαвℓє αυтσвισ*
*2. тσ ∂ιѕαвℓє αυтσвισ*

╭───────────────┄┈┈  
│ **${global.footer}**
╰───────────────┄┈┈`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 5,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363318387454868@newsletter',
                        newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓-💸",
                    serverMessageId: 143
                }
            }
        };

        const messageSent = await Gifted.sendMessage(from, infoMess);
        const messageId = messageSent.key.id;
        Gifted.ev.on("messages.upsert", async (event) => {
            const messageData = event.messages[0];
            if (!messageData.message) return;
            const messageContent = messageData.message.conversation || messageData.message.extendedTextMessage?.text;
            const isReplyToDownloadPrompt = messageData.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

            if (isReplyToDownloadPrompt) {
                await m.react("🍀");
                switch (messageContent) {
                    case "1": 
                        config.AUTO_BIO = "true";
                        saveConfig();
                        return reply("Autobio Has Been Enabled.");
                        break;

                    case "2": 
                        config.AUTO_BIO = "false";
                        saveConfig();
                        return reply("Autobio Has Been Disabled.");
                        break;
                            
                    default:
                  await Gifted.sendMessage(from, { text: "Invalid option selected. Please reply with a valid number (1 or 2)." });
                }
            }
        }); 
      await m.react("✅");
});

gmd({
  pattern: "addsudo",
  alias: ["setsudo"],
  react: "✅",
  desc: "Add a user to sudo list",
  category: "owner",
  filename: __filename
},
async (Gifted, mek, m, { quoted, sender, isOwner, from, reply }) => {
  if (!isOwner)
    return Gifted.sendMessage(from, { text: "*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*" }, { quoted: mek });

  if (!quoted)
    return reply("Reply to a user to add to sudo.");

  try {
    const userJid = quoted.sender;
    const userNumber = userJid.split("@")[0];

    const added = addSudo(userNumber);
    const msg = added
      ? `✅ Added @${userNumber} to sudo list.`
      : `⚠️ @${userNumber} is already in sudo list.`;

    console.log(`[SUDO] addSudo called for: ${userNumber} | Added: ${added}`);

    await Gifted.sendMessage(from, {
      text: msg,
      mentions: [userJid]
    }, { quoted: mek });

  } catch (err) {
    console.error("[addsudo ERROR]:", err);
    Gifted.sendMessage(from, { text: "❌ Failed to add sudo."}, { quoted: mek });
  }
});

gmd({
  pattern: "delsudo",
  react: "❌",
  desc: "Remove a user from sudo list",
  category: "owner",
  filename: __filename
},
async (Gifted, mek, m, { quoted, sender, isOwner, from,  reply}) => {
  if (!isOwner)
    return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*" );

  if (!quoted)
    return reply( "Reply to a user to remove from sudo.");

  try {
    const userJid = quoted.sender;
    const userNumber = userJid.split("@")[0];

    const removed = removeSudo(userNumber);
    const msg = removed
      ? `❌ Removed @${userNumber} from sudo list.`
      : `⚠️ @${userNumber} is not in the sudo list.`;

    console.log(`[SUDO] removeSudo called for: ${userNumber} | Removed: ${removed}`);

    await Gifted.sendMessage(from, {
      text: msg,
      mentions: [userJid]
    }, { quoted: mek });

  } catch (err) {
    console.error("[delsudo ERROR]:", err);
    Gifted.sendMessage(from, { text: "❌ Failed to remove sudo." }, { quoted: mek });
  }
});


gmd({
  pattern: "listsudo",
  react: "📃",
  desc: "List all sudo users",
  category: "owner",
  filename: __filename
},
async (Gifted, mek, m, { from }) => {
  try {
    const sudoList = getSudoNumbers();
    if (!sudoList.length)
      return Gifted.sendMessage(from, { text: "⚠️ No sudo users added yet." }, { quoted: mek });

    let msg = "*👑 SUDO USERS:*\n\n";
    sudoList.forEach((num, i) => {
      msg += `${i + 1}. wa.me/${num}\n`;
    });

    await Gifted.sendMessage(from, { text: msg }, { quoted: mek });

  } catch (err) {
    console.error("[listsudo ERROR]:", err);
    Gifted.sendMessage(from, { text: "❌ Failed to list sudo users." }, { quoted: mek });
  }
});



 gmd({
    pattern: "setautobio",
    desc: "Set Autobio based on config.AUTO_BIO.",
    category: "owner",
    react: "🍀",
    filename: __filename
}, async (Gifted, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
    if (autoBioEnabled) {
        reply("*Auto Bio enabled!* 🔄");
        startAutoBio(Gifted);
    } else {
        reply("*Auto Bio disabled!* 😶");
        stopAutoBio();
    }
});


function startAutoBio(Gifted) {
    if (autoBioInterval) clearInterval(autoBioInterval); 
    autoBioInterval = setInterval(async () => {
        const bioText = ` ${config.BOT_NAME} 𝐈𝐒 𝐀𝐂𝐓𝐈𝐕𝐄 𝟐𝟒/𝟕 | 𝐓𝐈𝐌𝐄: [${time}, ${date}]  |  𝐐𝐔𝐎𝐓𝐄: ${config.AUTO_BIO_QUOTE}`;
        await Gifted.updateProfileStatus(bioText);
        secondCount++;
        if (secondCount > 59) {
            secondCount = 1;
        }
    }, 1000); 
}

function stopAutoBio() {
    if (autoBioInterval) {
        clearInterval(autoBioInterval);  
        autoBioInterval = null;
        secondCount = 1;
        console.log("👨‍💻 AutoBIO feature stopped.");
    }
} 


