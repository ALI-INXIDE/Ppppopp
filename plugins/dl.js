const { gmd, config, commands, fetchJson, getBuffer, GiftedApkDl } = require('../lib'), 
      { PREFIX: prefix } = config, 
      axios = require('axios'),
      fs = require('fs'),
      ffmpeg = require('fluent-ffmpeg'),
      GIFTED_DLS = require('gifted-dls'), 
      gifted = new GIFTED_DLS();
      yts = require('yt-search');
     fetch = require('node-fetch');

                    
gmd({
    pattern: "tiktok",
    alias: ["ttdl2", "tt", "tiktokdl2"],
    desc: "Download TikTok video without watermark",
    category: "download",
    react: "🎀",
    filename: __filename
},
async (Gifted, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("Invalid TikTok link.");
        
        reply("Downloading video, please wait...");
        
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);
        
        if (!data.status || !data.data) return reply("Failed to fetch TikTok video.");
        
        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;
        
        const caption = `> *© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽🚩°*`;
        
        await Gifted.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });
        
    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`An error occurred: ${e.message}`);
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
    pattern: "play",
    alias: ['ytsong', 'song'],
    react: "🎵",
    desc: "Download audio from YouTube",
    category: "download",
    filename: __filename
},
async (Gifted, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("*❌ Please provide a song title or YouTube URL*");

    try {
        const search = await yts(q);
        const video = search.videos[0];
        if (!video) return reply("*❌ No results found*");

        const messageContext = {
            ...newsletterContext,
            mentionedJid: [sender]
        };

        const infoMsg = `
╔═══〘 🎧 𝙈𝙋𝟛 𝘿𝙇 〙═══╗

⫸ 🎵 *Title:* ${video.title}
⫸ 👤 *Channel:* ${video.author.name}
⫸ ⏱️ *Duration:* ${video.timestamp}
⫸ 👁️ *Views:* ${video.views.toLocaleString()} views

╚══ ⸨ 𝙃𝘼𝙉𝙎 𝘽𝙔𝙏𝙀 𝙈𝘿 ⸩ ═══╝`.trim();

        await Gifted.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: infoMsg,
            contextInfo: messageContext
        }, { quoted: mek });

        // New API Call
        const api = `https://itzpire.com/download/youtube/v2?url=${encodeURIComponent(video.url)}`;
        const res = await fetch(api);
        const json = await res.json();

        if (!json.status || json.status !== 'success' || !json.data?.downloadUrl) {
            return reply("*❌ Failed to get audio download link*");
        }

        const title = video.title;

        // Send MP3 as audio message
        await Gifted.sendMessage(from, {
            audio: { url: json.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            ptt: false,
            contextInfo: messageContext
        }, { quoted: mek });

        // Send as document too
        await Gifted.sendMessage(from, {
            document: { url: json.data.downloadUrl },
            mimetype: 'audio/mp4',
            fileName: `${title}.mp3`,
            caption: "*📁 HANS BYTE MD*",
            contextInfo: messageContext
        }, { quoted: mek });

    } catch (err) {
        console.error("Audio Error:", err);
        return reply(`*❌ Error:* ${err.message}`);
    }
});          
