const { gmd, config, commands, fetchJson, getBuffer, GiftedApkDl } = require('../lib'), 
      { PREFIX: prefix } = config, 
      axios = require('axios'),
      fs = require('fs'),
      ffmpeg = require('fluent-ffmpeg'),
      GIFTED_DLS = require('gifted-dls'), 
      gifted = new GIFTED_DLS();
      yts = require('yt-search');

                    
gmd({
  pattern: "video",
  alias: ["ytmp4", "videodl", "videodoc", "ytmp4doc", "ytmp4dl"],
  desc: "Download Youtube Videos(mp4)",
  category: "downloader",
  react: "📽",
  filename: __filename
},
async (Gifted, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply(`Please provide a YouTube video name or URL!\n\n*Example:*\n${prefix}video Alan Walker - Faded\n${prefix}video https://youtu.be/example`);

    let videoUrl, title, thumbnail, duration, views, author;
    let downloadUrl;

    if (q.startsWith("https://youtu")) {
      const downloadData = await fetchJson(`${global.api}/download/ytmp4?apikey=${global.myName}&url=${encodeURIComponent(q)}`);
      if (!downloadData || !downloadData.result) return reply("❌ Failed to download video.");
      downloadUrl = downloadData.result.download_url;
      title = downloadData.result.title;
      thumbnail = downloadData.result.thumbnail;
      duration = downloadData.result.duration;
      views = downloadData.result.views;
      author = downloadData.result.author || "Unknown";
    } else {
      const searchData = await fetchJson(`${global.api}/search/yts?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
      if (!searchData || !searchData.results || !searchData.results[0]) return reply("❌ No results found for that video name.");
      const result = searchData.results[0];
      videoUrl = result.url;
      title = result.title;
      thumbnail = result.thumbnail;
      duration = result.timestamp;
      views = result.views;
      author = result.author.name;
      const downloadData = await fetchJson(`${global.api}/download/ytmp4?apikey=${global.myName}&url=${encodeURIComponent(videoUrl)}`);
      if (!downloadData || !downloadData.result) return reply("❌ Failed to fetch video from search.");
      downloadUrl = downloadData.result.download_url;
    }

    const buffer = await getBuffer(downloadUrl);

    const infoMess = {
      image: { url: thumbnail },
      caption: `\`「 VIDEO DOWNLOADER 」\`
╭─────────────────⳹
│🎬 *ᴛɪᴛʟᴇ:* ${title}
│📺 *ǫᴜᴀʟɪᴛʏ:* mp4 (720p)
│⏳ *ᴅᴜʀᴀᴛɪᴏɴ:* ${duration}
│👁 *ᴠɪᴇᴡs:* ${views}
│🎙 *ᴀʀᴛɪsᴛ:* ${author}
╰─────────────────⳹

*ʀᴇᴘʟʏ ᴡɪᴛʜ:*

*𝟷 ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴠɪᴅᴇᴏ 🎥*
*𝟸 ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ ᴅᴏᴄᴜᴍᴇɴᴛ 📄*

╭───────────────┄┈┈  
│ ${global.footer}
╰───────────────┄┈┈`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 5,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363318387454868@newsletter',
          newsletterName: "𝐀𝐋𝐈-𝐌𝐃 𝐒𝐔𝐏𝐏𝐎𝐑𝐓¬💸",
          serverMessageId: 143
        }
      }
    };

    await Gifted.sendMessage(from, {
            video: buffer,
            fileName: `${title}.mp4`,
            mimetype: "video/mp4",
            contextInfo: {
              externalAdReply: {
                title: title,
                body: 'ᴘσωєʀє∂ ву αℓι м∂',
                thumbnailUrl: thumbnail,
                sourceUrl: videoUrl || q,
                mediaType: 1
              }
            }
          }, { quoted: msg });

  } catch (err) {
    console.error("Video downloader error:", err);
    reply("❌ Something went wrong. Try again later.");
  }
});
    
