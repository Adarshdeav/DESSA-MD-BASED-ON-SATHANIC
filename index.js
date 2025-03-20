const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

// Load bot configuration
const config = require('./config'); 

// Session setup
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('session'); // Save session data in 'session/' directory
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Shows QR code in terminal
        syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds); // Save session updates

    // Event: When connected
    sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
        if (connection === 'close') {
            console.log("⚠️ Connection closed! Reconnecting...");
            connectToWhatsApp(); // Reconnect on disconnect
        } else if (connection === 'open') {
            console.log("✅ Bot is now connected!");
        }
    });

    // Event: When a new message arrives
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]; 
        if (!msg.message || msg.key.fromMe) return;

        const sender = msg.key.remoteJid; 
        const messageType = Object.keys(msg.message)[0];

        console.log(`📩 New Message from ${sender}: ${messageType}`);

        if (messageType === 'conversation' && msg.message.conversation === '!ping') {
            await sock.sendMessage(sender, { text: 'Pong! 🏓' });
        }
    });

    return sock;
}

// Start bot
connectToWhatsApp().catch(err => console.error("❌ Bot Error:", err));
