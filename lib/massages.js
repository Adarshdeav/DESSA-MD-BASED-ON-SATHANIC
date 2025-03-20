async function sendMessage(sock, jid, text) {
    await sock.sendMessage(jid, { text });
}

async function sendSticker(sock, jid, imageBuffer) {
    await sock.sendMessage(jid, { sticker: imageBuffer });
}

module.exports = { sendMessage, sendSticker };
