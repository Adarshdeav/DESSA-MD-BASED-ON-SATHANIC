FROM node:18-alpine
RUN https://github.com/sathanicc/DESSA-MD-BASED-ON-SATHANIC
WORKDIR /root/DESSA-MD-BASED-ON-SATHANIC/
RUN npm install --omit=dev
CMD ["node", "index.js"]
