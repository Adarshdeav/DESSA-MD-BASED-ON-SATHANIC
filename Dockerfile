FROM node:18-alpine
RUN https://github.com/sathanicc/DESSA-MD-BASED-ON-SATHANIC
WORKDIR /root/Jarvis-md/
RUN npm install --omit=dev
CMD ["node", "index.js"]
