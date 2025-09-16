const { spawn } = require('child_process'),
      fs = require('fs'), 
      sharp = require('sharp'),
      zlib = require('zlib'),
      axios = require('axios'), 
      path = require('path'),
      FormData = require('form-data'), 
      cheerio = require('cheerio'),
      fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)),
      config = require('../config'),
      tempPath = "../temp",
      tempDir = path.join(__dirname, '../temp'),
      sessionDir = path.join(__dirname, 'session'),
      credsPath = path.join(sessionDir, 'creds.json'),
      createDirIfNotExist = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(tempDir);
createDirIfNotExist(sessionDir);

function monospace(input) {
    const boldz = {
        'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'G',
        'H': 'H', 'I': 'I', 'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N',
        'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R', 'S': 'S', 'T': 'T', 'U': 'U',
        'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔',
        '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' '
    };
    return input.split('').map(char => boldz[char] || char).join('');
}

global.myName = 'prince_api_56yjJ568dte4'; // Your custom key
global.caption = "𓆩ု᪳𝐀ɭīī 𝐌Ɗှ᪳𓆪";
global.api = "https://princeapi.zone.id/api"; // wow you brought them here
global.footer = "© ᴘσωєʀє∂ ву αℓι м∂⎯꯭̽🚩"; 
global.ytdl = "https://ytdl.giftedtech.web.id"; 
global.giftedCdn = "https://cdn.giftedtech.web.id";
global.princeRepo = "https://github.com/ALI-INXIDE/ALI-MD";
global.giftedApiRepo = "https://api.github.com/repos/ALI-INXIDE/ALI-MD";


async function convertStickerToImage(webpPath) {
    const outputPath = webpPath.replace('.webp', '.png');
    await sharp(webpPath)
        .toFormat('png')
        .toFile(outputPath);
    await fs.promises.unlink(webpPath); 
    return fs.promises.readFile(outputPath);
}


async function loadSession() {
  try {
    const credsId = config.SESSION_ID;

    if (!credsId || typeof credsId !== 'string') {
      throw new Error("❌ SESSION_ID is missing or invalid");
    }

    // === ALI-MDX~ Format ===
    if (credsId.startsWith('ALI-MDX~')) {
      console.log('🔁 Detected ALI-MDX~ Session Format');
      const sessionsKey = "prince@mayel_tech7x289";
      const sessionDir = path.join(__dirname, '../session');

      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      const response = await axios.get(`${global.sessionServer}/api/downloadCreds.php/${credsId}`, {
        headers: {
          'x-api-key': sessionsKey
        }
      });

      if (!response.data.credsData) {
        throw new Error('❌ No sessionData Received from Server');
      }

      const credsPath = path.join(sessionDir, 'creds.json');
      fs.writeFileSync(credsPath, JSON.stringify(response.data.credsData), 'utf8');
      console.log('✅ ALI-MDX Session Loaded Successfully');
      return response.data.credsData;
    }

    // === ALI-MD~ Format ===
    else if (credsId.startsWith('ALI-MD~')) {
      console.log('🔁 Detected ALI-MD~ Session Format');
      const sessionDir = path.join(__dirname, '../session');
      const sessionPath = path.join(sessionDir, 'creds.json');

      if (fs.existsSync(sessionPath)) {
        fs.unlinkSync(sessionPath);
        console.log("♻️ Old session removed");
      }

      const [header, b64data] = credsId.split('~');

      if (header !== "ALI-MD" || !b64data) {
        throw new Error("❌ Invalid session format. Expected 'ALI-MD~...'");
      }

      const cleanB64 = b64data.replace('...', ''); // Optional: in case "..." is present
      const compressedData = Buffer.from(cleanB64, 'base64');
      const decompressedData = zlib.gunzipSync(compressedData);

      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      fs.writeFileSync(sessionPath, decompressedData, "utf8");
      console.log("✅ ALI-MD Session Loaded Successfully");
      return true;
    }

    // === Unknown Format ===
    else {
      console.log('❌ Unknown SESSION_ID format. Must start with ALI-MDX~ or ALI-MD~');
      return false;
    }

  } catch (error) {
    console.error('❌ Session Load Error:', error.response?.data || error.message);
    return null;
  }
}


async function GiftedApkDl(appName) {
    try {
      const response = await axios.get("http://ws75.aptoide.com/api/7/apps/search", {
        params: {
          query: appName,
          limit: 1
        }
      });
      const appDetails = response.data.datalist.list[0];
      return {
        img: appDetails.icon,
        developer: appDetails.store.name,
        appname: appDetails.name,
        link: appDetails.file.path 
      };
    } catch (error) {
      console.error("Error fetching app information:", error);
      throw error;
    }
  }

async function Giftedttstalk(user) {
  try {
    const url = await fetch(`https://tiktok.com/@${user}`, {
      headers: {
        'User-Agent': 'PostmanRuntime/7.32.2'
      }
    });
    const html = await url.text();
    const $ = cheerio.load(html);
    const data = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').text();
    const result = JSON.parse(data);
    if (result['__DEFAULT_SCOPE__']['webapp.user-detail'].statusCode !== 0) {
      const ress = {
        status: 'error',
        message: 'User not found!',
      };
      console.log(ress);
      return ress;
    }
    const res = result['__DEFAULT_SCOPE__']['webapp.user-detail']['userInfo'];
    return res;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}


async function GiftedFancy(text) {
    return new Promise((resolve, reject) => {
        axios.get('http://qaz.wtf/u/convert.cgi?text='+text)
        .then(({ data }) => {
            let $ = cheerio.load(data)
            let hasil = []
            $('table > tbody > tr').each(function (a, b) {
                hasil.push({ name: $(b).find('td:nth-child(1) > h6 > a').text(), result: $(b).find('td:nth-child(2)').text().trim() })
            }),
            resolve(hasil)
        })
    })
}


async function giftedCdn(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }

  const form = new FormData();
  const fileStream = fs.createReadStream(path);
  form.append("file", fileStream);
  const originalFileName = path.split("/").pop(); 
  form.append("originalFileName", originalFileName);

  try {
    const response = await axios.post(`${global.giftedCdn}/api/upload.php`, form, {
      headers: {
        ...form.getHeaders(), 
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      throw new Error("No response received from the server.");
    } else {
      throw new Error(`Request Error: ${error.message}`);
    }
  }
}


async function getTempMail() {
    try {
        const url = `${global.api}/tempmail/generate?apikey=${global.myName}`;
        const res = await axios.get(url);
        if (res.data && res.data.success && res.data.result) {
            return {
                email: res.data.result.email,
                message: res.data.result.message
            };
        } else {
            throw new Error('API did not return a valid result.');
        }
    } catch (e) {
        throw new Error('Failed to fetch tempmail: ' + e.message);
    }
}

async function getTempMailInbox(email) {
    try {
        const url = `${global.api}/tempmail/inbox?apikey=${global.myName}&email=${encodeURIComponent(email)}`;
        const res = await axios.get(url);
        if (res.data && res.data.success && Array.isArray(res.data.result)) {
            return res.data.result;
        } else {
            throw new Error('API did not return a valid inbox result.');
        }
    } catch (e) {
        throw new Error('Failed to fetch tempmail inbox: ' + e.message);
    }
}
async function getTempMailMessage(email, messageid) {
    try {
        const url = `${global.api}/tempmail/message?apikey=${global.myName}&email=${encodeURIComponent(email)}&messageid=${encodeURIComponent(messageid)}`;
        const res = await axios.get(url);
        if (res.data && res.data.success && res.data.result && res.data.result.data) {
            return {
                id: res.data.result.data.id,
                html: res.data.result.data.html || "",
                text: res.data.result.data.text || ""
            };
        } else {
            throw new Error('API did not return a valid message result.');
        }
    } catch (e) {
        throw new Error('Failed to fetch tempmail message: ' + e.message);
    }
}

function ffmpeg(buffer, args = [], ext = "") {
  return new Promise(async (resolve, reject) => {
    try {
      let tmp = process.cwd() + "../temp/ffmpeg_" + Date.now() + "." + ext;
      let out = tmp + "." + ext;
      await fs.promises.writeFile(tmp, buffer);
      spawn("ffmpeg", ["-y", "-i", tmp, ...args, out])
        .on("error", reject)
        .on("close", async (code) => {
          try {
            await fs.promises.unlink(tmp);
            if (code !== 0) return reject(code);
            resolve({ data: await fs.promises.readFile(out), filename: out });
          } catch (e) {
            reject(e);
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}


function makeId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function toPTT(buffer, ext) {
  return ffmpeg(
    buffer,
    ["-vn", "-c:a", "libmp3lame", "-b:a", "128k", "-vbr", "on"],
    ext,
    "mp3",
  );
}

function toAudio(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-vn",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "128k",
      "-vbr",
      "on",
      "-compression_level",
      "10",
    ],
    ext,
    "mp3",
  );
}

function toVideo(buffer, ext) {
  return ffmpeg(
    buffer,
    [
      "-c:v",
      "libx264",
      "-c:a",
      "aac",
      "-ab",
      "128k",
      "-ar",
      "44100",
      "-crf",
      "32",
      "-preset",
      "slow",
    ],
    ext,
    "mp4",
  );
}

const getBuffer = async(url, options) => {
	try {
		options ? options : {}
		var res = await axios({
			method: 'get',
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(e)
	}
}

const getGroupAdmins = (participants) => {
	var admins = []
	for (let i of participants) {
		i.admin !== null  ? admins.push(i.id) : ''
	}
	return admins
}

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

const h2k = (eco) => {
	var lyrik = ['', 'K', 'M', 'B', 'T', 'P', 'E']
	var ma = Math.log10(Math.abs(eco)) / 3 | 0
	if (ma == 0) return eco
	var ppo = lyrik[ma]
	var scale = Math.pow(10, ma * 3)
	var scaled = eco / scale
	var formatt = scaled.toFixed(1)
	if (/\.0$/.test(formatt))
		formatt = formatt.substr(0, formatt.length - 2)
	return formatt + ppo
}

const isUrl = (url) => {
	return url.match(
		new RegExp(
			/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/,
			'gi'
		)
	)
}

const Json = (string) => {
    return JSON.stringify(string, null, 2)
}

const runtime = (seconds) => {
	seconds = Number(seconds)
	var d = Math.floor(seconds / (3600 * 24))
	var h = Math.floor(seconds % (3600 * 24) / 3600)
	var m = Math.floor(seconds % 3600 / 60)
	var s = Math.floor(seconds % 60)
	var dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : ''
	var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
	var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
	var sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

const sleep = async(ms) => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

const giftedTempmail = {
  create: async () => {
    const url = "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1";
    try {
      const response = await axios.get(url);
      return response.data; 
    } catch (error) {
      console.log(error);
      return null; 
    }
  },
  mails: async (username, domain) => {
    const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${username}&domain=${domain}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  emailContent: async (username, domain, emailId) => {
    const url = `https://www.1secmail.com/api/v1/?action=readMessage&login=${username}&domain=${domain}&id=${emailId}`;
    try {
      const response = await axios.get(url);
      const emailData = response.data;
      const htmlBody = emailData.htmlBody;
      const $ = cheerio.load(htmlBody); 
      const text = $.text(); 
      return text; 
    } catch (error) {
      console.log(error);
      return null; 
    }
  }
};

const fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

const GiftedAnticall = async (json, Gifted) => {
   for (const id of json) {
      if (id.status === 'offer') {
         if (config.ANTICALL === "true") {
            let msg = await Gifted.sendMessage(id.from, {
               text: `${config.ANTICALL_MSG}`,
               mentions: [id.from],
            });
            await Gifted.rejectCall(id.id, id.from);
         } else if (config.ANTICALL === "block") {
            let msg = await Gifted.sendMessage(id.from, {
               text: `${config.ANTICALL_MSG}\nYou are Being Blocked due to Calling While Anticall is Active!`,
               mentions: [id.from],
            });
            await Gifted.rejectCall(id.id, id.from); 
            await Gifted.updateBlockStatus(id.from, "block");
         }
      }
   }
};



async function eBasef(str = '') {
  return Buffer.from(str).toString('base64');
}

async function dBasef(base64Str) {
  return Buffer.from(base64Str, 'base64').toString('utf-8');
}

async function eBinary(str = '') {
  return str.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
}

async function dBinary(str) {
  let newBin = str.split(" ");
  let binCode = [];
  for (let i = 0; i < newBin.length; i++) {
    binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
  }
  return binCode.join("");
}

module.exports = {  GiftedAnticall, GiftedFancy, Giftedttstalk, giftedCdn, loadSession, makeId, convertStickerToImage, GiftedApkDl, giftedTempmail, getBuffer, monospace, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep , toAudio, toPTT, eBasef, dBasef, eBinary, dBinary, toVideo, ffmpeg, fetchJson, getTempMail,
    getTempMailInbox,
    getTempMailMessage };
