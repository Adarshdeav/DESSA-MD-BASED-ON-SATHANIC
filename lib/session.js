const { useMultiFileAuthState } = require("@whiskeysockets/baileys");

async function loadSession() {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    return { state, saveCreds };
}

module.exports = { loadSession };
