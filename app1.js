const { ask, generateImg } = require("./ai.js");
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('AUTHENTICATED');
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', async (message) => {
  const prompt = message.body; 
  const answer = await ask(prompt); 

  // generate image if the answer starts with "https"
  if (answer.startsWith("https")) {
    const media = await MessageMedia.fromUrl(answer);
    client.sendMessage(message.from, media, {
      caption: prompt,
    });
  } else {
    message.reply(answer);
  }
});
