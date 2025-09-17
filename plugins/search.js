const { generateWAMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const { gmd, config, fetchJson } = require('../lib'), 
      { PREFIX: prefix } = config, 
      axios = require('axios'), 
      yts = require('yt-search');

gmd({
  pattern: "yts",
  alias: ["youtubesearch", "ytsearch"],
  desc: "Search for YouTube Videos",
  category: "search",
  react: "🔍",
  filename: __filename,
  use: "<search query>"
}, async (Gifted, mek, message, { from, args, reply }) => {
  if (!args[0]) {
    return reply("Please provide a search query!");
  }
  const searchQuery = args.join(" ");
  try {
    const searchResults = await yts(searchQuery);
    if (!searchResults.videos.length) {
      return reply("No videos found for the given query.");
    }
    const firstVideo = searchResults.videos[0];
     let resultText = "*YouTube Search Results:*\n\n";
    searchResults.videos.slice(0, 10).forEach((video, index) => {
      resultText += index + 1 + ". *" + video.title + "*\n";
      resultText += "   Channel: " + video.author.name + "\n";
      resultText += "   Duration: " + video.duration.timestamp + "\n";
      resultText += "   Views: " + formatNumber(video.views) + "\n";
      resultText += "   Uploaded: " + video.ago + "\n";
      resultText += "   Link: " + video.url + "\n\n";
    });
    const giftedMess = {
      image: { url: firstVideo.thumbnail }, 
      caption: resultText,                  
      contextInfo: {
        mentionedJid: [message.sender],  
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
  } catch (error) {
    console.error("Error in YouTube search:", error);
    reply("❌ An error occurred while searching YouTube. Please try again later.");
  }
});

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  }
  return number.toString();
}


gmd({
  pattern: "test2",
  desc: "Check if Bot is Active.",
  react: "🖼️",
  category: "general",
  filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
  try {
    let responseText = "*BOT IS CURRENTLY ACTIVE!*";
    const giftedMess = {
      text: responseText,
      contextInfo: {
        externalAdReply: {
          title: "ACTIVE",
          sourceUrl: "https://whatsapp.com/channel/0029Vb3hlgX5kg7G0nFggl0Y",
          showAdAttribution: true,
          thumbnailUrl: `${config.BOT_PIC}` 
        }
      }
    };
    await Gifted.sendMessage(from, giftedMess, { quoted: mek });
    await m.react("✅");
  } catch (error) {
    console.error("Error in test2 command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});


gmd({
  pattern: "github",
  alias: ["gitstalk", "githubstalk"],
  desc: "Search/Stalk User on Github.",
  react: "🌍",
  category: "stalker",
  filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
  try {
    if (!q) {
      return reply(`Please provide a username, e.g., *${prefix}github mauricegift*`);
    }
    const { data } = await axios.get(`https://api.github.com/users/${q}`);
    if (!data) {
      return reply(`❌ No results found for username: *${q}*`);
    }
    const gitdata = data;
    const caption = `    *[ GITHUB USER INFO ]*
    
🚩 *Id :* ${gitdata.id || "N/A"}
🔖 *Nickname :* ${gitdata.name || "N/A"}
🔖 *Username :* ${gitdata.login || "N/A"}
✨ *Bio :* ${gitdata.bio || "N/A"}
🏢 *Company :* ${gitdata.company || "N/A"}
📍 *Location :* ${gitdata.location || "N/A"}
📧 *Email :* ${gitdata.email || "N/A"}
📰 *Blog :* ${gitdata.blog || "N/A"}
🔓 *Public Repo URL :* ${gitdata.repos_url || "N/A"}
🔐 *Public Gists URL :* ${gitdata.gists_url || "N/A"}
💕 *Followers :* ${gitdata.followers || "0"}
👉 *Following :* ${gitdata.following || "0"}
🔄 *Updated At :* ${new Date(gitdata.updated_at).toLocaleString() || "N/A"}
🧩 *Created At :* ${new Date(gitdata.created_at).toLocaleString() || "N/A"}
`;
    const giftedMess = {
      image: { url: gitdata.avatar_url || "https://via.placeholder.com/150" },
      caption: caption,
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
    await m.react("✅");
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    reply(`❌ An error occurred while processing your request:\n\n${error.message}`);
  }
});

gmd({
    pattern: "img",
    alias: ["image", "gimage", "googleimage"],
    desc: "Search for Images from Google.",
    react: "🖼️",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a search query for the image.");
        let response = await fetchJson(`${global.api}/search/googleimage?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        if (!response.results || response.results.length === 0) {
            return reply("No images found for the given query.");
        }
        let imageUrls = response.results.slice(0, 5);
        for (let url of imageUrls) {
            await Gifted.sendMessage(from, {
                image: { url },
                caption: `> ${global.footer}`
            }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});

gmd({
    pattern: "img2",
    alias: ["image2", "gimage2", "googleimage2"],
    desc: "Search for Images from Google.",
    react: "🖼️",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a search query.");

        const apiUrl = `${global.api}/search/googleimage?apikey=${global.myName}&query=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const results = response.data.results;

        if (!results || results.length === 0) {
            return reply("No images found for your search.");
        }

        const images = results.slice(0, 6); // limit to 6 for WhatsApp carousel
        const picked = [];

        for (const url of images) {
            try {
                const imgRes = await axios.get(url, { responseType: 'arraybuffer' });
                if (imgRes.status === 200) {
                    picked.push({
                        buffer: Buffer.from(imgRes.data),
                        directLink: url
                    });
                }
            } catch (e) {
                console.log(`Failed to fetch image: ${url}`);
            }
        }

        if (picked.length === 0) return reply("All image downloads failed.");

        const carouselCards = await Promise.all(
            picked.map(async (item, index) => ({
                header: {
                    title: `🖼️ Image ${index + 1}`,
                    hasMediaAttachment: true,
                    imageMessage: (await generateWAMessageContent({
                        image: item.buffer
                    }, {
                        upload: Gifted.waUploadToServer
                    })).imageMessage
                },
                body: {
                    text: `Search: ${q}`
                },
                footer: {
                    text: "🔁 Swipe to see more"
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: 'cta_url',
                            buttonParamsJson: JSON.stringify({
                                display_text: "🌐 View Image",
                                url: item.directLink
                            })
                        }
                    ]
                }
            }))
        );

        const carouselMessage = generateWAMessageFromContent(from, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        body: { text: `🔍 Results for: ${q}` },
                        footer: { text: `📦 Showing ${picked.length} images` },
                        carouselMessage: {
                            cards: carouselCards
                        }
                    }
                }
            }
        }, {
            quoted: mek
        });

        await Gifted.relayMessage(from, carouselMessage.message, {
            messageId: carouselMessage.key.id
        });

    } catch (e) {
        console.error("Error in image command:", e);
        reply("❌ An error occurred while fetching images.");
    }
});

 gmd({
    pattern: "pinterest",
    alias: ["pint", "pintimage", "pinterestimage"],
    desc: "Search for Media  from Pinterest.",
    react: "🖼️",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a search query for the image.");
        let response = await fetchJson(`${global.api}/search/pinterest?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        if (!response.results || response.results.length === 0) {
            return reply("No images found for the given query.");
        }
        let imageUrls = response.results.slice(0, 5);
        for (let url of imageUrls) {
            await Gifted.sendMessage(from, {
                image: { url },
                caption: `> ${global.footer}`
            }, { quoted: mek });
        }
    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});               

 gmd({
    pattern: "google",
    alias: ["ggle", "gsearch", "googlesearch"],
    desc: "Search from Google.",
    react: "🌍",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {    
        if (!q) return reply("Please provide a search query.");
        let data = await fetchJson(`${global.api}/search/google?apikey=${global.myName}&query=${encodeURIComponent(q)}`);
        if (data && data.success) {
            const results = data.results;
            if (results.length === 0) {
                return reply("❌ No results found for your query.");
            }
            let msg = `Google Search Results For: *${q}*\n\n`;
            for (let result of results) {
                msg += `☄︎ *Title*: ${result.title}\n`;
                msg += `☄︎ *Description*: ${result.description}\n`;
                msg += `☄︎ *Link*: ${result.url}\n\n────────────────────────\n\n`;
            }      
        const giftedMess = {
        text: `${msg}\n> ${global.footer}`,
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
      await m.react("✅"); 
        } else {
            reply("❌ Unable to fetch search results. Please try again.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

 gmd({
    pattern: "wiki",
    alias: ["wikimedia", "wiksearch", "wikipedia"],
    desc: "Search from Wikimedia Commons.",
    react: "🌍",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {    
        if (!q) return reply("Please provide a search query.");
        let data = await fetchJson(`${global.api}/search/wikimedia?apikey=${global.myName}&title=${encodeURIComponent(q)}`);
        if (data && data.success) {
            const results = data.results;
            if (results.length === 0) {
                return reply("❌ No results found for your query.");
            }
            let msg = `Wikimedia Search Results For: *${q}*\n\n`;
            for (let result of results) {
                msg += `☄︎ *Title*: ${result.title}\n`;
                msg += `☄︎ *Link*: ${result.source}\n`;
                msg += `☄︎ *Image*: ${result.image ? result.image : "No image available"}\n\n────────────────────────\n\n`;
            }    
        const giftedMess = {
        text: `${msg}\n> ${global.footer}`,
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
      await m.react("✅"); 
        } else {
            reply("❌ Unable to fetch search results. Please try again.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

gmd({
    pattern: "weather",
    alias: ["weathersearch", "forecast"],
    desc: "Get the Current Weather of a location.",
    react: "🌦️",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a location for the weather search.");
        let data = await fetchJson(`${global.api}/search/weather?apikey=${global.myName}&location=${encodeURIComponent(q)}`);   
        if (data && data.success) {
            const weather = data.result.weather;
            const main = data.result.main;
            const wind = data.result.wind;
            const sys = data.result.sys;
            const location = data.result.location;
            const icon = weather.icon;
            let msg = `Weather Info for *${location}*\n\n`;
            msg += `☄︎ *Weather*: ${weather.main} - ${weather.description}\n`;
            msg += `☄︎ *Temperature*: ${main.temp}°C (Feels like: ${main.feels_like}°C)\n`;
            msg += `☄︎ *Humidity*: ${main.humidity}%\n`;
            msg += `☄︎ *Wind Speed*: ${wind.speed} m/s\n`;
            msg += `☄︎ *Wind Gust*: ${wind.gust} m/s\n`;
            msg += `☄︎ *Visibility*: ${data.result.visibility / 1000} km\n`;
            msg += `☄︎ *Country*: ${sys.country}\n`;
            msg += `☄︎ *Sunrise*: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}\n`;
            msg += `☄︎ *Sunset*: ${new Date(sys.sunset * 1000).toLocaleTimeString()}\n`;
            msg += `☄︎ *Icon*: ${icon ? `https://openweathermap.org/img/wn/${icon}.png` : "No icon available"}\n\n`;
      const giftedMess = {
        text: `${msg}\n> ${global.footer}`,
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
      await m.react("✅");  
        } else {
       reply("❌ Unable to fetch weather information. Please try again.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

gmd({
    pattern: "npm",
    alias: ["npmsearch", "npmstalk"],
    desc: "Get Information of a Package.",
    react: "🤔",
    category: "stalker",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a package name for the npm search.");
         let data = await fetchJson(`${global.api}/search/npmsearch?apikey=${global.myName}&packagename=${encodeURIComponent(q)}`);
        if (data && data.success) {
      const {
        name,
        description,
        version,
        packageLink,
        downloadLink,
        publishedDate,
        owner,
        dependencies,
        keywords,
        homepage,
        license,
        readme,
      } = data.result;
      const keywordsText = keywords.length > 0 ? keywords.join(', ') : 'N/A';
      const dependenciesText = dependencies ? Object.keys(dependencies).join(', ') : 'N/A';
      const messageText = `Hello *_${m.pushName}_,*\nHere is your NPM Stalk Results:\n\n`
                        + `*Name:* ${name}\n*Owner:* ${owner}\n*Version:* ${version}\n`
                        + `*Published:* ${publishedDate}\n*Description:* ${description}\n`
                        + `*Package Link:* ${packageLink}\n*Download Link:* ${downloadLink}\n`
                        + `*Homepage:* ${homepage}\n*License:* ${license}\n`
                        + `*Readme:* ${readme || 'N/A'}\n\n> ${global.footer}`;
      const giftedMess = {
        text: messageText,
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
      await m.react("✅"); 
        } else {
       reply("❌ Unable to fetch npm information. Please try again.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

gmd({
    pattern: "lyrics",
    alias: ["lyricssearch"],
    desc: "Get Lyrics Information.",
    react: "🎶",
    category: "search",
    filename: __filename
}, async (Gifted, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        if (!q) return reply("Please provide a song name for the lyrics search.");
         let data = await fetchJson(`${global.api}/search/lyrics?apikey=${global.myName}&query=${encodeURIComponent(q)}`);      
        if (data && data.success) {
           /* const {
        Artist,
        Title,
        Lyrics,
      } = data.result;
      const messageText = `Lyrics Result For *${q}:*\n\n`
                        + `*Artist:* ${Artist}\n*Title:* ${Title}\n*Lyrics:* \n${Lyrics}\n\n> ${global.footer}`        */               
      const giftedMess = {
        text: data.result,
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
      await m.react("✅"); 
        } else {
      reply("❌ Unable to fetch lyrics information. Please try again.");
        }
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

gmd({
    pattern: "news",
    desc: "Get the Latest News Headlines.",
    category: "search",
    react: "📰",
    filename: __filename
},
async (Gifted, mek, m, { from, reply }) => {
    try {
        const giftedKey = "0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${giftedKey}`);
        const articles = response.data.articles;
        if (!articles || articles.length === 0) {
            return reply("No news articles found.");
        }
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            const article = articles[i];
            let message = `
📰 *${article.title}*
⚠️ _${article.description || "No description available"}_
🔗 ${article.url}

> ${global.footer}
            `.trim();
            if (article.urlToImage) {
                await Gifted.sendMessage(from, {
                    image: { url: article.urlToImage },
                    caption: `message\n\n> ${global.footer}`
                });
            } else {
                await Gifted.sendMessage(from, { text: message });
            }
        }
    } catch (e) {
        console.error("Error fetching news:", e.message);
        reply("Could not fetch news. Please try again later.");
    }
});


gmd({
    pattern: "movie",
    alias: ["omdb", "imdb"],
    desc: "Fetch Detailed Information About a Movie.",
    category: "search",
    react: "🎬",
    filename: __filename,
}, async (Gifted, mek, m, { from, reply, q, sender }) => {
    try {
        if (!q)
            return reply(`_Provide a Series or movie name_`); 
        let { data } = await axios.get(
            `http://www.omdbapi.com/?apikey=742b2d09&t=${q}&plot=full`
        );  
        if (!data || data.Response === "False")
            return reply(`*Please provide valid movie name!*`);
        let imdbt = 
            "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n" +
            " ```𝐌𝐎𝐕𝐈𝐄 𝐒𝐄𝐀𝐑𝐂𝐇```\n" +
            "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
        imdbt += "🎬Title      : " + data.Title + "\n";
        imdbt += "📅Year       : " + data.Year + "\n";
        imdbt += "⭐Rated      : " + data.Rated + "\n";
        imdbt += "📆Released   : " + data.Released + "\n";
        imdbt += "⏳Runtime    : " + data.Runtime + "\n";
        imdbt += "🌀Genre      : " + data.Genre + "\n";
        imdbt += "👨🏻‍💻Director   : " + data.Director + "\n";
        imdbt += "✍Writer     : " + data.Writer + "\n";
        imdbt += "👨Actors     : " + data.Actors + "\n";
        imdbt += "📃Plot       : " + data.Plot + "\n";
        imdbt += "🌐Language   : " + data.Language + "\n";
        imdbt += "🌍Country    : " + data.Country + "\n";
        imdbt += "🎖️Awards     : " + data.Awards + "\n";
        imdbt += "📦BoxOffice  : " + data.BoxOffice + "\n";
        imdbt += "🏙️Production : " + data.Production + "\n";
        imdbt += "🌟imdbRating : " + data.imdbRating + "\n";
        imdbt += "❎imdbVotes  : " + data.imdbVotes + "\n\n";  
        const giftedMess = {
            image: { url: data.Poster },
            caption: imdbt.trim(),
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
        await m.react("✅");
    } catch (error) {
        console.error("Error in movie command:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

