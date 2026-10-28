import fs from "fs";

export default class Telegram {
  filePath: string;
  uploader: {
    token: string;
    chatId: string | number;
  };

  constructor(filePath: string, uploader: any) {
    this.filePath = filePath;
    this.uploader = uploader;
  }

  async upload() {
    const { token, chatId } = this.uploader;
    const url = `https://api.telegram.org/bot${token}/sendDocument`;

    try {
      // 1. Baca file dan ubah menjadi Blob / File standar Node.js
      const fileBuffer = fs.readFileSync(this.filePath);
      const filename = this.filePath.split("/").pop() || "document";
      const fileBlob = new Blob([fileBuffer]);

      // 2. Buat FormData native
      const formData = new FormData();
      formData.append("chat_id", String(chatId));
      formData.append("document", fileBlob, filename);

      // 3. Kirim request menggunakan native fetch
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.description || "Gagal mengunggah file");
      }

      console.log("File berhasil dikirim!");
    } catch (err) {
      console.error("Gagal mengirim file:", err);
    }
  }
}
