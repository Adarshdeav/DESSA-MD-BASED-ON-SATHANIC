const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const express = require('express');
const QRCode = require('qrcode');

const app = express();
let qrCodeData = "";

async function generateQRCode() {
    const { state, saveCreds } = await useMultiFileAuthState('session'); // Saves session
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds); // Save session credentials

    sock.ev.on('connection.update', ({ connection, qr }) => {
        if (qr) {
            qrCodeData = qr; // Store the QR code string
            console.log("📌 Scan the QR Code in your browser");
        }

        if (connection === 'open') {
            console.log("✅ WhatsApp Bot Paired Successfully!");
        }
    });
}

// Start generating QR code
generateQRCode();

// Route to display QR code
app.get('/qr', async (req, res) => {
    if (!qrCodeData) {
        return res.send("QR Code not generated yet. Please wait...");
    }
    
    // Generate QR Code as image
    QRCode.toDataURL(qrCodeData, (err, url) => {
        if (err) return res.status(500).send("Error generating QR code");
        
        res.send(`<h2>Scan this QR Code with WhatsApp</h2><img src="${url}" width="300"/>`);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🌐 Visit http://localhost:${PORT}/qr to scan the QR Code`);
});
