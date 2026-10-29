// types.ts
// src/types.ts

export type ClientType = "mariadb" | "postgresql" | string;
export type UploaderType = "telegram" | string;

export interface BaseClientConfig {
  type: ClientType;
  host: string;
  port: number;
  user: string;
  password?: string;
  database?: string;
  databases?: string[] | string;
}
export interface SQLiteClientConfig {
  type: "sqlite";
  database?: string;
  databases?: string[] | string;
}

export type ClientConfig = BaseClientConfig | SQLiteClientConfig;

export interface TelegramUploaderConfig {
  type: "telegram";
  token: string;
  chatId: string | number;
}

export type UploaderConfig =
  TelegramUploaderConfig | { type: string; [key: string]: any };

export interface Config {
  backupDir: string;
  clients: BaseClientConfig[];
  uploaders: UploaderConfig[];
}

export interface ClientRunner {
  run(): Promise<string[]>;
}

export interface UploaderRunner {
  upload(): Promise<void>;
}
