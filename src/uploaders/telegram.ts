import fs from "fs";
import path from "path";
import type { TelegramUploaderConfig, UploaderRunner } from "../types";

export default class Telegram implements UploaderRunner {
  constructor(
    private filePath: string,
    private uploader: TelegramUploaderConfig,
  ) {}

  async upload(): Promise<void> {
    const { token, chatId } = this.uploader;
    const url = `https://api.telegram.org/bot${token}/sendDocument`;

    try {
      // Menggunakan fs.openAsBlob agar tidak memuat seluruh file besar sekaligus ke memori
      const fileBlob = await fs.openAsBlob(this.filePath);
      const filename = path.basename(this.filePath);

      const formData = new FormData();
      formData.append("chat_id", String(chatId));
      formData.append("document", fileBlob, filename);

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(
          data.description || "Gagal mengunggah file ke Telegram",
        );
      }

      console.log(`[Telegram] File ${filename} berhasil dikirim!`);
    } catch (err) {
      console.error(`[Telegram Error] Gagal mengirim ${this.filePath}:`, err);
    }
  }
}
