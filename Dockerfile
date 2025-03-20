FROM quay.io/loki-xer/jarvis-md:latest
RUN https://github.com/sathanicc/DESSA-MD-BASED-ON-SATHANIC/root/DESSA-MD-BASED-ON-SATHANIC/
WORKDIR /root/Jarvis-md/
RUN yarn install --network-concurrency 1
CMD ["npm", "start"]
