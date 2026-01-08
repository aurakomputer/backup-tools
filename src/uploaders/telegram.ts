import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
export default class Telegram {
  filePath: string;
  uploader: any;

  constructor(filePath: string, uploader: any) {
    this.filePath = filePath;
    this.uploader = uploader;
  }

  async upload() {
    const { token, chatId } = this.uploader;

    const bot = new TelegramBot(token, { polling: false });

    // Mengirim file lokal
    bot
      .sendDocument(chatId, fs.createReadStream(this.filePath))
      .then(() => {
        console.log("File berhasil dikirim!");
      })
      .catch((err) => {
        console.error("Gagal mengirim file:", err);
      });
  }
}
