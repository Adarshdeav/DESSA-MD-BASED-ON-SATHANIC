const fs = require("fs");

module.exports = (sock) => {
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (text?.toLowerCase() === "!list") {
            const commands = fs.readdirSync("./plugins").map(f => f.replace(".js", ""));
            await sock.sendMessage(msg.key.remoteJid, { text: `📜 *Available Commands:*\n\n${commands.map(c => `- *!${c}*`).join("\n")}` });
        }
    });
};
