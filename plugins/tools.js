
const { gmd, config, commands, GiftedFancy, Giftedttstalk, giftedTempmail, giftedCdn, makeId, convertStickerToImage, downloadMediaMessage, giftedProcessImage, giftedHd2, runtime, getRandom, fetchJson, toAudio, toPTT, toVideo, dBinary, eBinary, dBasef, eBasef, ffmpeg, getTempMail,
    getTempMailInbox,
    getTempMailMessage } = require('../lib'), 
      { PREFIX: prefix, 
       OWNER_NUMBER: ownerNumber } = config, 
      fs = require('fs'),
      os = require('os'),
      axios = require('axios'), 
      path = require('path'),
      emailDataStore = {}, 
      FormData = require('form-data'), 
      { downloadContentFromMessage } = require('@whiskeysockets/baileys'),
      JavaScriptObfuscator = require('javascript-obfuscator'),
      { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter"), 
      fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));



function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

gmd({
  pattern: "fluxai",
  alias: ["flux2", "imagine2"],
  react: "🚀",
  desc: "Generate an image using AI.",
  category: "ai",
  filename: __filename
}, 
async (Gifted, mek, m, {
  q,
  reply,
  from,
  prefix,
  quoted,
  body,
  isCmd,
  command,
  args,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
}) => {
  try {
    if (!q) return reply("❗Please provide a prompt to generate the image.");

    await reply("> ᴄʀᴇᴀᴛɪɴɢ....");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("⚠️ Error: No image received from API. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await Gifted.sendMessage(from, {
      image: imageBuffer,
      caption: `> ɢᴇɴᴇʀᴀᴛᴇᴅ ʙʏ ᴀʟɪ ᴍᴅ  \n✨ Prompt: *${q}*`
    }, { quoted: mek });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`❌ An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});



gmd({
  pattern: "imgscan",
  alias: ["scanimg", "imagescan", "analyzeimg"],
  react: '🔍',
  desc: "Scan and analyze images using AI",
  category: "ai",
  use: ".imgscan [reply to image]",
  filename: __filename
}, 
async (Gifted, mek, m, {
  from,
  prefix,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    const quotedMsg = quoted || m;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("❗Please reply to a valid image (JPEG or PNG).");
    }

    const mediaBuffer = await quotedMsg.download();
    const fileSize = formatBytes(mediaBuffer.length);

    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else return reply("❗Unsupported format. Use JPEG or PNG only.");

    const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);
    form.append('reqtype', 'fileupload');

    const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(tempFilePath); // Clean up

    const imageUrl = uploadResponse.data;
    if (!imageUrl) throw "Failed to upload image to Catbox.";

    const scanUrl = `https://apis.davidcyriltech.my.id/imgscan?url=${encodeURIComponent(imageUrl)}`;
    const scanResponse = await axios.get(scanUrl);

    if (!scanResponse.data.success) {
      throw scanResponse.data.message || "Image analysis failed.";
    }

    await reply(
      `🔍 *Image Analysis Result*\n\n` +
      `${scanResponse.data.result}\n\n` +
      `*Image Size:* ${fileSize}\n` +
      `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʟɪ ᴛᴇᴄʜ`
    );

  } catch (error) {
    console.error('Image Scan Error:', error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});


gmd({
  pattern: "sendfileurl",
  alias: ["getfile", "dl", "fetch2", "dlfile"],
  desc: "Send file from a URL.",
  react: "🛠️",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, q, quoted, reply, pushname }) => {
  try {
    if (q.length === 0 || !q.startsWith("http://") && !q.startsWith("https://")) {
      return reply(`Please provide a valid URL. Example: ${prefix}sendFileUrl <your_link_here>`);
    }
    // const fileUrl = q;
    const media = await Gifted.sendFileUrl(from, q, quoted);
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    return reply("Error: " + error.message);
  }
});


gmd({
    pattern: "toimg",
    alias: ["photo","pic"],
    category: "converter",
    desc: "Convert Sticker to Image.",
    filename: __filename
}, async (Gifted, mek, m, { from, reply, isCmd, command, args, q, isGroup, pushname }) => {
    try {
        const isQuotedSticker = m.quoted && m.quoted.type === 'stickerMessage';
        if (m.type === 'stickerMessage' || isQuotedSticker) {
            const stickerBuffer = isQuotedSticker ? await m.quoted.download() : await m.download();
            const nameWebp = getRandom('.webp');
            await fs.promises.writeFile(nameWebp, stickerBuffer);
            const imageBuffer = await convertStickerToImage(nameWebp);  
            await Gifted.sendMessage(from, { image: imageBuffer }, { caption: args.join(' ') || '*_Here is your image_*' });
        } else {
            return reply('_Please reply to a sticker to convert it to an image._');
        }
    } catch (e) {
        console.error(e);
        reply('_An error occurred while converting the sticker._');
    }
});


gmd({
    pattern: "vv2",
    alias: ["antivv2", "reveal2", "rvo2", "antiviewonce2", "viewonce2"],
    desc: "Reveal a ViewOnce Message in Bot User's Pm.",
    category: "owner",
    use: '<query>',
    filename: __filename
},
async (Gifted, mek, m, { from, reply, quoted, isOwner, sender }) => {
    try {
        if (!quoted) {
            return reply(`Please reply to/quote a ViewOnce message`);
        }

        if (!isOwner) {
            return reply(`Owner Only Command!`);
        }

        const isViewOnce = quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce;

        if (!isViewOnce) {
            return reply('Please reply to a view once media message.');
        }

        let msg;

        try {
            const caption = quoted.imageMessage?.caption || quoted.videoMessage?.caption || quoted.audioMessage?.caption || global.footer;

            if (quoted.imageMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.imageMessage);
                msg = {
                    image: { url: media },
                    caption: caption,
                };
            }
            else if (quoted.videoMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.videoMessage);
                msg = {
                    video: { url: media },
                    caption: caption,
                };
            }
            else if (quoted.audioMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.audioMessage);
                msg = {
                    audio: { url: media },
                    ptt: true,
                    mimetype: 'audio/mp4',
                };
            }
            else {
                return reply('Please reply to an image, video, or audio message to use this command.');
            }

            await Gifted.sendMessage(m.sender, msg);
            await m.react("✅"); 
        } catch (e) {
            console.log("Error:", e);
            reply("An error occurred while fetching the ViewOnce message.");
        }
    } catch (e) {
        console.log("Error:", e);
        reply("An error occurred while processing the command.");
    }
});


gmd({
    pattern: "vv",
    alias: ["antivv", "reveal", "antiviewonce", "rvo", "viewonce"],
    desc: "Reveal a ViewOnce Message in Current Chat.",
    category: "owner",
    use: '<query>',
    filename: __filename
},
async (Gifted, mek, m, { from, reply, quoted, isOwner, sender }) => {
    try {
        if (!quoted) {
            return reply(`Please reply to/quote a ViewOnce message`);
        }

        if (!isOwner) {
            return reply(`Owner Only Command!`);
        }

        const isViewOnce = quoted.imageMessage?.viewOnce || quoted.videoMessage?.viewOnce || quoted.audioMessage?.viewOnce;

        if (!isViewOnce) {
            return reply('Please reply to a view once media message.');
        }

        let msg;

        try {
            const caption = quoted.imageMessage?.caption || quoted.videoMessage?.caption || quoted.audioMessage?.caption || global.footer;

            if (quoted.imageMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.imageMessage);
                msg = {
                    image: { url: media },
                    caption: caption,
                };
            }
            else if (quoted.videoMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.videoMessage);
                msg = {
                    video: { url: media },
                    caption: caption,
                };
            }
            else if (quoted.audioMessage) {
                let media = await Gifted.downloadAndSaveMediaMessage(quoted.audioMessage);
                msg = {
                    audio: { url: media },
                    mimetype: 'audio/mp4',
                    ptt: true,
                };
            }
            else {
                return reply('Please reply to an image, video, or audio message to use this command.');
            }

            await Gifted.sendMessage(from, msg);
            await m.react("✅"); 
        } catch (e) {
            console.log("Error:", e);
            reply("An error occurred while fetching the ViewOnce message.");
        }
    } catch (e) {
        console.log("Error:", e);
        reply("An error occurred while processing the command.");
    }
});


gmd({
  pattern: "hd2",
  alias: ["hrd2", "hdr2", "tohd2", "enhance2"],
  desc: "Image Enhancer.",
  category: "tools",
  react: "📸",
  filename: __filename,
}, async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
  try {
    if (!quoted) {
      return reply("Please reply to an image to enhance its quality.\nExample: *hd2*");
    }
    const media = await quoted.download();
    if (!media) {
      return reply("Failed to download the image. Please try again.");
    }
    const enhancedImageBuffer = await giftedHd2(media);
    if (!enhancedImageBuffer) {
      return reply("Failed to enhance the image. Please try again later.");
    }
    await Gifted.sendMessage(
      from,
      {
        image: enhancedImageBuffer,
        caption: `> *Hey ${pushname}, here is your enhanced image processed by ${config.BOT_NAME}!*`,
      },
      { quoted: mek }
    );
    await m.react("✅");
  } catch (error) {
    console.error("Error in hd2 command:", error);
    reply("An error occurred while processing your request. Please try again.");
  }
});


gmd({
  pattern: "encrypt",
  alias: ["enc", "obfus", "obfuscate"],
  desc: "Encrypt JS Code.",
  react: "🛠️",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (args.length === 0) {
      return reply(`Please provide a valid JS code to encrypt. Example: ${prefix}obfus console.log('ali Tech');`);
    }
    let jsCode = args.join(" ");
    const obfuscationResult = JavaScriptObfuscator.obfuscate(jsCode, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      identifiersPrefix: 'alitech',
      deadCodeInjection: true,
      stringArrayIndexesType: ['hexadecimal-number'],
      stringArrayWrappersType: 'variable',
      identifierNamesGenerator: 'hexadecimal',
      stringArrayThreshold: 1
    });
    const obfuscatedCode = obfuscationResult.getObfuscatedCode();
    const giftedMess = {
      text: obfuscatedCode,
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
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    return reply("Error: " + error.message);
  }
});

gmd({
  pattern: "decrypt",
  alias: ["dec", "deobfus", "deobfuscate"],
  desc: "Dencrypt JS Code.",
  react: "🛠️",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (args.length === 0) {
      return reply(`Please provide a valid JS code to decrypt. Example: ${prefix}deobfus <your_encrypted_code>`);
    }
    let jsCode = args.join(" ");
    const { webcrack } = await import('webcrack');
    let result = await webcrack(jsCode);
    const codeanswer = (result.code)
    const giftedMess = {
      text: codeanswer,
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
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('❌');
    return reply("Error: " + error.message);
  }
});

gmd({
  pattern: "ebinary",
  alias: ["encodebin"],
  desc: "Encode Text to Binary",
  react: "📡",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("Please provide a text to encode.");
  try {
    let encodedBinary = await eBinary(text);
    reply(`${encodedBinary}`);
  } catch (error) {
    console.error(error);
    reply("Error: " + error.message);
  }
});

gmd({
  pattern: "dbinary",
  alias: ["decodebin"],
  desc: "Decode Binary to Text",
  react: "📡",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("Please provide binary to decode.");
  try {
    let decodedBinary = await dBinary(text);
    reply(`${decodedBinary}`);
  } catch (error) {
    console.error(error);
    reply("Error: " + error.message);
  }
});

gmd({
  pattern: "ebase",
  alias: ["encodebase"],
  desc: "Encode Text to Base64",
  react: "📡",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("Please provide a text to encode.");
  try {
    let encodedBase64 = await eBasef(text);
    reply(`${encodedBase64}`);
  } catch (error) {
    console.error(error);
    reply("Error: " + error.message);
  }
});

gmd({
  pattern: "dbase",
  alias: ["decodebase"],
  desc: "Decode Base64 to Text",
  react: "📡",
  category: "coding",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("Please provide Base64 to decode.");
  try {
    let decodedBase64 = await dBasef(text);
    reply(`${decodedBase64}`);
  } catch (error) {
    console.error(error);
    reply("Error: " + error.message);
  }
});



gmd({
  pattern: "calc",
  alias: ["calculator", "calculate"],
  desc: "Calculate a Mathematical Expression.",
  use: ".calc <expression>",
  react: "🛠️",
  category: "tools",
  filename: __filename
}, async (Gifted, mek, m, { from, args, quoted, body, isCmd, command, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    if (args.length === 0) {
      return reply("Please provide a mathematical expression ie *10÷5*");
    }
    let expression = args.join(" ");
    expression = expression.replace(/÷/g, "/").replace(/×/g, "*");
    let result;
    try {
      result = eval(expression); 
    } catch (error) {
      return reply("Invalid mathematical expression.");
    }
    return await Gifted.sendMessage(from, {
      text: "Result is: " + result
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await m.react('❌');
    return reply("Error: " + error.message);
  }
});

gmd({
  pattern: "tinyurl",
  alias: ["tiny"],
  desc: "Shorten Url via Tinyurl.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/tinyurl?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "shorturl",
  desc: "Get Shorl Url.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/shorturl?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "cleanuri",
  desc: "Shorten Url via CleanUri.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/cleanuri?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "isgd",
  desc: "Shorten Url via Isgd.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/isgd?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "vgd",
  desc: "Shorten Url via Vgd.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/vgd?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "tnyim",
  desc: "Shorten Url via Tnyim.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/tnyim?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "kutt",
  desc: "Shorten Url via Kutt.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/kutt?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result.url}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "rebrandly",
  desc: "Shorten Url via Rebrandly.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/rebrandly?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "vurl",
  desc: "Shorten Url via Vurl.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/vurl?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "adfoc",
  desc: "Shorten Url via Adfoc.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/adfoc?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "dxyz",
  desc: "Shorten Url via Dxyz.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/dxyz?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result.link}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
  pattern: "ssur",
  desc: "Shorten Url via Ssur.",
  react: "🔗",
  category: "shorten",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    const url = args.join(" ");
    if (!url) {
      return await reply("Provide a url to shorten");
    }

    const shortUrlData = await fetchJson(`${global.api}/tools/ssur?apikey=${global.myName}&url=${encodeURIComponent(url)}`);
    
    if (!shortUrlData) {
      return await reply("_Couldn't fetch the shorturl data_");
    }
    await Gifted.sendMessage(from, {
      text: `_Shortened Url: ${shortUrlData.result}_`
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await reply(error);
    await m.react('❌');
  }
});

gmd({
    pattern: "ssweb",
    alias: ["ss", "screenshot", "fullss"],
    react: '📸',
    desc: "Screenshot a Website (full ss).",
    category: "tools",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a website URL to screenshot!");
        const res = await axios.get(`${global.api}/tools/ssweb?apikey=${global.myName}&url=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is the screenshot of ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching the screenshot. Please try again later.");
    }
});

gmd({
    pattern: "ssphone",
    alias: ["ssmobile"],
    react: '📸',
    desc: "Screenshot a Website (phone sized).",
    category: "tools",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a website URL to screenshot!");
        const res = await axios.get(`${global.api}/tools/ssphone?apikey=${global.myName}&url=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is the screenshot of ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching the screenshot. Please try again later.");
    }
});

gmd({
    pattern: "sspc",
    alias: ["sscomp", "sslaptop", "sscomputer", "fulllap"],
    react: '📸',
    desc: "Screenshot a Website. (desktop sized)",
    category: "tools",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a website URL to screenshot!");
        const res = await axios.get(`${global.api}/tools/sspc?apikey=${global.myName}&url=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is the screenshot of ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching the screenshot. Please try again later.");
    }
});

gmd({
    pattern: "sstab",
    alias: ["sstablet"],
    react: '📸',
    desc: "Screenshot a Website. (tablet sized)",
    category: "tools",
    filename: __filename
},
async (Gifted, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Provide a website URL to screenshot!");
        const res = await axios.get(`${global.api}/tools/sstab?apikey=${global.myName}&url=${encodeURIComponent(q)}`, {
            responseType: 'arraybuffer' 
        });
        await Gifted.sendMessage(from, { 
            image: Buffer.from(res.data),
            caption: `Here is the screenshot of ${q}\n> ${global.footer}`
        }, { quoted: mek });
        await m.react("✅");
    } catch (e) {
        console.error("Error occurred:", e);
        reply("❌ An error occurred while fetching the screenshot. Please try again later.");
    }
});


gmd({
  pattern: "reverse",
  desc: "Reverse the Provided Text.",
  react: "🛠️",
  use: ".reverse <text>",
  category: "tools",
  filename: __filename
}, async (Gifted, mek, m, { from, args, reply }) => {
  try {
    if (args.length === 0) {
      return reply("Please provide the text to reverse.");
    }
    const text = args.join(" ");
    const result = text.split("").reverse().join("");
    return await Gifted.sendMessage(from, {
      text: result
    }, {
      quoted: mek
    });
    await m.react('✅');
  } catch (error) {
    console.log(error);
    await m.react('❌');
    return reply("Error: " + error.message);
  }
});



gmd({
  pattern: "sticker",
  react: "🎨",
  alias: ["s", "st"],
  desc: "Converts and Creates Stickers",
  category: "converter",
  use: ".sticker <Reply to image>",
  filename: __filename
}, async (Gifted, mek, m, { from, reply, isCmd, command, quoted, args, q, isGroup, pushname }) => {
  try {
    const isImage = m.quoted && m.quoted.type === "imageMessage" || (m.quoted.type === "viewOnceMessage" && m.quoted.msg.type === "imageMessage");
    const isSticker = m.quoted && m.quoted.type === "stickerMessage";
    if (m.type === "imageMessage" || isImage) {
      const imageFile = getRandom(".jpg");
      const imageData = isImage ? await m.quoted.download() : await m.download();
      await fs.promises.writeFile(imageFile, imageData);
      let sticker = new Sticker(imageFile, {
        pack: config.PACK_NAME, 
        author: config.PACK_AUTHOR,
        type: q.includes("--crop") || q.includes("-c") ? StickerTypes.CROPPED : StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 75,
        background: "transparent"
      });
      const stickerBuffer = await sticker.toBuffer();
      return Gifted.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });
      await m.react('✅');
    } else if (isSticker) {
      const stickerFile = getRandom(".webp");
      const stickerData = await m.quoted.download();
      await fs.promises.writeFile(stickerFile, stickerData);
      let newSticker = new Sticker(stickerFile, {
        pack: config.PACK_NAME, 
        author: config.PACK_AUTHOR,
        type: q.includes("--crop") || q.includes("-c") ? StickerTypes.CROPPED : StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 75,
        background: "transparent"
      });
      const newStickerBuffer = await newSticker.toBuffer();
      return Gifted.sendMessage(from, { sticker: newStickerBuffer }, { quoted: mek });
      await m.react('✅');
    } else {
      return await reply('Reply to a photo for sticker!');
    }
  } catch (error) {
    reply("Error!!");
    console.error(error);
  }
});


gmd({
    pattern: "currencyconvert",
    alias: ["currency", "convertmoney"],
    desc: "Convert an Amount from one Currency to Another.",
    category: "converter",
    react: "💱",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, q, sender, reply }) => {
    try {
        if (args.length < 3) {
            return reply(`Usage: ${prefix}currency 1000 KES TZS`);
        }
        const amount = args[0];
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();
        if (isNaN(amount)) {
            return reply("Please provide a valid amount.");
        }
        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (!data.rates[toCurrency]) {
            return reply(`Conversion rate for ${toCurrency} not found.`);
        }
        const convertedAmount = (amount * data.rates[toCurrency]).toFixed(2);
        let conversionInfo = `*💸Currency Converter💸*\n\n`;
        conversionInfo += `💵 *Amount*: ${amount} ${fromCurrency}\n`;
        conversionInfo += `🔄 *Converted Amount*: ${convertedAmount} ${toCurrency}\n`;
        conversionInfo += `📈 *Exchange Rate*: 1 ${fromCurrency} = ${data.rates[toCurrency]} ${toCurrency}\n\n> ${global.footer}`;
        await Gifted.sendMessage(from, { text: conversionInfo }, { quoted: mek });
        await m.react('✅');
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Data*: ${e.message}`);
    }
});

gmd({
  pattern: "trt",
  alias: ["translate"],
  desc: "🌍 Translate text Between Languages",
  react: "⚡", 
  category: "converter",  
  filename: __filename
}, async (Gifted, mek, m, { from, q, reply }) => {
  try {
    const splitInput = q.split(" ");
    if (splitInput.length < 2) {
      return reply(`Please provide a target language code and text. Usage: ${prefix}trt sw I am ali-Md Whatsapp User Bot`);
    }
    const targetLanguage = splitInput[0];
    const text = splitInput.slice(1).join(" ");
    const translationAPIUrl = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(text) + "&langpair=en|" + targetLanguage;
    const response = await axios.get(translationAPIUrl);
    const translatedText = response.data.responseData.translatedText;
    const responseMessage = `
*Original Text*: ${text}
*Translated Text*: ${translatedText}
*Language*: ${targetLanguage.toUpperCase()}
    `;
    return reply(responseMessage);
    await m.react('✅');
  } catch (error) {
    console.log(error);
    return reply("⚠️ An error occurred while translating your text. Please try again later🤕");
  }
});

gmd(
  {
    pattern: 'toaudio',
    alias: ['audiofromvideo'],
    desc: 'Convert Quoted Video to Audio.',
    category: 'converter',
    react: '🎵',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (!quoted) {
        return reply('Reply to a video to convert it to audio.');
      }
      const mediaBuffer = await quoted.download();
      if (!mediaBuffer) {
        return reply('Failed to download the quoted video. Please try again.');
      }
      const tempInput = path.join(__dirname, `temp_${Date.now()}.mp4`);
      const tempOutput = path.join(__dirname, `Audio by ${pushname}.mp3`);
      fs.writeFileSync(tempInput, mediaBuffer); 
      const audioBuffer = await toAudio(mediaBuffer, 'mp4');
      fs.writeFileSync(tempOutput, audioBuffer); 
      await Gifted.sendMessage(
        from,
        { document: audioBuffer, mimetype: 'audio/mpeg', fileName: `Audio by ${pushname}.mp3` },
        { quoted: mek }
      );
      fs.unlinkSync(tempInput); 
      fs.unlinkSync(tempOutput); 
      await m.react('✅');
    } catch (error) {
      console.error(error);
      reply(`Error: ${error.message || error}`);
    }
  }
);

gmd(
  {
    pattern: 'tovideo',
    alias: ['videofromaudio'],
    desc: 'Convert Quoted Audio to Video with a Black Screen.',
    category: 'converter',
    react: '🎥',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (!quoted) {
        return reply('Reply to an audio file to convert it to video.');
      }
      const mediaBuffer = await quoted.download();
      if (!mediaBuffer) {
        return reply('Failed to download the quoted audio. Please try again.');
      }
      const tempInput = path.join(__dirname, `temp_${Date.now()}.mp3`);
      const tempOutput = path.join(__dirname, `Video by ${pushname}.mp4`);
      fs.writeFileSync(tempInput, mediaBuffer);
      const videoBuffer = await toVideo(mediaBuffer, 'mp3');
      fs.writeFileSync(tempOutput, videoBuffer); 
      await Gifted.sendMessage(
        from,
        { document: videoBuffer, mimetype: 'video/mp4', fileName: `Video by ${pushname}.mp4` },
        { quoted: mek }
      );
      fs.unlinkSync(tempInput); 
      fs.unlinkSync(tempOutput); 
      await m.react('✅');
    } catch (error) {
      console.error(error);
      reply(`Error: ${error}`);
    }
  }
);

gmd(
  {
    pattern: 'toptt',
    alias: ['tovoice'],
    desc: 'Convert Quoted Audio to a Voice Note (PTT).',
    category: 'converter',
    react: '🎙️',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (!quoted) {
        return reply('Reply to an audio file to convert it to a voice note.');
      }
      const mediaBuffer = await quoted.download();
      if (!mediaBuffer) {
        return reply('Failed to download the quoted audio. Please try again.');
      }
      const tempInput = path.join(__dirname, `temp_${Date.now()}.mp3`);
      const tempOutput = path.join(__dirname, `PTT by ${pushname}.opus`);
      fs.writeFileSync(tempInput, mediaBuffer); 
      const pttBuffer = await toPTT(mediaBuffer, 'mp3');
      fs.writeFileSync(tempOutput, pttBuffer);
      await Gifted.sendMessage(
        from,
        { audio: pttBuffer, mimetype: 'audio/ogg; codecs=opus', ptt: true },
        { quoted: mek }
      );
      fs.unlinkSync(tempInput); 
      fs.unlinkSync(tempOutput); 
      await m.react('✅');
    } catch (error) {
      console.error(error);
      reply(`Error: ${error.message || error}`);
    }
  }
);

gmd(
  {
    pattern: 'save',
    alias: ['send', 'sendme', 'sv'], 
    desc: 'Save Status Updates or Media Files.',
    category: 'tools',
    react: '📡',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, sender, reply, pushname }) => {
    try {
      if (!quoted) {
        return reply(`Reply to a users status update (image, video, audio voice) to save.\nUse ${prefix}save statuses.`);
      }
      const mediaBuffer = await quoted.download();
      const botUser = sender;
      if (!mediaBuffer) {
        return reply('Failed to download status update media. Please try again.');
      }
      const { fileTypeFromBuffer } = await import('file-type');
      const fileType = await fileTypeFromBuffer(mediaBuffer);
      if (!fileType) {
        return reply('Unable to determine the file type of the media.');
      }
      if (fileType.mime === 'text/plain') {
        const textContent = mediaBuffer.toString('utf8'); 
        const message = `*Hey ${pushname}, Here is your saved text content:* \n\n${textContent}`;
        await Gifted.sendMessage(from, { text: message }, { quoted: mek });
      } else {
        const filename = `file.${fileType.ext}`;
        const tempFilePath = path.join(__dirname, filename);
        fs.writeFileSync(tempFilePath, mediaBuffer);
        const stats = fs.statSync(tempFilePath);
        const fileSizeMB = stats.size / (1024 * 1024);  
        const message = `*Hey ${pushname}, Here Is the Saved Media:* \n*File Size:* ${fileSizeMB.toFixed(2)} MB\n*File Type:* ${fileType.ext.toUpperCase()}`;
        if (fileType.mime.startsWith('image/') || fileType.mime.startsWith('video/')) {
          await Gifted.sendMessage(
            botUser,
            {
              [fileType.mime.startsWith('image/') ? 'image' : 'video']: { url: tempFilePath },
              caption: message,
            },
            { quoted: mek }
          );
        } else if (fileType.mime.startsWith('audio/')) {
          await Gifted.sendMessage(botUser, { audio: { url: tempFilePath }, caption: message }, { quoted: mek });
        }
        fs.unlinkSync(tempFilePath); 
      }
      await m.react('✅');
    } catch (error) {
      console.error(error);
      reply(`Please reply to a user's status update to save it`);
    }
  }
);    

gmd({
    pattern: "tts",
    desc: "Converts Text to Speech.",
    category: "converter",
    react: "🎶",
    filename: __filename,
},
async ( Gifted, mek, m,{ from, quoted, body, args, q, pushname, reply }) => {
    try {
        if (!q) {
            return reply(`Hello *_${pushname}_,*\nPlease provide a text to convert to speech after the command, e.g., *!tts I am ali Md*`);
        }
        const response = await fetchJson(`https://api.maskser.me/api/soundoftext?text=${encodeURIComponent(q)}&lang=en-US`);
        if (response && response.result) {
            await Gifted.sendMessage(
                from,
                { audio: { url: response.result }, mimetype: 'audio/mpeg' },
                { quoted: mek }
            );
            await m.react("✅");
        } else {
            reply("No data found or the API response is incorrect.");
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message || e}`);
    }
});


gmd({
        pattern: "hd",
        alias: ["hrd", "hdr", "tohd", "enhance"],
        desc: "HD Image Enhancer.",
        category: "tools",
        react: "📸",
        filename: __filename,
    },
    async (Gifted, mek, m, { from, quoted, body, args, q, pushname, reply }) => {
        try {
            if (!quoted) {
                return reply(`Reply to an image to enhance.\nUse *${prefix}hd*`);
            }
            const mediaBuffer = await quoted.download();
            if (!mediaBuffer) {
                return reply('Failed to download media. Please try again.');
            }
            const result = await giftedProcessImage(mediaBuffer, 4);
            if (result && result.data && result.data.downloadUrls && result.data.downloadUrls[0]) {
                const enhancedImageUrl = result.data.downloadUrls[0];
                await Gifted.sendMessage(
                    from,
                    {
                        image: { url: enhancedImageUrl },
                        caption: `> *Hey ${pushname}, here is your enhanced image by ${config.BOT_NAME}*`,
                    },
                    { quoted: mek }
                );
                await m.react("✅");
            } else {
                reply("No data found or the Gifted API response is incorrect.");
            }
        } catch (e) {
            console.error(e);
            reply(`Please reply to/qoute an image to enhance it's quality`);
        }
    }
);



gmd(
  {
    pattern: 'url',
    alias: ['url', 'tourl', 'geturl'],
    desc: 'Upload media and get a Catbox URL.',
    category: 'tools',
    react: '📡',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (!quoted) return reply(`Reply to an image, video, audio, or document to upload.`);

      const mediaBuffer = await quoted.download();
      if (!mediaBuffer) return reply('Failed to download media. Please try again.');

      const { fileTypeFromBuffer } = await import('file-type');
      const fileType = await fileTypeFromBuffer(mediaBuffer);
      if (!fileType) return reply('Unable to determine the file type.');

      const filename = `${makeId(5)}.${fileType.ext}`;
      const filePath = path.join(__dirname, filename);
      fs.writeFileSync(filePath, mediaBuffer);

      const form = new FormData();
      form.append('fileToUpload', fs.createReadStream(filePath));
      form.append('reqtype', 'fileupload');

      const upload = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: form.getHeaders()
      });

      const catboxUrl = upload.data;
      const fileSize = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);

      const message = `*Hey ${pushname}, Here Is Your Catbox URL:*\n\n${catboxUrl}\n\n*File Size:* ${fileSize} MB\n*File Type:* ${fileType.ext.toUpperCase()}\n*Note:* URL has no expiry.`;

      await Gifted.sendMessage(from, { text: message }, { quoted: mek });
      await m.react('✅');
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
      reply(`❌ Error: ${error.message}`);
    }
  }
);



gmd(
  {
    pattern: 'url2',
    alias: ['url2', 'tourl2', 'geturl2'],
    desc: 'Upload Files to get Urls.',
    category: 'tools',
    react: '📡',
    filename: __filename,
  },
  async (Gifted, mek, m, { from, quoted, reply, pushname }) => {
    try {
      if (!quoted) {
        return reply(`Reply to an image, video, audio, or document to upload.\nUse *${prefix}url*`);
      }
      const mediaBuffer = await quoted.download();
      if (!mediaBuffer) {
        return reply('Failed to download media. Please try again.');
      }
      const { fileTypeFromBuffer } = await import('file-type');
      const fileType = await fileTypeFromBuffer(mediaBuffer);
      if (!fileType) {
        return reply('Unable to determine the file type of the media.');
      }
      const filename = `${makeId(5)}.${fileType.ext}`;

      // Save the media to a temporary file
      const tempFilePath = path.join(__dirname, filename);
      fs.writeFileSync(tempFilePath, mediaBuffer);
      const uploadResult = await giftedCdn(tempFilePath);
      if (!uploadResult.success) {
        return reply(`Upload failed: ${uploadResult.error || uploadResult.message}`);
      }
      const streamUrl = uploadResult.files[0].stream_url;
      const downloadUrl = uploadResult.files[0].download_url;
      const deleteUrl = uploadResult.files[0].delete_url;
      const stats = fs.statSync(tempFilePath);
      const fileSizeMB = stats.size / (1024 * 1024);
      const message = `*Hey ${pushname}, Here Are Your Media URLs:*\n\nStream Url:${streamUrl}\nDownload Url:${downloadUrl}\n*File Size:* ${fileSizeMB.toFixed(
        2
      )} MB\n*File Type:* ${fileType.ext.toUpperCase()}\n*File Expiration:* No Expiry`;
      if (fileType.mime.startsWith('image/') || fileType.mime.startsWith('video/')) {
        await Gifted.sendMessage(
          from,
          {
            [fileType.mime.startsWith('image/') ? 'image' : 'video']: { url: tempFilePath },
            caption: message,
          },
          { quoted: mek }
        );
      } else if (fileType.mime.startsWith('audio/')) {
        await Gifted.sendMessage(from, { text: message }, { quoted: mek });
      }
      await m.react('✅');
      fs.unlinkSync(tempFilePath);
    } catch (error) {
      console.error(error);
      reply(`An error occurred while uploading the file: ${error.message}`);
    }
  }
);


gmd({
    pattern: "fancy",
    alias: Array.from({ length: 35 }, (_, i) => `fancy${i + 1}`),    desc: "Generate fancy text styles.",
    desc: 'Generate Fancy Text Styles.',
    category: "tools",
    react: "🤔",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            await reply(`Hello *_${pushname}_,*\n Please use .fancy *_your_text_* ie ${prefix}fancy ali-Tech or ${prefix}fancy5 *_your_text_* ie ${prefix}fancy4 GiftedMd to get a specific style.`);
            return;
        }
        const styleMatch = command.match(/fancy(\d+)/);
        const number = styleMatch ? parseInt(styleMatch[1], 10) : null;
        const results = await GiftedFancy(q);  
        if (results && results.length > 0) {
            if (number !== null) {
                if (number > 0 && number <= results.length) {
                    const selectedResult = results[number - 1].result;
                    await Gifted.sendMessage(from, { text: `Fancy Text Style ${number}:\n\n${selectedResult}` }, { quoted: mek });
                } else {
                    reply(`Invalid style number. Please choose a number between 1 and ${results.length}.`);
                }
            } else {
                let formattedResults = 'Fancy Text Styles:\n\n';
                results.forEach((item, index) => {
                    if (item.result.trim()) { 
                        formattedResults += `${index + 1}. ${item.result}\n`;
                    }
                });
                if (formattedResults.trim() === 'Fancy Text Styles:') {
                    reply('No valid fancy text styles were generated.');
                } else {
                    await Gifted.sendMessage(from, { text: formattedResults.trim() }, { quoted: mek });
                }
            }
            await m.react("✅");
        } else {
            reply("No data found or the API response is incorrect.");
        }
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message || e}`); 
    }
});

 gmd({
    pattern: "wachannel",
    alias: ["wachannelstalk"],
    desc: "Stalk Whatsapp Channel.",
    category: "stalker",
    react: "🤔",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            return reply(`Hello *_${pushname}_,*\nPlease provide a WhatsApp Channel Url for stalking after the command, e.g., *${prefix}wachannel https://whatsapp.com/channel/0029VaYauR9ISTkHTj4xvi1l*`);
        }
        let res = await fetchJson(`${global.api}/stalk/wachannel?apikey=${global.myName}&url=${encodeURIComponent(q)}`);    
        if (res && res.result) {
            let txt = `
┌──「 *WACHANNEL STALK* 」
│▢ *🔖 Title:* ${res.result.title}
│▢ *👥 Followers:* ${res.result.followers}k
│▢ *🫂 Description:* ${res.result.description}
│▢ *🔗 WaLink* : ${q}
└────────────\n\n> ${global.caption}`;
            await Gifted.sendMessage(from, { image: { url: res.result.img }, caption: txt }, { quoted: mek });
            await m.react("✅");
        } else {
            reply("No data found or the API response is incorrect.");
        }
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message || e}`); 
    }
});     

gmd({
    pattern: "igstalk",
    alias: ["instastalk"],
    desc: "Stalk an Innstagram User.",
    category: "stalker",
    react: "🤔",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            return reply(`Hello *_${pushname}_,*\nPlease provide an Instagram Username for stalking after the command, e.g., *${prefix}igstalk giftedtechnexus*`);
        }
        let res = await fetchJson(`${global.api}/stalk/igstalk?apikey=${global.myName}&username=${encodeURIComponent(q)}`);
        if (res && res.result) {
            let txt = `
┌──「 *INSTAGRAM STALK* 」
│▢ *🔖 Name:* ${res.result.fullName}
│▢ *🔖 Username:* ${res.result.username}
│▢ *👥 Followers:* ${res.result.followers}
│▢ *🫂 Following:* ${res.result.following}
│▢ *📸 Posts:* ${res.result.posts}
│▢ *📌 Bio:* ${res.result.bio || 'No bio available'}
│▢ *🔗 Link* : https://instagram.com/${res.result.username.replace('@', '')}
└────────────\n\n> ${global.caption}`;
            await Gifted.sendMessage(from, { image: { url: config.BOT_PIC }, caption: txt }, { quoted: mek });
            await m.react("✅");
        } else {
            reply("No data found or the API response is incorrect.");
        }
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message || e}`); 
    }
});

gmd({
    pattern: "tiktokstalk",
    alias: ["ttstalk"],
    desc: "Stalk a Tiktok User.",
    category: "stalker",
    react: "🤔",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) {
            return reply(`Hello *_${pushname}_,*\nPlease provide a Tiktok Username for stalking after the command, e.g., *${prefix}ttstalk giftedtechke*`);
        }
let res = await Giftedttstalk(q);
      if (res && res.user.nickname && res.user.uniqueId && res.stats) {
        let txt = `
┌──「 *TIKTOK STALK* 」
│▢ *🔖 Name:* ${res.user.nickname}
│▢ *🔖 Username:* ${res.user.uniqueId}
│▢ *👥 Followers:* ${res.stats.followerCount}
│▢ *🫂 Following:* ${res.stats.followingCount}
│▢ *📌 Desc:* ${res.user.signature || 'No description available'}
│▢ *❤️ Likes:* ${res.stats.heartCount}
│▢ *🔗 Link* : https://tiktok.com/@${res.user.uniqueId}
└────────────\n\n> ${global.caption}`;
        await Gifted.sendMessage(from, { image: { url: res.user.avatarLarger }, caption: txt }, { quoted: mek });
        await m.react("✅");
        } else {
            reply("No data found or the API response is incorrect.");
        }
    } catch (e) {
        console.log(e); 
        reply(`Error: ${e.message || e}`); 
    }
});

gmd({
        pattern: 'take',
        alias: ['rename', 'stake'],
        react: "🐍",
        desc: 'Create a sticker with a custom pack name.',
        category: 'sticker',
        use: '<reply media or URL>',
        filename: __filename,
    },
    async (Gifted, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*Reply to any sticker.*`);
        if (!q) return reply(`*Please provide a pack name using .take <packname>*`);

        let mime = mek.quoted.mtype;
        let pack = q;

        if (mime === "imageMessage" || mime === "stickerMessage") {
            let media = await mek.quoted.download();
            let sticker = new Sticker(media, {
                pack: pack, 
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: "12345",
                quality: 75,
                background: 'transparent',
            });
            const buffer = await sticker.toBuffer();
            return Gifted.sendMessage(mek.chat, { sticker: buffer }, { quoted: mek });
        } else {
            return reply("*Uhh, Please reply to an sticker.*");
        }
    }
);
