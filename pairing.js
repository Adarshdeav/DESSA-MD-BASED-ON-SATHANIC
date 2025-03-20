const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

async function generateQRCode() {
    const { state, saveCreds } = await useMultiFileAuthState('session'); // Stores session data
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true, // Print QR code in terminal
    });

    sock.ev.on('creds.update', saveCreds); // Save session credentials

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("📌 Scan this QR Code with WhatsApp:");
            qrcode.generate(qr, { small: true }); // Display QR in terminal
        }

        if (connection === 'open') {
            console.log("✅ WhatsApp Bot Paired Successfully!");
            process.exit(0); // Close script after successful pairing
        }

        if (connection === 'close') {
            console.log("❌ Disconnected! Retrying...");
            generateQRCode();
        }
    });
}

// Run pairing process
generateQRCode().catch(err => console.error("❌ QR Code Error:", err));
