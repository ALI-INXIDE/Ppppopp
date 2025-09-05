const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

// Karachi/Pakistan timezone settings with 12-hour format
const timeOptions = {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
};

const getMessageContent = (mek) => {
    if (mek.message?.conversation) return mek.message.conversation;
    if (mek.message?.extendedTextMessage?.text) return mek.message.extendedTextMessage.text;
    return '';
};

const DeletedText = async (Gifted, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent = getMessageContent(mek);
    const alertText = `*⌈⚠️ ᴅᴇʟᴇᴛᴇᴅ ᴍᴇssᴀɢᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ ⌋*\n\n${deleteInfo}\n*💬 ᴍᴇssᴀɢᴇ:* ${messageContent}`;

    await Gifted.sendMessage(
        jid,
        {
            text: alertText,
            contextInfo: {
                mentionedJid: isGroup ? [update.key.participant, mek.key.participant] : [update.key.remoteJid],
            },
        },
        { quoted: mek }
    );
};

const DeletedMedia = async (Gifted, mek, jid, deleteInfo, messageType) => {
    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        // For images/videos - put info in caption
        const antideletedmek = structuredClone(mek.message);
        if (antideletedmek[messageType]) {
            antideletedmek[messageType].caption = `*⌈⚠️ ᴅᴇʟᴇᴛᴇᴅ ᴍᴇssᴀɢᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ ⌋*\n\n${deleteInfo}`;
            antideletedmek[messageType].contextInfo = {
                stanzaId: mek.key.id,
                participant: mek.sender,
                quotedMessage: mek.message,
            };
        }
        await Gifted.relayMessage(jid, antideletedmek, {});
    } else {
        // For other media - send alert separately
        const alertText = `*⌈⚠️ ᴅᴇʟᴇᴛᴇᴅ ᴍᴇssᴀɢᴇ ᴅᴇᴛᴇᴄᴛᴇᴅ ⌋*\n\n${deleteInfo}`;
        await Gifted.sendMessage(jid, { text: alertText }, { quoted: mek });
        await Gifted.relayMessage(jid, mek.message, {});
    }
};

const AntiDelete = async (Gifted, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', timeOptions).toLowerCase();

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await Gifted.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0] || 'Unknown';
                    const deleter = update.key.participant?.split('@')[0] || 'Unknown';

                    deleteInfo = `*🙇🏻‍♂️͎᪳᪳ sᴇɴᴅᴇʀ:* @${sender}\n*🎡 ɢʀᴏᴜᴘ:* ${groupName}\n*⏰ ᴛɪᴍᴇ:* ${deleteTime} \n*🚯͎᪳᪳ ᴅᴇʟᴇᴛᴇᴅ ʙʏ:* @${deleter}\n*⚠️ ᴀᴄᴛɪᴏɴ ᴅᴇʟᴇᴛᴇᴅ ᴀ ᴍᴇssᴀɢᴇ*`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? Gifted.user.id : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0] || 'Unknown';
                    
                    deleteInfo = `*🙇🏻‍♂️͎᪳᪳ sᴇɴᴅᴇʀ:* @${senderNumber}\n*⏰ ᴛɪᴍᴇ:* ${deleteTime}\n*⚠️ ᴀᴄᴛɪᴏɴ ᴅᴇʟᴇᴛᴇᴅ ᴀ ᴍᴇssᴀɢᴇ*`;
                    jid = config.ANTI_DEL_PATH === "inbox" ? Gifted.user.id : update.key.remoteJid;
                }

                const messageType = mek.message ? Object.keys(mek.message)[0] : null;
                
                if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
                    await DeletedText(Gifted, mek, jid, deleteInfo, isGroup, update);
                } else if (messageType && [
                    'imageMessage', 
                    'videoMessage', 
                    'stickerMessage', 
                    'documentMessage', 
                    'audioMessage',
                    'voiceMessage'
                ].includes(messageType)) {
                    await DeletedMedia(Gifted, mek, jid, deleteInfo, messageType);
                }
            }
        }
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
