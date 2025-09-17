const { gmd, config, commands, fetchJson } = require('../lib'),
    { PREFIX: prefix } = config, 
    fs = require('fs'), 
    axios = require('axios'); 

// Helper function for robust sending
async function robustSendMessage(Gifted, from, msg, quoted, reply) {
    try {
        await Gifted.sendMessage(from, msg, { quoted });
    } catch (err) {
        console.log("Send with quoted failed, retrying without quoted:", err);
        try {
            await Gifted.sendMessage(from, msg);
        } catch (err2) {
            console.log("Send without quoted also failed:", err2);
            if (reply) return reply("❌ Failed to send the response.");
        }
    }
}

// --- IMAGE COMMANDS ---

gmd({
    pattern: "sd",
    alias: ["stablediffusion"],
    react: '📸',
    desc: "Generate Image Using Stable Diffusion Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a prompt to generate image!");
        const res = await axios.get(`${global.api}/ai/sd?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        const imageMsg = {
            image: Buffer.from(res.data),
            caption: `Here is your generated Image for ${q}\n> ${global.footer}`
        };
        await robustSendMessage(Gifted, from, imageMsg, mek, reply);
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "imagine",
    alias: ["imagineai"],
    react: '📸',
    desc: "Generate Image Using Imagine Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a prompt to generate image!");
        const res = await axios.get(`${global.api}/ai/text2img?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        const imageMsg = {
            image: Buffer.from(res.data),
            caption: `Here is your generated Image for ${q}\n> ${global.footer}`
        };
        await robustSendMessage(Gifted, from, imageMsg, mek, reply);
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

// --- CHAT COMMANDS ---

async function sendChatResponse(Gifted, from, mek, m, reply, resultText) {
    const infoMess = {
        text: resultText,
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
    await robustSendMessage(Gifted, from, infoMess, mek, reply);
    await m.react('✅');
}

gmd({
    pattern: "lumin",
    alias: ["luminai"],
    react: '🤖',
    desc: "Chat With Lumin Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/luminai?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "wwdgpt",
    react: '🤖',
    desc: "Chat With Wwd Gpt Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/wwdgpt?apikey=${global.myName}&prompt=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "letme",
    alias: ["letmegpt"],
    react: '🤖',
    desc: "Chat With Letme Gpt Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/letmegpt?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "simsimi",
    alias: ["aimaimiai"],
    react: '🤖',
    desc: "Chat With Simsimi Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/simsimi?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "gpt4-o",
    react: '🤖',
    desc: "Chat With Chat Gpt4-o Ai.",
    category: "ai",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a query!");
        const data = await fetchJson(`${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching data from Gifted-Api. Please try again later.");
    }
});

gmd({
    pattern: "ai",
    alias: ["aichat", "chatai"],
    desc: "Chat With Random Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        if (!q) return reply("Provide a prompt");

        const tryFetch = async (url) => {
            try {
                const res = await fetchJson(url);
                if (res && res.result) return res.result;
            } catch (err) {
                console.log(`API failed or no valid response: ${url}`, err);
            }
            return null;
        };

        const urls = [
            `${global.api}/ai/gpt4?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt-turbo?apikey=${global.myName}&q=${encodeURIComponent(q)}`
        ];

        let resultText = null;
        for (const url of urls) {
            resultText = await tryFetch(url);
            if (resultText) break;
        }

        if (!resultText) return reply("Sorry, I couldn't generate a response. Please try again later.");
        await sendChatResponse(Gifted, from, mek, m, reply, resultText);

    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

gmd({
    pattern: "gemini",
    alias: ["geminiai", "geminiaichat", "geminichat"],
    desc: "Chat With Gemini Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async(Gifted, mek, m, {from, quoted, q, reply}) => {
    try {
        if (!q) return reply("Provide a prompt");
        let data = await fetchJson(`${global.api}/ai/geminiai?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
        await sendChatResponse(Gifted, from, mek, m, reply, data.result);
    } catch(e) {
        console.log(e);
        reply(`${e}`);
    }
});

gmd({
    pattern: "blackbox",
    alias: ["blackboxai", "blackboxaichat", "blackboxchat"],
    desc: "Chat Wth BlackBox Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async(Gifted, mek, m, {from, quoted, q, reply}) => {
    try {
        let data = await fetchJson(`${global.api}/ai/blackbox?apikey=${global.myName}&q=${encodeURIComponent(q)}`);
        if (!data || !data.result) return reply("Error: No response from the AI.");
        if (data && data.result && !data.result.includes("Generated by BLACKBOX.AI, try unlimited chat https://www.blackbox.ai")) {
            await sendChatResponse(Gifted, from, mek, m, reply, data.result);
        }
    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});

gmd({
    pattern: "gpt",
    alias: ["gpt4", "chatgpt", "chatgpt4", "gptai", "chatgptai"],
    desc: "Chat with Chat Gpt4 Ai",
    react: "🤖",
    category: "ai",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, q, reply }) => {
    try {
        let data;
        const tryFetch = async (url) => {
            try {
                const res = await fetchJson(url);
                if (res && res.result) return res.result;
            } catch (err) {
                console.log(`API failed or no valid response: ${url}`, err);
            }
            return null;
        };

        const urls = [
            `${global.api}/ai/gpt4?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt4-o?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/gpt-turbo?apikey=${global.myName}&q=${encodeURIComponent(q)}`,
            `${global.api}/ai/geminiai?apikey=${global.myName}&q=${encodeURIComponent(q)}`
        ];

        let resultText = null;
        for (const url of urls) {
            resultText = await tryFetch(url);
            if (resultText) break;
        }

        if (!resultText) return reply("Sorry, I couldn't generate a response. Please try again later.");
        await sendChatResponse(Gifted, from, mek, m, reply, resultText);

    } catch (e) {
        console.log(e);
        reply(`${e.message || e}`);
    }
});
