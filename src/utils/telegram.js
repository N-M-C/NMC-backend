const axios = require('axios');

// 디플이 Token 주소이다. 아마 Yowu의 소유일 테니 바꾸어 주자.
const TOKEN = '279865407:AAGVKqv6bijA0TpQY-rKuYnLmg2SRr15Uo8';
const TELEGRAM_BOT_URL = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

async function sendMessage(text, chat_id = process.env.TELEGRAM_CHAT_ID) {
  const sendResult = await axios.post(
    TELEGRAM_BOT_URL,
    {
      chat_id,
      text,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return sendResult;
}

module.exports = {
  sendMessage,
};
