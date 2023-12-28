import { Telegraf } from 'telegraf';

import { about, Bots, host, Social, Trainging, website } from './commands';
import { greeting, servicing } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

// bot.command('about', about());
// bot.command('services', servicing());
// bot.command('Website', website());
// bot.command('Host', host());
// bot.command('Social', Social());
// bot.command('Training', Trainging());
// bot.command('Telegram',Bots())
 //bot.on('message', greeting());




const webLink = 'https://testingbot-8rcz.onrender.com';
const channelId = '@babyloncenter_net'; // Replace with your channel username or ID



bot.start((ctx) =>
  ctx.reply('اهلا وسهلا بكم في مطعمكم!', {
    reply_markup: {
      keyboard: [[{ text: 'اضغط هنا لفتح قائمة الطعام', web_app: { url: webLink } }]],
    },
  })
);

bot.on('message', async (ctx) => {
  try {
    // Use 'any' type to avoid TypeScript errors
    const receivedData = JSON.parse((ctx.message as any).web_app_data.data);

    const cartItems = receivedData.cartItems;
    const phoneNumber = receivedData.phoneNumber;
    const address = receivedData.address;
    const notice = receivedData.notice;
    for (const item of cartItems) {
      const title = item.title;
      const price = item.price;

      //console.log('Received item - Title:', title, 'Price:', price);

      // ctx.replyWithMarkdown(
      //   `${ctx.from.first_name}\n` +
      //   `Received item:\n` +
      //   `- *Title*: ${title}\n` +
      //   `- *Price*: ${price}\n` +
      //   `- *Phone Number*: ${phoneNumber}\n` +
      //   `- *Address*: ${address}`
      // );
      ctx.replyWithMarkdown(
        `${ctx.from.first_name}\n` +
        `تم ارسال الطلب التالي:\n` +
        `- *المادة*: ${title}\n` +
        `- *السعر*: ${price}\n` +
        `- *رقم الهاتف*: ${phoneNumber}\n` +
        `- *العنوان*: ${address}\n` +
        `- *الملاحظات*: ${notice}`
      );
      
      // Prepare a message for the channel
      const message = `تم استلام طلب جديد:\n` +
        `${ctx.from.first_name}\n` +
        `- *المادة: ${title}\n` +
        `- *السعر*: ${price}\n` +
        `- *رقم الهاتف*: ${phoneNumber}\n` +
        `- *العنوان*: ${address}\n` +
        `- *الملاحظات*: ${notice}`;
      
    
      // const message = `New order received:\n` +
      //   `${ctx.from.first_name}\n` +
      //   `- *Title*: ${title}\n` +
      //   `- *Price*: ${price}\n` +
      //   `- *Phone Number*: ${phoneNumber}\n` +
      //   `- *Address*: ${address}`;

      // Add logging
      console.log('Sending message to channel:', message);
      try {
        const result = await bot.telegram.sendMessage(channelId, message, { parse_mode: 'Markdown' });
        console.log('Telegram API result:', result);
      } catch (error) {
        console.error('Telegram API error:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing received data:', error);
  }
});


bot.on('text', (ctx) => {
  const data = ctx.message.text;
  console.log('Received data from user:', data);
  // Process the received data as needed
});





//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};

//dev mode
ENVIRONMENT !== 'production' && development(bot);
export { bot };