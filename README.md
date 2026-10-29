# 📦 All-in-One Backup Tools

A fast, modular, and lightweight multi-client backup utility powered by **[Bun](https://bun.sh)**. Designed to automate database dumps and file backups, with seamless parallel uploads to various storage destinations.

---

## ⚡ Core Features

- **Multi-Client Support**: Dump multiple databases (MariaDB, PostgreSQL, etc.) in a single workflow.
- **Multi-Destination Uploaders**: Instantly upload backups to destinations like Telegram, S3, or local storage in parallel.
- **High Performance**: Native shell integration (`bun $`) and streaming execution powered by Bun.
- **Zero Heavy Dependencies**: Built with native Web API standards (`fetch`, `FormData`, `Blob`).
- **Flexible Configuration**: Define database targets and destination uploaders in a single JSON config.

---

## 🚀 Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** `v1.3.4` or higher
- Database CLI clients (e.g., `mariadb-dump`, `pg_dump`, `gzip`) installed on the host machine.

### Installation

No installation required! You can run it directly using `bunx`:

```bash
bunx backup-tools path/to/config.json
```

## ⚙️ Configuration

Create a `config.json` file in your project or backup directory:

```json
{
  "backupDir": "/var/backups",
  "clients": [
    {
      "type": "mariadb",
      "host": "127.0.0.1",
      "port": 3306,
      "user": "root",
      "password": "your_password",
      "databases": ["db_prod_1", "db_prod_2"]
    },
    {
      "type": "postgresql",
      "host": "127.0.0.1",
      "port": 5432,
      "user": "postgres",
      "password": "your_password",
      "database": "analytics"
    }
  ],
  "uploaders": [
    {
      "type": "telegram",
      "token": "YOUR_BOT_TOKEN",
      "chatId": "-100123456789"
    }
  ]
}
```

## 🛠️ Project Architecture

```text
.
├── src/
│   ├── clients/        # Database dump engines (e.g., mariadb.ts, postgresql.ts)
│   ├── uploaders/      # Backup destinations (e.g., telegram.ts, s3.ts)
│   ├── index.ts        # Main CLI runner
│   ├── types.ts        # TypeScript configuration definitions
│   └── utils.ts        # Path resolver & database helpers
├── config.json.sample  # Configuration template
└── README.md

```

### Adding a New Client or Uploader

- **New Client**: Add a new module under `src/clients/<type>.ts` implementing the `ClientRunner` interface.
- **New Uploader**: Add a new module under `src/uploaders/<type>.ts` implementing the `UploaderRunner` interface.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request for new database client drivers, upload destinations, or feature enhancements.

## 📄 License

This project is licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
