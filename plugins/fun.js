const { gmd, fetchJson } = require('../lib'),
      axios = require('axios');

gmd({
    pattern: "newyear",
    desc: "Fetch New Year Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/newyear?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "christmas",
    desc: "Fetch Christmas Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/christmas?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "valentine",
    alias: ["valentines", "valentinesday"],
    desc: "Fetch Valentines Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/valentines?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "gfsday",
    desc: "Fetch GirlFriends Day Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/girlfriendsday?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "bfsday",
    desc: "Fetch BouFriends Day Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/boyfriendsday?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "pickup",
    alias: ["pickupline", "pickuplines", "lines"],
    desc: "Fetch Pickup Lines.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/pickupline?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "fathersday",
    desc: "Fetch Fathers Day Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/fathersday?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "mothersday",
    desc: "Fetch Mothers Day Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/mothersday?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "heartbreak",
    desc: "Fetch Heartbreak Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/heartbreak?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "jokes",
    alias: ["joke"],
    desc: "Fetch Jokes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/jokes?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: `Set Up: ${data.result.setup}\nPuncline: ${data.result.punchline}` }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "halloween",
    desc: "Fetch Halloween Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/halloween?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "motivation",
    desc: "Fetch Motivational Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/motivation?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "love",
    desc: "Fetch Love Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/love?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "gratitude",
    desc: "Fetch Gratitude Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/gratitude?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "thankyou",
    desc: "Fetch ThankYou Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/thankyou?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "shayari",
    desc: "Fetch Shayari Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/shayari?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "goodnight",
    desc: "Fetch Goodnight Quotes/Wishes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/goodnight?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "truth",
    desc: "Fetch Truth Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/truth?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "advice",
    desc: "Fetch Advice Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/advice?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "flirt",
    desc: "Fetch Flirty Messages.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/flirt?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "quotes",
    alias: ["quote"],
    desc: "Fetch General Quotes.",
    category: "fun",
    react: "👓",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const data = await fetchJson(`${global.api}/fun/quotes?apikey=${global.myName}`);
        await Gifted.sendMessage(from, { text: data.result }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "cat",
    desc: "Fetch Random Cat Images.",
    category: "search",
    react: "😼",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = ``;
        const data = await fetchJson(`https://api.thecatapi.com/v1/images/search`);
        await Gifted.sendMessage(from, { image: { url: data[0]?.url }, caption: `> ${global.footer}`  }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`єяяσя ƒєт¢нιηg ∂σg ιмαgє: ${e.message}`);
    }
});


gmd({
    pattern: "dog",
    desc: "Fetch Random Dog Images.",
    category: "search",
    react: "🐶",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://dog.ceo/api/breeds/image/random`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await Gifted.sendMessage(from, { image: { url: data.message }, caption: `> ${global.footer}`  }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.log(e); 
        reply(`єяяσя ƒєт¢нιηg ∂σg ιмαgє: ${e.message}`);
    }
});

gmd({
    pattern: "fact",
    desc: "Get a Random fun Fact",
    react: "🧠",
    category: "fun",
    filename: __filename
},
async (Gifted, mek, m, { from, q, reply }) => {
    try {
        const url = 'https://uselessfacts.jsph.pl/random.json?language=en'; 
        const response = await axios.get(url);
        const fact = response.data.text;
        const funFact = `
🧠 *Random Fun Fact* 🧠

${fact}

Isn't that interesting? 🤔
`;
        return reply(funFact);
        await m.react("✅"); 
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred while fetching fun fact. Please try again later.");
    }
});

gmd({
    pattern: "hack",
    desc: "Hacking Prank lol.",
    category: "fun",
    react: "💻",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
    if (!isOwner) return reply("*📛 тнιѕ ιѕ αɴ σωɴєʀ ᴄσммαɴ∂*");
        const steps = [
    "Injecting Malware",
    " █ 10%",
    " █ █ 20%",
    " █ █ █ 30%",
    " █ █ █ █ 40%",
    " █ █ █ █ █ 50%",
    " █ █ █ █ █ █ 60%",
    " █ █ █ █ █ █ █ 70%",
    " █ █ █ █ █ █ █ █ 80%",
    " █ █ █ █ █ █ █ █ █ 90%",
    " █ █ █ █ █ █ █ █ █ █ 100%",
    "System hyjacking on process.. \\n Conecting to Server error to find 404 ",
    "Device successfully connected... \\n Receiving data...",
    "Data hyjacked from device 100% completed \\n killing all evidence killing all malwares...",
    " HACKING COMPLETED ",
    " SENDING LOG DOCUMENTS...",
    " SUCCESSFULLY SENT DATA AND Connection disconnected",
    "BACKLOGS CLEARED"
  ];

        for (const line of steps) {
            await Gifted.sendMessage(from, { text: line }, { quoted: mek });
            await m.react("✅"); 
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (e) {
        console.log(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
