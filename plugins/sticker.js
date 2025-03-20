const { writeFileSync } = require("fs");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = (sock) => {
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const isImage = msg.message.imageMessage;

        if (text?.toLowerCase() === "!sticker" && isImage) {
            const buffer = await downloadMediaMessage(msg, "buffer");
            writeFileSync("temp.png", buffer);
            
            await sock.sendMessage(msg.key.remoteJid, { sticker: { url: "temp.png" } });
        }
    });
};
