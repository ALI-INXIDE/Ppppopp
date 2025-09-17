const { gmd, config, fetchJson } = require('../lib'), 
      { PREFIX: prefix } = config;

gmd({
    pattern: "galaxystyle",
    desc: "Fetch Galaxystyle Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}galaxystyle ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/galaxystyle?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "light",
    desc: "Fetch Light Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}light ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/lighteffect?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "texteffect",
    desc: "Fetch TextEffect Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}texteffect ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/texteffect?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "sunset",
    alias: ["1917"],
    desc: "Fetch 1917 Style Sunset Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}sunset ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/1917?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "neon",
    desc: "Fetch Neon Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}neon ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/makingneon?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "galaxy",
    desc: "Fetch Glaxy Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}galaxy ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/galaxy?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "sand",
    desc: "Fetch Sand Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}sand ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/sandsummer?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "gold",
    desc: "Fetch Gold Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}gold ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/luxurygold?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "beach",
    desc: "Fetch Beach Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}beach ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/summerbeach?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "watercolor",
    desc: "Fetch WaterrColor Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}watercolor ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/watercolor?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "gradient",
    desc: "Fetch Gradient Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}gradient ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/gradienttext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "clouds",
    desc: "Fetch Clouds Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}effectclouds ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/effectclouds?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "papercut",
    desc: "Fetch Papercut Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}papercut ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/papercut?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "logomaker",
    desc: "Fetch Logomaker Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}logomaker ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/logomaker?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "underwater",
    desc: "Fetch Underwater Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}underwater ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/underwater?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "glowing",
    desc: "Fetch Glowing Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}glowing ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/glowingtext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "cartoon",
    desc: "Fetch Cartoon Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}cartoon ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/cartoonstyle?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "deleting",
    desc: "Fetch Deleting Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}deleting ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/deletingtext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "blackpinkstyle",
    alias: ["pinkstyle"],
    desc: "Fetch BlankPinkStyle Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}pinkstyle ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/blackpinkstyle?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "america",
    desc: "Fetch American Flag Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}america ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/americanflag?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "nigeria",
    desc: "Fetch Nigerian Flag Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}nigeria ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/nigerianflag?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "typography",
    desc: "Fetch Typography Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}typography ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/typographytext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "pixel",
    desc: "Fetch Pixel Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}pixel ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/pixelglitch?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "glow",
    desc: "Fetch Glow Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}glow ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/advancedglow?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "glitch",
    alias: ["glitchtext"],
    desc: "Fetch Glitch Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}glitch ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/glitchtext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "blackpink",
    desc: "Fetch BlackPink Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}blackpink ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/blackpinklogo?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "writetext",
    alias: ["writeglass", "child", "glass"],
    desc: "Fetch WriteText Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}writetext ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/writetext?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});


gmd({
    pattern: "silver",
    desc: "Fetch Silver Logo Image.",
    category: "logo",
    react: "📸",
    filename: __filename
},
async (Gifted, mek, m, { from, quoted, args, reply }) => {
    try {
         const q = args.join(" ").trim();
           if (!q) {
            return reply(`Please provide text, e.g., ${prefix}silver ali Tech`);
        }
        const data = await fetchJson(`${global.api}/ephoto360/glossysilver?apikey=${global.myName}&text=${encodeURIComponent(q)}`);
        await Gifted.sendMessage(from, { 
            image: { url: data.result.image_url }, 
            caption: `Here is your logo:\n> ${global.footer}` 
        }, { quoted: mek });
        await m.react("✅"); 
    } catch (e) {
        console.error(e); 
        reply(`Error Generating Your Logo: ${e.message}`);
    }
});
