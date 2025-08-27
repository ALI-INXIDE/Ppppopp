const { gmd, config, commands, fetchJson, getBuffer, GiftedApkDl } = require('../lib'), 
      { PREFIX: prefix } = config, 
      axios = require('axios'),
      fs = require('fs'),
      ffmpeg = require('fluent-ffmpeg'),
      GIFTED_DLS = require('gifted-dls'), 
      gifted = new GIFTED_DLS();
      yts = require('yt-search');

                    
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
    alias: ["yta", "audio"], 
    react: "🎧", 
    desc: "Download YouTube song", 
    category: "download", 
    use: '.song <query>', 
    filename: __filename 
}, async (Gifted, mek, m, { from, sender, reply, q }) => { 
    try {
        if (!q) return reply("*𝐏ℓєα𝐬֟፝є 𝐏ʀ๏νιɖє 𝐀 𝐒๏ƞ͛g 𝐍αмє..*");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("Download failed. Try again later.");

    await Gifted.sendMessage(from, {
    audio: { url: data.result.downloadUrl },
    mimetype: "audio/mpeg",
    fileName: `${song.title}.mp3`,
    contextInfo: {
        externalAdReply: {
            title: song.title.length > 25 ? `${song.title.substring(0, 22)}...` : song.title,
            body: "⇆  ||◁◁ㅤ ❚❚ ㅤ▷▷||ㅤ ⇆",
            mediaType: 1,
            thumbnailUrl: song.thumbnail.replace('default.jpg', 'hqdefault.jpg'),
            sourceUrl: 'https://youtube.com/watch?v=OMoU0Pfibc4',
            mediaUrl: 'https://youtube.com/watch?v=OMoU0Pfibc4',
            showAdAttribution: true,
            renderLargerThumbnail: false
        }
    }
}, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred. Please try again.");
    }
});
