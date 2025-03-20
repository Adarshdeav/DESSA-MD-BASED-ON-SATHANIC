const { default: makeWASocket, useMultiFileAuthState, MessageType } = require('@whiskeysockets/baileys');
const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');

require('dotenv').config();
const config = require('./config');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') {
            console.log("✅ Bot is now connected!");
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const messageType = Object.keys(msg.message)[0];

        console.log(`📩 New Message from ${sender}: ${messageType}`);

        if (messageType === 'imageMessage' || messageType === 'videoMessage') {
            const caption = msg.message[messageType]?.caption || "";
            if (caption.startsWith('!sticker') || caption.startsWith('!s')) {
                await processSticker(sock, sender, msg, messageType);
            }
        }
    });

    return sock;
}

async function processSticker(sock, sender, msg, type) {
    console.log("🔄 Processing sticker...");

    const buffer = await sock.downloadMediaMessage(msg);
    const outputPath = `sticker_${Date.now()}.webp`;

    if (type === 'imageMessage') {
        await sharp(buffer)
            .resize(512, 512, { fit: 'contain' })
            .toFormat('webp')
            .toFile(outputPath);
    } else if (type === 'videoMessage') {
        await new Promise((resolve, reject) => {
            ffmpeg(buffer)
                .output(outputPath)
                .outputOptions([
                    '-vcodec libwebp',
                    '-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,format=rgba,pad=512:512:-1:-1:color=0x00000000',
                    '-loop 0',
                    '-preset default',
                    '-an',
                    '-vsync 0'
                ])
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
    }

    await sock.sendMessage(sender, { sticker: fs.readFileSync(outputPath) });
    fs.unlinkSync(outputPath); 
    console.log("✅ Sticker sent!");
}
sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid;
        const messageType = Object.keys(msg.message)[0];

        console.log(`📩 New Message from ${sender}: ${messageType}`);

        if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
            const text = msg.message.conversation || msg.message.extendedTextMessage.text;
            
            if (text.toLowerCase() === '!list' || text.toLowerCase() === '!help') {
                const commandList = `
🤖 *DESSA-MD Bot Commands*
━━━━━━━━━━━━━━━━━━
📌 *!ping* - Check bot response time
📌 *!info* - Get bot system info
📌 *!sticker* - Convert image/video to sticker
📌 *!help* or *!list* - Show this command list
━━━━━━━━━━━━━━━━━━
🔗 *More commands coming soon!*
                `;
                await sock.sendMessage(sender, { text: commandList });
            }
        }
    });
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session'); // Load saved session
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection }) => {
        if (connection === 'open') {
            console.log("✅ Bot is now connected to WhatsApp!");
        }
    });

    return sock;
}
// Load all plugins
    loadPlugins(sock);
}

function loadPlugins(sock) {
    const pluginPath = path.join(__dirname, "plugins");
    fs.readdirSync(pluginPath).forEach((file) => {
        if (file.endsWith(".js")) {
            const plugin = require(`./plugins/${file}`);
            if (typeof plugin === "function") {
                plugin(sock);
                console.log(`🔹 Plugin Loaded: ${file}`);
            }
        }
    });
}
// Start the bot
connectToWhatsApp().catch(err => console.error("❌ Bot Error:", err))
