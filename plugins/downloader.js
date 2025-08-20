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

gmd({
  pattern: "fbdl",
  alias: ["facebook", "fb"],
  react: '⏰',
  desc: "Download videos from Facebook.",
  category: "download",
  use: ".fbdl <Facebook video URL>",
  filename: __filename
}, async (Gifted, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a Facebook video URL
    const fbUrl = args[0];
    if (!fbUrl || !fbUrl.includes("facebook.com")) {
      return reply('*𝐏ℓєαʂє 𝐏ɼ๏νιɖє 𝐀 fb҇ 𝐕ιɖє๏ ๏ɼ ɼєєℓ 𝐔ɼℓ..*');
    }

    // Add a reaction to indicate processing
    await Gifted.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://apis.davidcyriltech.my.id/facebook2?url=${encodeURIComponent(fbUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.video) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    // Extract the video details
    const { title, thumbnail, downloads } = response.data.video;

    // Get the highest quality download link (HD or SD)
    const downloadLink = downloads.find(d => d.quality === "HD")?.downloadUrl || downloads[0].downloadUrl;

    // Inform the user that the video is being downloaded
   // await reply('```Downloading video... Please wait.📥```');

    // Download the video
    const videoResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video with details
    await Gifted.sendMessage(from, {
      video: videoBuffer,
      caption: `*🎡 fв νι∂єσ ∂σωиℓσα∂є∂*\n> *© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽🐍*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363318387454868@newsletter',
          newsletterName: '『 𝐀ɭīī 𝐌Ɗ 𝐅𝐁 𝐃𝐋 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await Gifted.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await Gifted.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

        
gmd({
  pattern: "tiktok",
  alias: ["ttdl", "tiktokdl","tt"],
  react: '⏰',
  desc: "Download TikTok videos.",
  category: "download",
  use: ".tiktok <TikTok video URL>",
  filename: __filename
}, async (Gifted, mek, m, { from, reply, args }) => {
  try {
    // Check if the user provided a TikTok video URL
    const tiktokUrl = args[0];
    if (!tiktokUrl || !tiktokUrl.includes("tiktok.com")) {
      return reply('Please provide a valid TikTok video URL. Example: `.tiktok https://tiktok.com/...`');
    }

    // Add a reaction to indicate processing
    await Gifted.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = `https://api.nexoracle.com/downloader/tiktok-nowm?apikey=free_key@maher_apis&url=${encodeURIComponent(tiktokUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || response.data.status !== 200 || !response.data.result) {
      return reply('❌ Unable to fetch the video. Please check the URL and try again.');
    }

    // Extract the video details
    const { title, thumbnail, author, metrics, url } = response.data.result;

    // Inform the user that the video is being downloaded
   // await reply(`📥 *Downloading TikTok video by @${author.username}... Please wait.*`);

    // Download the video
    const videoResponse = await axios.get(url, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Prepare the video buffer
    const videoBuffer = Buffer.from(videoResponse.data, 'binary');

    // Send the video with details
    await Gifted.sendMessage(from, {
      video: videoBuffer,
      caption: `*🎐 тιктσк ∂σωиℓσα∂є∂*\n` +
        `> *© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽🐍*`,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: false,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363318387454868@newsletter',
          newsletterName: '『 𝐀ɭīī 𝐌Ɗ 𝐒ʊ̊𝐏𝐏๏፝֟ɼʈ 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await Gifted.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading TikTok video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await Gifted.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

