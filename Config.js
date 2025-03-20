const { Sequelize } = require('sequelize');
const fs = require('fs');

if (fs.existsSync('config.env')) {
  require('dotenv').config({ path: './config.env' });
}

const toBool = (x) => x === 'true';

const DATABASE_URL = process.env.DATABASE_URL || "./database.db";

module.exports = {
  AUDIO_DATA: process.env.AUDIO_DATA || 'DESSA-MD;Sathanicc;https://imgur.com/a/S6gaWJ0.jpeg',
  WARN_COUNT: process.env.WARN_COUNT || '3',
  LOGS: toBool(process.env.LOGS) || true,
  KOYEB_API: process.env.KOYEB_API || '',
  SERVERURL: process.env.SERVERURL || '',
  SERVER: process.env.SERVER || 'heroku',
  ALIVE_DATA: process.env.ALIVE_DATA || "_*Hi &sender, I am alive!*_\n\n_PLATFORM: &platform_\n_RUNTIME: &runtime_\n\n_. Type 'alive' to update this message._",
  IMGBB_KEY: [
    "76a050f031972d9f27e329d767dd988f",
    "deb80cd12ababea1c9b9a8ad6ce3fab2",
    "78c84c62b32a88e86daf87dd509a657a"
  ],
  SESSION_ID: process.env.SESSION_ID || 'ZnNneU5_D_E_S_S_A_M_D_ZcTU=',
  LANG: process.env.LANG || 'EN',
  AUTO_REACTION: toBool(process.env.AUTO_REACTION || 'true'),
  HANDLERS: process.env.HANDLER || '.',
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: 'main',
  PORT: process.env.PORT || 8000,
  STICKER_PACKNAME: process.env.STICKER_PACKNAME || 'DESSA-MD;Sathanicc',
  AUTO_STATUS_VIEWS: toBool(process.env.AUTO_STATUS_VIEWS || 'false'),
  WELCOME_MSG: process.env.WELCOME_MSG || 'Hi @user, Welcome to @gname!',
  GOODBYE_MSG: process.env.GOODBYE_MSG || 'Bye @user, It was nice having you!',
  AUTHOR: process.env.AUTHOR || 'Sathanicc',
  MEDIA_DATA: process.env.MEDIA_DATA || 'List Menu;DESSA-MD;https://imgur.com/a/S6gaWJ0.jpeg',
  SUDO: process.env.SUDO || '41782221168',
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
  BOT_INFO: process.env.BOT_INFO || 'DESSA-MD;Sathanicc;https://imgur.com/a/S6gaWJ0.jpeg',
  WORK_TYPE: process.env.WORK_TYPE || 'private',
  
  DATABASE: DATABASE_URL === "./database.db"
    ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: false })
    : new Sequelize(DATABASE_URL, {
        dialect: "postgres",
        ssl: true,
        protocol: "postgres",
        dialectOptions: {
          native: true,
          ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
      }),
};
